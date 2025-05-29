# Estrutura de Backend e Banco de Dados Gratuitos

## Visão Geral

Este documento detalha a estrutura do backend e banco de dados para o sistema de controle de acesso com QR code, utilizando apenas tecnologias e serviços gratuitos. A arquitetura proposta garante funcionalidade completa sem custos de implementação ou manutenção.

## Arquitetura do Backend

### Framework e Linguagem

Recomendamos o uso do **Node.js com Express.js** por diversos motivos:

1. **Totalmente gratuito e open source**
2. **Baixo consumo de recursos** (ideal para hospedagem em planos gratuitos)
3. **Excelente para APIs RESTful** (necessárias para comunicação entre painel e app)
4. **Grande comunidade e documentação** (facilita resolução de problemas)
5. **Compatibilidade com bibliotecas de automação do WhatsApp**

#### Estrutura de Diretórios Recomendada

```
/backend
  /src
    /controllers     # Lógica de negócios
    /models          # Modelos de dados
    /routes          # Rotas da API
    /services        # Serviços (WhatsApp, QR code, etc.)
    /utils           # Utilitários
    /middleware      # Middlewares (autenticação, etc.)
    /config          # Configurações
  /public            # Arquivos estáticos
    /qrcodes         # QR codes gerados
  /logs              # Logs do sistema
  server.js          # Ponto de entrada
  package.json       # Dependências
```

### API RESTful

A API deve seguir princípios RESTful para facilitar a comunicação entre o painel administrativo e o aplicativo de leitura:

#### Principais Endpoints

```
# Autenticação
POST /api/auth/login          # Login de usuários
POST /api/auth/logout         # Logout

# Eventos
GET /api/events               # Listar eventos
POST /api/events              # Criar evento
GET /api/events/:id           # Detalhes do evento
PUT /api/events/:id           # Atualizar evento
DELETE /api/events/:id        # Excluir evento

# Convidados
GET /api/events/:id/guests    # Listar convidados do evento
POST /api/events/:id/guests   # Adicionar convidado
POST /api/guests/import       # Importar lista de convidados
GET /api/guests/:id           # Detalhes do convidado
PUT /api/guests/:id           # Atualizar convidado
DELETE /api/guests/:id        # Excluir convidado

# QR Codes
POST /api/guests/:id/qrcode   # Gerar QR code para convidado
POST /api/events/:id/qrcodes  # Gerar QR codes para todos os convidados

# Mensagens
POST /api/guests/:id/send     # Enviar QR code para convidado
POST /api/events/:id/send     # Enviar QR codes para todos os convidados

# Check-in
POST /api/checkin             # Registrar entrada (app de leitura)
GET /api/events/:id/checkins  # Listar entradas registradas
```

### Autenticação e Segurança

Para garantir a segurança sem custos adicionais:

1. **JWT (JSON Web Tokens)**: Para autenticação stateless
2. **bcrypt**: Para hash de senhas
3. **helmet**: Para proteção contra vulnerabilidades comuns
4. **rate-limiting**: Para prevenir ataques de força bruta

#### Exemplo de Implementação JWT

```javascript
// auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Chave secreta gerada aleatoriamente
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-segura';

// Gerar token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verificar senha
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Hash de senha
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Middleware de autenticação
function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
}

module.exports = {
  generateToken,
  verifyPassword,
  hashPassword,
  authenticate
};
```

## Opções de Banco de Dados Gratuitos

### 1. MongoDB Atlas (Free Tier)

O MongoDB Atlas oferece um plano gratuito com:
- 512MB de armazenamento
- Compartilhado em clusters na nuvem
- Backups automáticos
- Ideal para aplicações de pequeno a médio porte

#### Estrutura de Coleções

```javascript
// Coleção: events
{
  _id: ObjectId,
  name: String,
  date: Date,
  time: String,
  location: String,
  description: String,
  organizerId: ObjectId,
  contactPhone: String,
  createdAt: Date,
  updatedAt: Date
}

// Coleção: guests
{
  _id: ObjectId,
  eventId: ObjectId,
  name: String,
  phone: String,
  email: String,
  qrCodeData: String,
  qrCodePath: String,
  status: String, // 'pending', 'invited', 'confirmed'
  messageSent: Boolean,
  messageSentAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// Coleção: checkins
{
  _id: ObjectId,
  eventId: ObjectId,
  guestId: ObjectId,
  timestamp: Date,
  securityUserId: ObjectId,
  deviceInfo: Object
}

// Coleção: users
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  role: String, // 'admin', 'security'
  createdAt: Date,
  updatedAt: Date
}
```

#### Conexão com MongoDB Atlas

```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // URI de conexão do MongoDB Atlas (plano gratuito)
    const uri = process.env.MONGO_URI || 'mongodb+srv://username:password@cluster0.mongodb.net/qrcode-access?retryWrites=true&w=majority';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    
    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2. SQLite (Alternativa Totalmente Local)

Para casos onde não se deseja depender de serviços externos:

- Banco de dados de arquivo único
- Zero configuração de servidor
- Ideal para aplicações de pequeno porte
- Perfeito para desenvolvimento e testes

#### Estrutura de Tabelas

```sql
-- Tabela de eventos
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  organizer_id INTEGER,
  contact_phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de convidados
CREATE TABLE guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  qr_code_data TEXT,
  qr_code_path TEXT,
  status TEXT DEFAULT 'pending',
  message_sent INTEGER DEFAULT 0,
  message_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

-- Tabela de check-ins
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  guest_id INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  security_user_id INTEGER,
  device_info TEXT,
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE CASCADE
);

-- Tabela de usuários
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Conexão com SQLite

```javascript
// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Garante que o diretório de dados existe
const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'qrcode-access.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados SQLite');
});

// Habilita foreign keys
db.run('PRAGMA foreign_keys = ON');

// Inicializa as tabelas se não existirem
function initializeDatabase() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      organizer_id INTEGER,
      contact_phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // ... outras tabelas
  ];
  
  tables.forEach(table => {
    db.run(table, err => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
      }
    });
  });
}

initializeDatabase();

module.exports = db;
```

### 3. PostgreSQL com Supabase (Free Tier)

Supabase oferece um plano gratuito com PostgreSQL:
- 500MB de armazenamento
- 10.000 linhas de dados
- Autenticação integrada
- API RESTful automática

#### Conexão com Supabase

```javascript
// supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

## Otimizações para Planos Gratuitos

### 1. Estratégias de Cache

Para reduzir consultas ao banco de dados:

```javascript
// cache-service.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos de TTL padrão

// Função para obter dados com cache
async function getCachedData(key, fetchFunction) {
  // Verifica se os dados estão em cache
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData;
  }
  
  // Se não estiver em cache, busca os dados
  const data = await fetchFunction();
  
  // Armazena em cache
  cache.set(key, data);
  
  return data;
}

// Função para invalidar cache
function invalidateCache(key) {
  cache.del(key);
}

module.exports = {
  getCachedData,
  invalidateCache
};
```

### 2. Limpeza Automática de Dados

Para manter o banco de dados dentro dos limites gratuitos:

```javascript
// cleanup-service.js
const cron = require('node-cron');
const Event = require('../models/event');
const Guest = require('../models/guest');
const Checkin = require('../models/checkin');
const fs = require('fs');
const path = require('path');

// Limpa eventos antigos (mais de 30 dias)
async function cleanupOldEvents() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Encontra eventos antigos
  const oldEvents = await Event.find({
    date: { $lt: thirtyDaysAgo }
  });
  
  // Para cada evento antigo
  for (const event of oldEvents) {
    // Encontra convidados do evento
    const guests = await Guest.find({ eventId: event._id });
    
    // Remove QR codes físicos
    for (const guest of guests) {
      if (guest.qrCodePath) {
        const qrPath = path.join(__dirname, '../../', guest.qrCodePath);
        if (fs.existsSync(qrPath)) {
          fs.unlinkSync(qrPath);
        }
      }
    }
    
    // Remove registros do banco de dados
    await Checkin.deleteMany({ eventId: event._id });
    await Guest.deleteMany({ eventId: event._id });
    await Event.deleteOne({ _id: event._id });
    
    console.log(`Evento antigo removido: ${event.name}`);
  }
}

// Agenda limpeza para rodar todo dia às 3 da manhã
cron.schedule('0 3 * * *', () => {
  console.log('Executando limpeza automática de dados...');
  cleanupOldEvents();
});

module.exports = {
  cleanupOldEvents
};
```

### 3. Compressão de Dados

Para reduzir o uso de armazenamento:

```javascript
// server.js
const express = require('express');
const compression = require('compression');
const app = express();

// Aplica compressão em todas as respostas
app.use(compression());

// ... resto da configuração do servidor
```

## Backup e Exportação de Dados

Para garantir segurança sem custos adicionais:

### 1. Backup Automático para Google Drive

Utilizando a API gratuita do Google Drive:

```javascript
// backup-service.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Configuração da autenticação OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Define escopo de acesso
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Função para fazer backup do banco de dados
async function backupDatabase() {
  try {
    // Nome do arquivo de backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = path.join(__dirname, '../backups', backupFileName);
    
    // Garante que o diretório de backups existe
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Exporta dados do banco de dados (exemplo para MongoDB)
    const Event = require('../models/event');
    const Guest = require('../models/guest');
    const Checkin = require('../models/checkin');
    const User = require('../models/user');
    
    const data = {
      events: await Event.find({}),
      guests: await Guest.find({}),
      checkins: await Checkin.find({}),
      users: await User.find({}).select('-password') // Exclui senhas do backup
    };
    
    // Salva arquivo de backup
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    
    // Faz upload para o Google Drive
    const fileMetadata = {
      name: backupFileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] // ID da pasta no Drive
    };
    
    const media = {
      mimeType: 'application/json',
      body: fs.createReadStream(backupPath)
    };
    
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    console.log(`Backup concluído. ID do arquivo: ${response.data.id}`);
    
    // Remove arquivo local após upload
    fs.unlinkSync(backupPath);
    
    return {
      success: true,
      fileId: response.data.id,
      timestamp: timestamp
    };
  } catch (error) {
    console.error('Erro ao fazer backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Agenda backup diário às 2 da manhã
cron.schedule('0 2 * * *', () => {
  console.log('Executando backup automático...');
  backupDatabase();
});

module.exports = {
  backupDatabase
};
```

### 2. Exportação Manual de Dados

Para permitir que o usuário faça backups manuais:

```javascript
// export-controller.js
const Event = require('../models/event');
const Guest = require('../models/guest');
const Checkin = require('../models/checkin');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Exportar dados de um evento específico
async function exportEventData(req, res) {
  try {
    const { eventId } = req.params;
    
    // Busca dados do evento
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Busca convidados e check-ins
    const guests = await Guest.find({ eventId });
    const checkins = await Checkin.find({ eventId });
    
    // Cria objeto de dados
    const data = {
      event,
      guests,
      checkins,
      exportDate: new Date()
    };
    
    // Cria diretório temporário para exportação
    const exportDir = path.join(__dirname, '../../temp', `export-${eventId}`);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Salva dados em JSON
    const dataPath = path.join(exportDir, 'data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    // Copia QR codes para pasta de exportação
    const qrcodesDir = path.join(exportDir, 'qrcodes');
    if (!fs.existsSync(qrcodesDir)) {
      fs.mkdirSync(qrcodesDir);
    }
    
    for (const guest of guests) {
      if (guest.qrCodePath) {
        const sourcePath = path.join(__dirname, '../../', guest.qrCodePath);
        const destPath = path.join(qrcodesDir, path.basename(guest.qrCodePath));
        
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }
    
    // Cria arquivo ZIP
    const zipPath = path.join(__dirname, '../../temp', `evento-${event.name.replace(/\s+/g, '-')}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      // Envia arquivo ZIP como resposta
      res.download(zipPath, `evento-${event.name.replace(/\s+/g, '-')}.zip`, (err) => {
        if (err) {
          console.error('Erro ao enviar arquivo:', err);
        }
        
        // Limpa arquivos temporários
        fs.rmSync(exportDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });
    
    archive.on('error', (err) => {
      res.status(500).json({ message: 'Erro ao criar arquivo ZIP', error: err.message });
    });
    
    archive.pipe(output);
    archive.directory(exportDir, false);
    archive.finalize();
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({ message: 'Erro ao exportar dados', error: error.message });
  }
}

module.exports = {
  exportEventData
};
```

## Considerações para Escalabilidade

### 1. Sharding de Dados

Para eventos maiores, implementar divisão de dados:

```javascript
// Exemplo: dividir convidados por ordem alfabética
function getShardKey(guestName) {
  const firstLetter = guestName.charAt(0).toUpperCase();
  
  if (firstLetter < 'H') return 'shard1';
  if (firstLetter < 'P') return 'shard2';
  return 'shard3';
}
```

### 2. Processamento em Lote

Para operações pesadas como envio de mensagens:

```javascript
// batch-processor.js
async function processBatch(items, processFn, batchSize = 10) {
  const batches = [];
  
  // Divide itens em lotes
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  // Processa cada lote sequencialmente
  for (const batch of batches) {
    await Promise.all(batch.map(processFn));
    
    // Pausa entre lotes para não sobrecarregar recursos
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## Conclusão

A estrutura de backend e banco de dados proposta utiliza apenas tecnologias e serviços gratuitos, garantindo que o sistema de controle de acesso com QR code possa ser implementado e mantido sem custos. As opções de MongoDB Atlas (free tier), SQLite ou PostgreSQL com Supabase oferecem flexibilidade para diferentes necessidades, enquanto as estratégias de otimização e backup garantem a confiabilidade e segurança dos dados.

Para eventos de pequeno e médio porte, esta arquitetura é mais que suficiente, permitindo o cadastro de convidados, geração e envio de QR codes, e controle de acesso na entrada do evento, tudo isso sem qualquer custo para o usuário.
