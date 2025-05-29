// Arquivo de configuração para variáveis de ambiente
require('dotenv').config();

// Configurações do banco de dados
const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/secgenesis',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};

// Configurações de autenticação
const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'secgenesis-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

// Configurações de servidor
const serverConfig = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS || '*'
};

// Configurações de QR code
const qrCodeConfig = {
  errorCorrectionLevel: 'H',
  margin: 1,
  scale: 8
};

// Exportar configurações
module.exports = {
  db: dbConfig,
  auth: authConfig,
  server: serverConfig,
  qrCode: qrCodeConfig
};
