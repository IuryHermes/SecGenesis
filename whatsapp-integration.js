// Integração do serviço WhatsApp no servidor principal
const express = require('express');
const whatsappRoutes = require('./src/routes/whatsapp.routes');

// Adicionar as rotas de WhatsApp ao servidor principal
app.use('/api/whatsapp', whatsappRoutes);

// Adicionar variáveis de ambiente para o serviço WhatsApp
process.env.WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001/api';
process.env.WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || 'secgenesis-whatsapp-token';
