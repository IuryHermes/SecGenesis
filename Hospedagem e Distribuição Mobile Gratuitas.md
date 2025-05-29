# Hospedagem e Distribuição Mobile Gratuitas

## Visão Geral

Este documento detalha as opções de hospedagem e distribuição mobile gratuitas para o sistema de controle de acesso com QR code. Todas as soluções apresentadas podem ser implementadas sem custos, garantindo que o sistema completo possa ser utilizado gratuitamente.

## Hospedagem do Frontend (Painel Administrativo)

### 1. Vercel (Recomendado)

A Vercel oferece um plano gratuito robusto, ideal para hospedar o painel administrativo:

**Vantagens:**
- Integração perfeita com React, Vue e outros frameworks
- Deploy automático a partir do GitHub
- Domínio personalizado gratuito (vercel.app)
- CDN global para carregamento rápido
- SSL gratuito e automático

**Limites do plano gratuito:**
- 100GB de largura de banda por mês
- Máximo de 6.000 minutos de serverless functions por mês
- Sem suporte a equipes (apenas uso pessoal)

**Processo de deploy:**
```bash
# Instalar CLI da Vercel
npm install -g vercel

# Navegar até o diretório do frontend
cd frontend

# Login e deploy
vercel login
vercel
```

### 2. Netlify (Alternativa)

Outra excelente opção para hospedagem gratuita de frontend:

**Vantagens:**
- 100GB de largura de banda por mês
- 300 minutos de build por mês
- Domínio personalizado gratuito (netlify.app)
- Integração contínua com GitHub
- SSL gratuito e automático

**Processo de deploy:**
```bash
# Instalar CLI do Netlify
npm install -g netlify-cli

# Navegar até o diretório do frontend
cd frontend

# Login e deploy
netlify login
netlify deploy
```

### 3. GitHub Pages (Opção Simples)

Para projetos mais simples ou estáticos:

**Vantagens:**
- Totalmente gratuito para repositórios públicos
- Fácil integração com fluxo de trabalho GitHub
- Domínio personalizado gratuito (github.io)
- SSL gratuito

**Limitações:**
- Apenas para sites estáticos (sem server-side rendering)
- Menos recursos avançados que Vercel ou Netlify

**Processo de deploy:**
```bash
# Adicionar script no package.json
# "deploy": "gh-pages -d build"

# Instalar gh-pages
npm install --save-dev gh-pages

# Build e deploy
npm run build
npm run deploy
```

## Hospedagem do Backend (API e Serviços)

### 1. Render (Recomendado)

Render oferece um plano gratuito generoso para serviços web:

**Vantagens:**
- 750 horas de execução por mês (suficiente para uso contínuo)
- 512MB de RAM
- Suporte a Node.js, Python e outras linguagens
- CI/CD automático a partir do GitHub
- SSL gratuito

**Limitações:**
- Serviços gratuitos "adormecem" após 15 minutos de inatividade
- Largura de banda limitada a 100GB por mês

**Processo de deploy:**
1. Criar conta em render.com
2. Conectar repositório GitHub
3. Configurar como "Web Service"
4. Definir comando de build e start
5. Configurar variáveis de ambiente

### 2. Railway (Alternativa)

Plataforma com tier gratuito para hospedagem de aplicações:

**Vantagens:**
- $5 de créditos gratuitos por mês
- Suporte a múltiplas linguagens e frameworks
- Fácil integração com bancos de dados
- Deploy automático a partir do GitHub

**Limitações:**
- Créditos limitados (suficientes para aplicações pequenas)
- Necessário fornecer cartão de crédito para verificação

**Processo de deploy:**
1. Criar conta em railway.app
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Iniciar deploy

### 3. Fly.io (Para Serviços Mais Robustos)

Oferece plano gratuito com recursos mais robustos:

**Vantagens:**
- 3 VMs compartilhadas gratuitas (256MB RAM cada)
- 3GB de armazenamento persistente
- 160GB de transferência de dados por mês
- Presença global (múltiplas regiões)

**Limitações:**
- Configuração mais complexa que outras opções
- Necessário fornecer cartão de crédito para verificação

**Processo de deploy:**
```bash
# Instalar Flyctl
curl -L https://fly.io/install.sh | sh

# Login e deploy
fly auth login
fly launch
```

### 4. Oracle Cloud Free Tier (Para Automação do WhatsApp)

Ideal para hospedar o serviço de automação do WhatsApp:

**Vantagens:**
- 2 VMs sempre gratuitas (1GB RAM, 1 OCPU)
- 200GB de armazenamento em bloco
- Sem limite de tempo (realmente gratuito para sempre)
- Recursos suficientes para rodar automação do WhatsApp 24/7

**Processo de configuração:**
1. Criar conta Oracle Cloud (requer cartão de crédito para verificação, mas não cobra)
2. Criar VM "Always Free" com Ubuntu
3. Configurar firewall e regras de rede
4. Instalar Node.js e dependências
5. Configurar serviço de automação do WhatsApp

```bash
# Exemplo de configuração do serviço systemd para manter automação rodando
sudo nano /etc/systemd/system/whatsapp-service.service

# Conteúdo do arquivo
[Unit]
Description=WhatsApp Automation Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/qrcode-access/whatsapp-service
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=whatsapp-service

[Install]
WantedBy=multi-user.target

# Ativar e iniciar o serviço
sudo systemctl enable whatsapp-service
sudo systemctl start whatsapp-service
```

## Distribuição Mobile (Aplicativo de Leitura)

### 1. Expo Go (Recomendado)

A solução mais simples para distribuição gratuita:

**Vantagens:**
- Não requer publicação nas lojas de aplicativos
- Usuários apenas instalam o app Expo Go (gratuito)
- Escaneiam QR code para acessar seu aplicativo
- Atualizações instantâneas sem necessidade de republicação
- Desenvolvimento rápido e fácil

**Processo de distribuição:**
```bash
# Instalar Expo CLI
npm install -g expo-cli

# Iniciar projeto
expo init qrcode-reader-app

# Publicar para distribuição
expo publish
```

**Compartilhamento com usuários:**
1. Usuários instalam Expo Go da App Store/Google Play
2. Compartilhe o link do projeto ou QR code
3. Usuários abrem o app através do Expo Go

### 2. Firebase App Distribution (Android)

Para distribuição de APK diretamente:

**Vantagens:**
- Distribuição direta do APK sem lojas de aplicativos
- Controle de acesso por e-mail
- Até 10.000 testers gratuitos
- Feedback e relatórios de crashes

**Processo de distribuição:**
1. Criar projeto no Firebase
2. Configurar App Distribution
3. Gerar APK de release
4. Fazer upload via console ou CLI
5. Convidar testers por e-mail

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login e inicializar
firebase login
firebase init

# Distribuir APK
firebase appdistribution:distribute app-release.apk \
  --app <your-app-id> \
  --groups "seguranças"
```

### 3. TestFlight (iOS)

Para distribuição de teste no iOS:

**Vantagens:**
- Até 10.000 testers externos
- Gratuito para desenvolvedores com conta Apple Developer
- Feedback integrado
- Atualizações fáceis

**Limitações:**
- Requer conta Apple Developer ($99/ano)
- Processo de revisão da Apple (mais lento)

**Alternativa gratuita para iOS:**
Utilizar Progressive Web App (PWA) em vez de app nativo:

```javascript
// Configuração básica de PWA no frontend
// public/manifest.json
{
  "short_name": "QR Leitor",
  "name": "Leitor de QR Code para Eventos",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

// Registrar service worker
// src/index.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
```

## Domínios Personalizados Gratuitos

Para ter um endereço web profissional sem custos:

### 1. Freenom

Oferece domínios gratuitos com extensões como .tk, .ml, .ga, .cf e .gq:

**Processo de obtenção:**
1. Registrar em freenom.com
2. Pesquisar domínio disponível
3. Selecionar plano gratuito (até 12 meses, renovável)
4. Configurar DNS para apontar para sua hospedagem

### 2. Subdomínios Gratuitos

Alternativas para subdomínios gratuitos:

- **js.org**: Para projetos JavaScript de código aberto
- **netlify.app**: Automático com hospedagem Netlify
- **vercel.app**: Automático com hospedagem Vercel
- **github.io**: Automático com GitHub Pages

## Estratégias para Manter Serviços Gratuitos Ativos

### 1. Evitar "Adormecimento" de Serviços

Para plataformas como Render que "adormecem" serviços gratuitos:

```javascript
// ping-service.js
const axios = require('axios');
const cron = require('node-cron');

// Configurar URLs dos serviços
const services = [
  'https://seu-backend.onrender.com/api/health',
  'https://outro-servico.onrender.com/ping'
];

// Função para fazer ping em todos os serviços
async function pingServices() {
  for (const service of services) {
    try {
      const response = await axios.get(service);
      console.log(`Ping para ${service}: ${response.status}`);
    } catch (error) {
      console.error(`Erro ao pingar ${service}:`, error.message);
    }
  }
}

// Agendar ping a cada 14 minutos (antes do limite de 15 minutos)
cron.schedule('*/14 * * * *', pingServices);

// Executar imediatamente na inicialização
pingServices();
```

### 2. Otimização de Recursos

Para maximizar o uso de planos gratuitos:

```javascript
// Compressão de imagens antes de salvar
const sharp = require('sharp');

async function optimizeAndSaveQRCode(qrImageBuffer, outputPath) {
  await sharp(qrImageBuffer)
    .resize(300, 300) // Tamanho adequado para leitura
    .png({ quality: 80 }) // Compressão moderada
    .toFile(outputPath);
}

// Limpeza periódica de dados temporários
function cleanupTempFiles() {
  const tempDir = path.join(__dirname, '../temp');
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      // Remove arquivos com mais de 24 horas
      if (Date.now() - stats.mtime.getTime() > 24 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    }
  }
}
```

## Monitoramento Gratuito

Para garantir que os serviços estejam funcionando:

### 1. UptimeRobot

Serviço gratuito para monitorar até 50 endpoints:

**Vantagens:**
- Verificações a cada 5 minutos
- Notificações por e-mail
- Página de status pública
- Sem cartão de crédito

**Configuração:**
1. Criar conta em uptimerobot.com
2. Adicionar monitores para cada serviço
3. Configurar alertas por e-mail

### 2. Monitoramento DIY

Solução caseira para monitoramento:

```javascript
// monitor.js
const axios = require('axios');
const nodemailer = require('nodemailer');

// Configurar serviços para monitorar
const services = [
  { name: 'Backend API', url: 'https://seu-backend.onrender.com/api/health' },
  { name: 'Frontend', url: 'https://seu-frontend.vercel.app' },
  { name: 'WhatsApp Service', url: 'https://whatsapp-service.yourdomain.com/status' }
];

// Configurar e-mail (usando Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Status anterior dos serviços
const previousStatus = {};

// Verificar serviços
async function checkServices() {
  for (const service of services) {
    try {
      const start = Date.now();
      const response = await axios.get(service.url, { timeout: 10000 });
      const responseTime = Date.now() - start;
      
      const status = response.status >= 200 && response.status < 300 ? 'up' : 'down';
      
      // Se status mudou de down para up, enviar notificação de recuperação
      if (previousStatus[service.name] === 'down' && status === 'up') {
        sendNotification(
          `✅ Serviço Recuperado: ${service.name}`,
          `O serviço ${service.name} está online novamente.\nTempo de resposta: ${responseTime}ms`
        );
      }
      // Se status mudou de up para down ou indefinido para down, enviar alerta
      else if ((previousStatus[service.name] === 'up' || !previousStatus[service.name]) && status === 'down') {
        sendNotification(
          `🔴 Alerta: ${service.name} está offline`,
          `O serviço ${service.name} não está respondendo corretamente.\nCódigo de status: ${response.status}`
        );
      }
      
      previousStatus[service.name] = status;
      
    } catch (error) {
      // Serviço está down
      if (previousStatus[service.name] !== 'down') {
        sendNotification(
          `🔴 Alerta: ${service.name} está offline`,
          `O serviço ${service.name} não está respondendo.\nErro: ${error.message}`
        );
      }
      
      previousStatus[service.name] = 'down';
    }
  }
}

// Enviar notificação por e-mail
function sendNotification(subject, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
    } else {
      console.log('E-mail enviado:', info.response);
    }
  });
}

// Verificar a cada 15 minutos
setInterval(checkServices, 15 * 60 * 1000);

// Verificar na inicialização
checkServices();
```

## Conclusão

As opções de hospedagem e distribuição mobile apresentadas neste documento permitem implementar o sistema de controle de acesso com QR code de forma totalmente gratuita. Utilizando serviços como Vercel para o frontend, Render para o backend, Oracle Cloud Free Tier para a automação do WhatsApp e Expo Go para o aplicativo mobile, é possível criar uma solução completa e profissional sem custos.

Para eventos de pequeno e médio porte, os limites dos planos gratuitos são mais que suficientes, garantindo que o sistema possa ser utilizado sem preocupações com custos de hospedagem ou distribuição. As estratégias de otimização e monitoramento apresentadas ajudam a maximizar o uso dos recursos gratuitos e garantir a disponibilidade dos serviços.
