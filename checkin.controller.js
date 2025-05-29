const Checkin = require('../models/checkin.model');
const Guest = require('../models/guest.model');
const Event = require('../models/event.model');

// Controlador de check-ins
exports.performCheckin = async (req, res) => {
  try {
    const { qrCodeData, deviceInfo, location } = req.body;
    const securityUserId = req.user._id;
    
    // Verificar se os dados do QR code foram fornecidos
    if (!qrCodeData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do QR code não fornecidos.'
      });
    }
    
    // Buscar convidado pelo QR code
    const guest = await Guest.findOne({ qrCodeData });
    
    // Verificar se o convidado existe
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'QR code inválido. Convidado não encontrado.'
      });
    }
    
    // Buscar evento
    const event = await Event.findById(guest.eventId);
    
    // Verificar se o evento existe
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado.'
      });
    }
    
    // Verificar se o evento está ativo
    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Evento ${event.status === 'completed' ? 'já finalizado' : 'cancelado'}.`
      });
    }
    
    // Verificar se o convidado já realizou check-in
    if (guest.status === 'checked-in') {
      // Buscar informações do check-in anterior
      const previousCheckin = await Checkin.findOne({ guestId: guest._id })
        .sort({ timestamp: -1 });
      
      return res.status(400).json({
        success: false,
        message: 'Este convidado já realizou check-in.',
        guest,
        event,
        previousCheckin
      });
    }
    
    // Atualizar status do convidado
    guest.status = 'checked-in';
    await guest.save();
    
    // Criar registro de check-in
    const checkin = new Checkin({
      eventId: guest.eventId,
      guestId: guest._id,
      securityUserId,
      deviceInfo,
      location,
      timestamp: Date.now()
    });
    
    await checkin.save();
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Check-in realizado com sucesso',
      guest,
      event,
      checkin
    });
  } catch (error) {
    console.error('Erro ao realizar check-in:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar check-in. Tente novamente mais tarde.'
    });
  }
};

exports.getCheckinsByEvent = async (req, res) => {
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
        message: 'Acesso negado. Você não tem permissão para visualizar os check-ins deste evento.'
      });
    }
    
    // Opções de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Buscar check-ins
    const checkins = await Checkin.find({ eventId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('guestId', 'name phone email')
      .populate('securityUserId', 'name');
    
    // Contar total de check-ins
    const total = await Checkin.countDocuments({ eventId });
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      count: checkins.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      checkins
    });
  } catch (error) {
    console.error('Erro ao buscar check-ins:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar check-ins. Tente novamente mais tarde.'
    });
  }
};

exports.getCheckinStats = async (req, res) => {
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
        message: 'Acesso negado. Você não tem permissão para visualizar as estatísticas deste evento.'
      });
    }
    
    // Contar total de convidados
    const totalGuests = await Guest.countDocuments({ eventId });
    
    // Contar total de check-ins
    const totalCheckins = await Checkin.countDocuments({ eventId });
    
    // Buscar estatísticas por hora
    const hourlyStats = await Checkin.aggregate([
      { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
    ]);
    
    // Formatar estatísticas por hora
    const hourlyData = hourlyStats.map(stat => ({
      hour: `${stat._id.day}/${stat._id.month}/${stat._id.year} ${stat._id.hour}:00`,
      count: stat.count
    }));
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      stats: {
        totalGuests,
        totalCheckins,
        percentageCheckedIn: totalGuests > 0 ? (totalCheckins / totalGuests) * 100 : 0,
        hourlyData
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de check-in:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas de check-in. Tente novamente mais tarde.'
    });
  }
};

exports.validateQRCode = async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    
    // Verificar se os dados do QR code foram fornecidos
    if (!qrCodeData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do QR code não fornecidos.'
      });
    }
    
    // Buscar convidado pelo QR code
    const guest = await Guest.findOne({ qrCodeData });
    
    // Verificar se o convidado existe
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'QR code inválido. Convidado não encontrado.',
        isValid: false
      });
    }
    
    // Buscar evento
    const event = await Event.findById(guest.eventId);
    
    // Verificar se o evento existe
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado.',
        isValid: false
      });
    }
    
    // Verificar se o evento está ativo
    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Evento ${event.status === 'completed' ? 'já finalizado' : 'cancelado'}.`,
        isValid: false,
        guest,
        event
      });
    }
    
    // Verificar se o convidado já realizou check-in
    const alreadyCheckedIn = guest.status === 'checked-in';
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      isValid: true,
      alreadyCheckedIn,
      guest,
      event
    });
  } catch (error) {
    console.error('Erro ao validar QR code:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao validar QR code. Tente novamente mais tarde.',
      isValid: false
    });
  }
};
