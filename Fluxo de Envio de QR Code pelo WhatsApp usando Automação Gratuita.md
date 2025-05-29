# Fluxo de Envio de QR Code pelo WhatsApp usando Automação Gratuita

## Visão Geral

Este documento detalha o fluxo de envio de QR codes pelo WhatsApp utilizando métodos de automação gratuitos, eliminando a necessidade de APIs pagas ou serviços de terceiros com custos. A solução proposta utiliza bibliotecas de código aberto para interagir com o WhatsApp Web, permitindo o envio automatizado de mensagens sem custos adicionais.

## Tecnologias Recomendadas

### Bibliotecas Principais
- **whatsapp-web.js**: Biblioteca Node.js que implementa uma API não oficial para WhatsApp Web
- **puppeteer**: Biblioteca para controle automatizado do navegador Chrome/Chromium
- **qrcode-generator**: Para geração dos QR codes dos convidados
- **node-cron**: Para agendamento de envios em lote

### Requisitos de Infraestrutura
- Servidor ou computador com acesso à internet para manter a sessão do WhatsApp Web
- Número de telefone dedicado para o sistema (pode ser um chip pré-pago comum)
- Navegador Chromium instalado no servidor

## Arquitetura da Solução

### Componentes do Sistema
1. **Serviço de Geração de QR Code**: Gera QR codes únicos para cada convidado
2. **Gerenciador de Fila de Mensagens**: Organiza e controla o envio para evitar bloqueios
3. **Cliente WhatsApp**: Mantém a sessão do WhatsApp Web e realiza os envios
4. **Sistema de Monitoramento**: Acompanha status de envio e registra falhas

### Diagrama de Fluxo
```
[Painel Admin] → [Geração QR Code] → [Fila de Mensagens] → [Cliente WhatsApp] → [Convidado]
                                                        ↑           ↓
                                      [Sistema de Monitoramento] ← [Log de Envios]
```

## Processo de Configuração Inicial

### 1. Preparação do Ambiente
```javascript
// Instalação das dependências
npm install whatsapp-web.js puppeteer qrcode-generator node-cron

// Estrutura de diretórios
// /src
//   /services
//     whatsapp-service.js
//     qrcode-service.js
//   /models
//     guest.js
//     event.js
//   /controllers
//     message-controller.js
//   /utils
//     queue-manager.js
```

### 2. Autenticação Inicial do WhatsApp
```javascript
// whatsapp-service.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa o cliente WhatsApp
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Gera QR code para autenticação inicial (feita apenas uma vez)
client.on('qr', (qr) => {
  console.log('QR RECEBIDO, escaneie com seu WhatsApp:');
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Cliente WhatsApp conectado e pronto para enviar mensagens!');
});

client.initialize();
```

### 3. Persistência da Sessão
```javascript
// whatsapp-service.js (continuação)
const fs = require('fs');

// Configuração para salvar e restaurar sessão
const SESSION_FILE_PATH = './whatsapp-session.json';

// Salva sessão quando autenticado
client.on('authenticated', (session) => {
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

// Carrega sessão existente ao iniciar
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});
```

## Fluxo de Envio de QR Code

### 1. Geração do QR Code para Convidados
```javascript
// qrcode-service.js
const QRCode = require('qrcode-generator');
const fs = require('fs');
const path = require('path');

// Função para gerar QR code para um convidado
async function generateGuestQRCode(guestId, eventId) {
  // Cria payload com informações criptografadas
  const payload = {
    guestId,
    eventId,
    timestamp: Date.now()
  };
  
  // Gera string codificada para o QR code
  const qrData = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  // Gera QR code como imagem
  const qr = QRCode(0, 'M');
  qr.addData(qrData);
  qr.make();
  
  // Define caminho para salvar a imagem
  const qrImagePath = path.join(__dirname, '../../public/qrcodes', `${guestId}.png`);
  
  // Salva imagem do QR code
  fs.writeFileSync(qrImagePath, qr.createDataURL());
  
  return {
    qrData,
    qrImagePath
  };
}

module.exports = { generateGuestQRCode };
```

### 2. Gerenciador de Fila de Mensagens
```javascript
// queue-manager.js
const EventEmitter = require('events');

class MessageQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.processing = false;
    this.rateLimit = {
      messagesPerMinute: 10,
      lastSent: Date.now()
    };
  }
  
  // Adiciona mensagem à fila
  addToQueue(message) {
    this.queue.push(message);
    this.emit('message-added', message);
    
    if (!this.processing) {
      this.processQueue();
    }
  }
  
  // Processa a fila respeitando limites de envio
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    
    // Respeita limite de mensagens por minuto para evitar bloqueio
    const now = Date.now();
    const timeElapsed = now - this.rateLimit.lastSent;
    const waitTime = Math.max(0, (60000 / this.rateLimit.messagesPerMinute) - timeElapsed);
    
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    const message = this.queue.shift();
    this.emit('process-message', message);
    
    this.rateLimit.lastSent = Date.now();
    
    // Continua processando a fila
    setTimeout(() => this.processQueue(), 100);
  }
}

module.exports = new MessageQueue();
```

### 3. Controlador de Mensagens
```javascript
// message-controller.js
const whatsappService = require('../services/whatsapp-service');
const qrcodeService = require('../services/qrcode-service');
const messageQueue = require('../utils/queue-manager');
const fs = require('fs');

// Função para preparar e enviar mensagem com QR code
async function sendQRCodeMessage(guest, event) {
  try {
    // Gera QR code para o convidado
    const { qrImagePath } = await qrcodeService.generateGuestQRCode(guest.id, event.id);
    
    // Compõe mensagem personalizada
    const message = {
      to: guest.phone,
      text: `Olá, ${guest.name}!\n\nVocê está convidado para ${event.name} que acontecerá no dia ${event.date} às ${event.time} em ${event.location}.\n\nSeu convite digital está anexado a esta mensagem. Basta apresentar o QR Code na entrada do evento para liberação rápida do seu acesso.\n\nEm caso de dúvidas, entre em contato: ${event.contactPhone}`,
      media: qrImagePath,
      guestId: guest.id,
      eventId: event.id,
      attempts: 0
    };
    
    // Adiciona mensagem à fila de envio
    messageQueue.addToQueue(message);
    
    return { success: true, message: 'Mensagem adicionada à fila de envio' };
  } catch (error) {
    console.error('Erro ao preparar mensagem:', error);
    return { success: false, error: error.message };
  }
}

// Processa mensagens da fila
messageQueue.on('process-message', async (message) => {
  try {
    // Verifica se o número está formatado corretamente
    const formattedNumber = formatPhoneNumber(message.to);
    
    // Envia mensagem via WhatsApp
    const chat = await whatsappService.client.getChatById(`${formattedNumber}@c.us`);
    
    // Envia texto
    await chat.sendMessage(message.text);
    
    // Envia imagem do QR code
    const media = MessageMedia.fromFilePath(message.media);
    await chat.sendMessage(media);
    
    // Registra envio bem-sucedido
    logMessageStatus(message.guestId, 'sent');
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${message.to}:`, error);
    
    // Tenta reenviar até 3 vezes em caso de falha
    if (message.attempts < 3) {
      message.attempts++;
      setTimeout(() => {
        messageQueue.addToQueue(message);
      }, 60000 * message.attempts); // Aumenta o tempo entre tentativas
    } else {
      // Registra falha após 3 tentativas
      logMessageStatus(message.guestId, 'failed', error.message);
    }
  }
});

// Formata número de telefone para padrão internacional
function formatPhoneNumber(phone) {
  // Remove caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não existir
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }
  
  return cleaned;
}

// Registra status de envio no banco de dados
function logMessageStatus(guestId, status, errorMessage = null) {
  // Implementação depende do banco de dados escolhido
  console.log(`Mensagem para convidado ${guestId}: ${status}`);
}

module.exports = { sendQRCodeMessage };
```

### 4. Envio em Lote para Eventos
```javascript
// batch-sender.js
const messageController = require('../controllers/message-controller');
const Guest = require('../models/guest');
const Event = require('../models/event');
const cron = require('node-cron');

// Função para enviar QR codes para todos os convidados de um evento
async function sendQRCodesForEvent(eventId) {
  try {
    // Busca informações do evento
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    
    // Busca todos os convidados do evento
    const guests = await Guest.findByEventId(eventId);
    
    console.log(`Iniciando envio de QR codes para ${guests.length} convidados do evento ${event.name}`);
    
    // Envia QR code para cada convidado
    for (const guest of guests) {
      await messageController.sendQRCodeMessage(guest, event);
      
      // Pequeno intervalo entre adições à fila para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return { success: true, message: `QR codes enfileirados para ${guests.length} convidados` };
  } catch (error) {
    console.error('Erro ao enviar QR codes em lote:', error);
    return { success: false, error: error.message };
  }
}

// Configura envio programado (exemplo: enviar lembretes 1 dia antes do evento)
function scheduleReminderForEvent(eventId, daysBefore = 1) {
  // Busca data do evento
  const event = await Event.findById(eventId);
  const eventDate = new Date(event.date);
  
  // Calcula data para envio do lembrete
  const reminderDate = new Date(eventDate);
  reminderDate.setDate(reminderDate.getDate() - daysBefore);
  
  // Formata data para cron
  const month = reminderDate.getMonth() + 1;
  const day = reminderDate.getDate();
  const hour = 10; // Enviar às 10h da manhã
  
  // Agenda tarefa
  cron.schedule(`0 ${hour} ${day} ${month} *`, () => {
    console.log(`Enviando lembretes programados para evento ${event.name}`);
    sendQRCodesForEvent(eventId);
  });
}

module.exports = { sendQRCodesForEvent, scheduleReminderForEvent };
```

## Monitoramento e Tratamento de Erros

### 1. Sistema de Logs
```javascript
// logger.js
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');
const MESSAGE_LOG = path.join(LOG_DIR, 'messages.log');

// Garante que o diretório de logs existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logMessageEvent(type, data) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    data
  };
  
  fs.appendFileSync(MESSAGE_LOG, JSON.stringify(logEntry) + '\n');
}

module.exports = { logMessageEvent };
```

### 2. Monitoramento de Status do WhatsApp
```javascript
// whatsapp-monitor.js
const whatsappService = require('../services/whatsapp-service');
const logger = require('./logger');

// Monitora estado da conexão
whatsappService.client.on('disconnected', (reason) => {
  logger.logMessageEvent('whatsapp_disconnected', { reason });
  
  // Tenta reconectar após desconexão
  setTimeout(() => {
    whatsappService.client.initialize();
  }, 10000);
});

// Verifica periodicamente o estado da conexão
setInterval(() => {
  const state = whatsappService.client.getState();
  logger.logMessageEvent('whatsapp_state_check', { state });
  
  if (state !== 'CONNECTED') {
    logger.logMessageEvent('whatsapp_reconnect_attempt', {});
    whatsappService.client.initialize();
  }
}, 30 * 60 * 1000); // Verifica a cada 30 minutos
```

## Considerações de Segurança e Limitações

### Segurança
- A sessão do WhatsApp deve ser mantida em ambiente seguro
- Dados dos convidados devem ser criptografados no banco de dados
- Acesso ao painel administrativo deve ser protegido por autenticação forte

### Limitações da Abordagem Gratuita
- Risco de bloqueio temporário do número se houver envio massivo
- Necessidade de manter um computador/servidor ligado com a sessão do WhatsApp ativa
- Possíveis interrupções se o WhatsApp Web mudar sua estrutura ou API

### Mitigação de Riscos
- Implementar envio gradual com intervalos entre mensagens
- Limitar a quantidade de mensagens por dia (recomendado: máximo 200 mensagens/dia)
- Manter sistema de backup para envio por e-mail caso o WhatsApp falhe
- Monitorar ativamente o status da conexão e logs de erro

## Alternativas em Caso de Bloqueio

### Plano B: Envio Manual Assistido
Se o número for temporariamente bloqueado para envios automatizados:

1. Sistema gera QR codes e prepara mensagens
2. Interface exibe mensagem pronta para copiar/colar
3. Operador usa WhatsApp Web manualmente para enviar mensagens
4. Sistema registra envios confirmados pelo operador

### Plano C: Envio por E-mail
Como alternativa completa ao WhatsApp:

1. Configurar serviço de e-mail gratuito (Nodemailer + Gmail)
2. Adaptar templates para formato de e-mail
3. Incluir QR code como anexo ou imagem incorporada
4. Implementar sistema de confirmação de recebimento

## Conclusão

O fluxo de envio de QR code pelo WhatsApp usando automação gratuita é viável e pode ser implementado sem custos, utilizando bibliotecas de código aberto como whatsapp-web.js. A solução proposta mantém todas as funcionalidades essenciais do sistema, permitindo o envio automatizado de QR codes para os convidados de forma personalizada.

Para garantir o funcionamento adequado, é importante seguir as recomendações de limitação de envios, monitoramento constante e implementação de planos alternativos em caso de falhas. Com essas precauções, o sistema pode operar de forma confiável e sem custos para eventos de pequeno e médio porte.
