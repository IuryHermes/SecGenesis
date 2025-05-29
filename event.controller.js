const Event = require('../models/event.model');
const Guest = require('../models/guest.model');

// Controlador de eventos
exports.createEvent = async (req, res) => {
  try {
    const { name, date, time, location, description, contactPhone } = req.body;
    const organizerId = req.user._id;

    // Criar novo evento
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      organizerId,
      contactPhone,
      status: 'active'
    });

    // Salvar evento
    await event.save();

    // Retornar resposta
    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar evento. Tente novamente mais tarde.'
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    // Filtrar eventos pelo organizador (exceto para admin)
    const filter = req.user.role === 'admin' ? {} : { organizerId: req.user._id };
    
    // Opções de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Buscar eventos
    const events = await Event.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Contar total de eventos
    const total = await Event.countDocuments(filter);
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      events
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos. Tente novamente mais tarde.'
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Buscar evento
    const event = await Event.findById(eventId);
    
    // Verificar se o evento existe
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
        message: 'Acesso negado. Você não tem permissão para visualizar este evento.'
      });
    }
    
    // Buscar estatísticas de convidados
    const guestStats = await Guest.aggregate([
      { $match: { eventId: event._id } },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Formatar estatísticas
    const stats = {
      total: 0,
      pending: 0,
      invited: 0,
      confirmed: 0,
      cancelled: 0,
      checkedIn: 0
    };
    
    guestStats.forEach(stat => {
      if (stat._id === 'pending') stats.pending = stat.count;
      if (stat._id === 'invited') stats.invited = stat.count;
      if (stat._id === 'confirmed') stats.confirmed = stat.count;
      if (stat._id === 'cancelled') stats.cancelled = stat.count;
      if (stat._id === 'checked-in') stats.checkedIn = stat.count;
      
      stats.total += stat.count;
    });
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      event,
      stats
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar evento. Tente novamente mais tarde.'
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, date, time, location, description, contactPhone, status } = req.body;
    
    // Buscar evento
    const event = await Event.findById(eventId);
    
    // Verificar se o evento existe
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
        message: 'Acesso negado. Você não tem permissão para atualizar este evento.'
      });
    }
    
    // Atualizar evento
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        name: name || event.name,
        date: date || event.date,
        time: time || event.time,
        location: location || event.location,
        description: description !== undefined ? description : event.description,
        contactPhone: contactPhone || event.contactPhone,
        status: status || event.status,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Evento atualizado com sucesso',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar evento. Tente novamente mais tarde.'
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Buscar evento
    const event = await Event.findById(eventId);
    
    // Verificar se o evento existe
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
        message: 'Acesso negado. Você não tem permissão para excluir este evento.'
      });
    }
    
    // Verificar se há convidados com check-in
    const checkedInGuests = await Guest.countDocuments({ 
      eventId, 
      status: 'checked-in' 
    });
    
    if (checkedInGuests > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir um evento com convidados que já realizaram check-in.'
      });
    }
    
    // Excluir convidados do evento
    await Guest.deleteMany({ eventId });
    
    // Excluir evento
    await Event.findByIdAndDelete(eventId);
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Evento e todos os convidados associados foram excluídos com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao excluir evento:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir evento. Tente novamente mais tarde.'
    });
  }
};
