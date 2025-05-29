require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const API_TOKEN = process.env.API_TOKEN;
const SESSION_DIR = path.join(__dirname, 'sessions');

// Garantir que o diretório de sessões exista
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

// Configurar cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: SESSION_DIR
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Configurar axios com token de autenticação
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': API_TOKEN
  }
});

// Variáveis de estado
let isReady = false;
let pendingMessages = [];
let processingQueue = false;

// Evento quando o QR code é recebido (para autenticação inicial)
client.on('qr', (qr) => {
  console.log('QR Code recebido. Escaneie com seu WhatsApp:');
  qrcode.generate(qr, { small: true });
  
  // Salvar QR code em arquivo para acesso via web
  fs.writeFileSync(path.join(__dirname, 'qrcode.txt'), qr);
});

// Evento quando o cliente está pronto
client.on('ready', () => {
  console.log('Cliente WhatsApp conectado e pronto!');
  isReady = true;
  
  // Processar mensagens pendentes
  processQueue();
});

// Evento quando o cliente é autenticado
client.on('authenticated', () => {
  console.log('Autenticação bem-sucedida!');
});

// Evento quando a autenticação falha
client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação:', msg);
  isReady = false;
});

// Evento quando o cliente é desconectado
client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
  isReady = false;
  
  // Tentar reconectar após 10 segundos
  setTimeout(() => {
    console.log('Tentando reconectar...');
    client.initialize();
  }, 10000);
});

// Função para enviar mensagem com QR code
async function sendQRCodeMessage(phone, guestName, eventName, qrCodeUrl) {
  if (!isReady) {
    console.log(`Cliente não está pronto. Adicionando mensagem para ${phone} à fila.`);
    pendingMessages.push({ phone, guestName, eventName, qrCodeUrl });
    return { success: false, message: 'Cliente WhatsApp não está pronto. Mensagem adicionada à fila.' };
  }
  
  try {
    // Formatar número de telefone (remover caracteres não numéricos e adicionar código do país se necessário)
    const formattedPhone = formatPhoneNumber(phone);
    
    // Verificar se o número existe no WhatsApp
    const isRegistered = await client.isRegisteredUser(`${formattedPhone}@c.us`);
    if (!isRegistered) {
      return { success: false, message: `O número ${phone} não está registrado no WhatsApp.` };
    }
    
    // Baixar a imagem do QR code
    const qrCodePath = await downloadQRCode(qrCodeUrl, formattedPhone);
    
    // Enviar mensagem de texto
    const message = `*Olá, ${guestName}!*\n\nVocê foi convidado para o evento: *${eventName}*\n\nApresente o QR code abaixo na entrada do evento para liberar seu acesso.\n\n_Este é um convite pessoal e intransferível._`;
    await client.sendMessage(`${formattedPhone}@c.us`, message);
    
    // Enviar QR code como imagem
    const media = MessageMedia.fromFilePath(qrCodePath);
    await client.sendMessage(`${formattedPhone}@c.us`, media, { caption: 'Seu QR code de acesso' });
    
    console.log(`Mensagem enviada com sucesso para ${phone}`);
    return { success: true, message: `Mensagem enviada com sucesso para ${phone}` };
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${phone}:`, error);
    return { success: false, message: `Erro ao enviar mensagem: ${error.message}` };
  }
}

// Função para processar a fila de mensagens pendentes
async function processQueue() {
  if (processingQueue || pendingMessages.length === 0 || !isReady) return;
  
  processingQueue = true;
  console.log(`Processando fila de mensagens (${pendingMessages.length} pendentes)...`);
  
  while (pendingMessages.length > 0 && isReady) {
    const message = pendingMessages.shift();
    console.log(`Enviando mensagem pendente para ${message.phone}...`);
    
    try {
      await sendQRCodeMessage(
        message.phone,
        message.guestName,
        message.eventName,
        message.qrCodeUrl
      );
      
      // Pequeno intervalo entre mensagens para evitar bloqueio
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Erro ao processar mensagem pendente para ${message.phone}:`, error);
    }
  }
  
  processingQueue = false;
  console.log('Processamento da fila concluído.');
}

// Função para formatar número de telefone
function formatPhoneNumber(phone) {
  // Remover caracteres não numéricos
  let formatted = phone.replace(/\D/g, '');
  
  // Adicionar código do país (Brasil) se não estiver presente
  if (formatted.length === 11 || formatted.length === 10) {
    formatted = '55' + formatted;
  }
  
  return formatted;
}

// Função para baixar QR code
async function downloadQRCode(url, phone) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const filePath = path.join(__dirname, 'temp', `qrcode_${phone}.png`);
  
  // Garantir que o diretório temp exista
  if (!fs.existsSync(path.join(__dirname, 'temp'))) {
    fs.mkdirSync(path.join(__dirname, 'temp'), { recursive: true });
  }
  
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

// Inicializar cliente
client.initialize();

// Exportar funções para uso na API
module.exports = {
  sendQRCodeMessage,
  getStatus: () => ({ isReady, pendingMessages: pendingMessages.length })
};
