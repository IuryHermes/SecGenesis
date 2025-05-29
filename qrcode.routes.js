const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const Guest = require('../models/guest.model');
const Event = require('../models/event.model');
const { authenticate, isOrganizerOrAdmin } = require('../middleware/auth.middleware');

// Todas as rotas de QR code requerem autenticação
router.use(authenticate);

// Rota para gerar QR code para um convidado
router.get('/generate/:guestId', isOrganizerOrAdmin, async (req, res) => {
  try {
    const guestId = req.params.guestId;
    
    // Buscar convidado
    const guest = await Guest.findById(guestId);
    
    // Verificar se o convidado existe
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado.'
      });
    }
    
    // Buscar evento
    const event = await Event.findById(guest.eventId);
    
    // Verificar permissão (apenas admin ou organizador do evento)
    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para gerar QR code para este convidado.'
      });
    }
    
    // Verificar se já existe QR code
    if (!guest.qrCodeData) {
      return res.status(400).json({
        success: false,
        message: 'Este convidado não possui dados de QR code. Gere os dados primeiro.'
      });
    }
    
    // Gerar QR code como imagem PNG
    const qrCodeBuffer = await qrcode.toBuffer(guest.qrCodeData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      scale: 8
    });
    
    // Enviar imagem como resposta
    res.set('Content-Type', 'image/png');
    res.send(qrCodeBuffer);
    
  } catch (error) {
    console.error('Erro ao gerar QR code:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar QR code. Tente novamente mais tarde.'
    });
  }
});

// Rota para gerar QR codes em lote para um evento
router.get('/generate-batch/:eventId', isOrganizerOrAdmin, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Verificar se o evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado.'
      });
    }
    
    // Verificar permissão (apenas admin ou organizador do evento)
    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para gerar QR codes para este evento.'
      });
    }
    
    // Buscar convidados sem QR code
    const guests = await Guest.find({ 
      eventId, 
      qrCodeData: { $exists: false }
    });
    
    if (guests.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Todos os convidados já possuem QR code.',
        generatedCount: 0
      });
    }
    
    // Gerar QR code para cada convidado
    let generatedCount = 0;
    
    for (const guest of guests) {
      try {
        // Gerar dados do QR code
        const qrData = {
          guestId: crypto.randomBytes(16).toString('hex'),
          eventId: guest.eventId.toString(),
          name: guest.name,
          phone: guest.phone,
          timestamp: Date.now()
        };
        
        // Atualizar convidado com os dados do QR code
        guest.qrCodeData = JSON.stringify(qrData);
        await guest.save();
        
        generatedCount++;
      } catch (error) {
        console.error(`Erro ao gerar QR code para convidado ${guest._id}:`, error.message);
      }
    }
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: `QR codes gerados com sucesso para ${generatedCount} convidados.`,
      generatedCount,
      totalGuests: guests.length
    });
    
  } catch (error) {
    console.error('Erro ao gerar QR codes em lote:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar QR codes em lote. Tente novamente mais tarde.'
    });
  }
});

module.exports = router;
