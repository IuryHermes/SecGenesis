const axios = require('axios');
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

// URL do serviço de automação WhatsApp
const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001/api';
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || 'secgenesis-whatsapp-token';

// Configuração do axios para o serviço WhatsApp
const whatsappApi = axios.create({
  baseURL: WHATSAPP_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': WHATSAPP_API_TOKEN
  }
});

// Rota para verificar status do serviço WhatsApp
router.get('/status', authenticate, async (req, res) => {
  try {
    const response = await whatsappApi.get('/status');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro ao verificar status do WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do serviço WhatsApp.'
    });
  }
});

// Rota para enviar QR code por WhatsApp
router.post('/send/:guestId', authenticate, async (req, res) => {
  try {
    const { guestId } = req.params;
    
    // Buscar dados do convidado
    const guestResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/guests/${guestId}`, {
      headers: {
        'x-auth-token': req.header('x-auth-token')
      }
    });
    
    const guest = guestResponse.data.guest;
    const event = guestResponse.data.event;
    
    // Verificar se o convidado existe
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado.'
      });
    }
    
    // Verificar se o convidado tem telefone
    if (!guest.phone) {
      return res.status(400).json({
        success: false,
        message: 'O convidado não possui número de telefone cadastrado.'
      });
    }
    
    // Gerar QR code se ainda não existir
    if (!guest.qrCodeData) {
      await axios.post(`${req.protocol}://${req.get('host')}/api/guests/${guestId}/generate-qrcode`, {}, {
        headers: {
          'x-auth-token': req.header('x-auth-token')
        }
      });
    }
    
    // URL do QR code
    const qrCodeUrl = `${req.protocol}://${req.get('host')}/api/qrcodes/generate/${guestId}`;
    
    // Enviar QR code por WhatsApp
    const whatsappResponse = await whatsappApi.post('/send', {
      phone: guest.phone,
      guestName: guest.name,
      eventName: event.name,
      qrCodeUrl
    });
    
    // Se o envio foi bem-sucedido, atualizar status do convidado para "invited"
    if (whatsappResponse.data.success) {
      await axios.put(`${req.protocol}://${req.get('host')}/api/guests/${guestId}`, {
        status: 'invited'
      }, {
        headers: {
          'x-auth-token': req.header('x-auth-token')
        }
      });
    }
    
    res.status(200).json(whatsappResponse.data);
  } catch (error) {
    console.error('Erro ao enviar QR code por WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar QR code por WhatsApp. Verifique se o serviço está ativo.'
    });
  }
});

// Rota para enviar QR codes em lote para um evento
router.post('/send-batch/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { guestIds } = req.body;
    
    // Verificar se a lista de IDs foi fornecida
    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Forneça uma lista de IDs de convidados.'
      });
    }
    
    // Resultados do envio
    const results = {
      total: guestIds.length,
      success: 0,
      failed: 0,
      details: []
    };
    
    // Processar cada convidado
    for (const guestId of guestIds) {
      try {
        // Enviar QR code para o convidado
        const response = await axios.post(`${req.protocol}://${req.get('host')}/api/whatsapp/send/${guestId}`, {}, {
          headers: {
            'x-auth-token': req.header('x-auth-token')
          }
        });
        
        if (response.data.success) {
          results.success++;
          results.details.push({
            guestId,
            success: true,
            message: response.data.message
          });
        } else {
          results.failed++;
          results.details.push({
            guestId,
            success: false,
            message: response.data.message
          });
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          guestId,
          success: false,
          message: error.response?.data?.message || error.message
        });
      }
      
      // Pequeno intervalo entre envios para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    res.status(200).json({
      success: true,
      message: `Processamento concluído: ${results.success} enviados com sucesso, ${results.failed} falhas.`,
      results
    });
  } catch (error) {
    console.error('Erro ao enviar QR codes em lote:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar QR codes em lote. Verifique se o serviço está ativo.'
    });
  }
});

module.exports = router;
