const Guest = require('../models/guest.model');
const Event = require('../models/event.model');
const crypto = require('crypto');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Controlador de convidados
exports.createGuest = async (req, res) => {
  try {
    const { eventId, name, phone, email, notes } = req.body;
    
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
        message: 'Acesso negado. Você não tem permissão para adicionar convidados a este evento.'
      });
    }
    
    // Verificar se o telefone já está cadastrado para este evento
    const existingGuest = await Guest.findOne({ eventId, phone });
    if (existingGuest) {
      return res.status(400).json({
        success: false,
        message: 'Este telefone já está cadastrado para este evento.'
      });
    }
    
    // Gerar dados do QR code
    const qrData = {
      guestId: crypto.randomBytes(16).toString('hex'),
      eventId: eventId,
      name: name,
      phone: phone,
      timestamp: Date.now()
    };
    
    // Criar novo convidado
    const guest = new Guest({
      eventId,
      name,
      phone,
      email,
      notes,
      qrCodeData: JSON.stringify(qrData),
      status: 'pending'
    });
    
    // Salvar convidado
    await guest.save();
    
    // Retornar resposta
    res.status(201).json({
      success: true,
      message: 'Convidado adicionado com sucesso',
      guest
    });
  } catch (error) {
    console.error('Erro ao adicionar convidado:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar convidado. Tente novamente mais tarde.'
    });
  }
};

exports.getGuestsByEvent = async (req, res) => {
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
    
    // Verificar permissão (apenas admin, organizador do evento ou segurança)
    if (req.user.role !== 'admin' && 
        req.user.role !== 'security' && 
        event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para visualizar os convidados deste evento.'
      });
    }
    
    // Opções de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Opções de filtro
    const filter = { eventId };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex }
      ];
    }
    
    // Buscar convidados
    const guests = await Guest.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    // Contar total de convidados
    const total = await Guest.countDocuments(filter);
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      count: guests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      guests
    });
  } catch (error) {
    console.error('Erro ao buscar convidados:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar convidados. Tente novamente mais tarde.'
    });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guestId = req.params.id;
    
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
    
    // Verificar permissão (apenas admin, organizador do evento ou segurança)
    if (req.user.role !== 'admin' && 
        req.user.role !== 'security' && 
        event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para visualizar este convidado.'
      });
    }
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      guest,
      event
    });
  } catch (error) {
    console.error('Erro ao buscar convidado:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar convidado. Tente novamente mais tarde.'
    });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const guestId = req.params.id;
    const { name, phone, email, status, notes } = req.body;
    
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
        message: 'Acesso negado. Você não tem permissão para atualizar este convidado.'
      });
    }
    
    // Verificar se o telefone já está cadastrado para outro convidado do mesmo evento
    if (phone && phone !== guest.phone) {
      const existingGuest = await Guest.findOne({ 
        eventId: guest.eventId, 
        phone,
        _id: { $ne: guestId }
      });
      
      if (existingGuest) {
        return res.status(400).json({
          success: false,
          message: 'Este telefone já está cadastrado para outro convidado deste evento.'
        });
      }
    }
    
    // Atualizar convidado
    const updatedGuest = await Guest.findByIdAndUpdate(
      guestId,
      {
        name: name || guest.name,
        phone: phone || guest.phone,
        email: email !== undefined ? email : guest.email,
        status: status || guest.status,
        notes: notes !== undefined ? notes : guest.notes,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Convidado atualizado com sucesso',
      guest: updatedGuest
    });
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar convidado. Tente novamente mais tarde.'
    });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    const guestId = req.params.id;
    
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
        message: 'Acesso negado. Você não tem permissão para excluir este convidado.'
      });
    }
    
    // Verificar se o convidado já realizou check-in
    if (guest.status === 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir um convidado que já realizou check-in.'
      });
    }
    
    // Excluir convidado
    await Guest.findByIdAndDelete(guestId);
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'Convidado excluído com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao excluir convidado:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir convidado. Tente novamente mais tarde.'
    });
  }
};

exports.generateQRCode = async (req, res) => {
  try {
    const guestId = req.params.id;
    
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
    }
    
    // Gerar imagem do QR code
    const qrCodeImage = await qrcode.toDataURL(guest.qrCodeData);
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: 'QR code gerado com sucesso',
      qrCodeImage,
      qrCodeData: guest.qrCodeData
    });
  } catch (error) {
    console.error('Erro ao gerar QR code:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar QR code. Tente novamente mais tarde.'
    });
  }
};

exports.bulkCreateGuests = async (req, res) => {
  try {
    const { eventId, guests } = req.body;
    
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
        message: 'Acesso negado. Você não tem permissão para adicionar convidados a este evento.'
      });
    }
    
    // Verificar se a lista de convidados foi fornecida
    if (!Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Lista de convidados inválida ou vazia.'
      });
    }
    
    // Processar cada convidado
    const results = {
      success: [],
      duplicates: [],
      errors: []
    };
    
    for (const guestData of guests) {
      try {
        // Verificar dados obrigatórios
        if (!guestData.name || !guestData.phone) {
          results.errors.push({
            data: guestData,
            message: 'Nome e telefone são obrigatórios.'
          });
          continue;
        }
        
        // Verificar se o telefone já está cadastrado para este evento
        const existingGuest = await Guest.findOne({ eventId, phone: guestData.phone });
        if (existingGuest) {
          results.duplicates.push({
            data: guestData,
            message: 'Este telefone já está cadastrado para este evento.'
          });
          continue;
        }
        
        // Gerar dados do QR code
        const qrData = {
          guestId: crypto.randomBytes(16).toString('hex'),
          eventId: eventId,
          name: guestData.name,
          phone: guestData.phone,
          timestamp: Date.now()
        };
        
        // Criar novo convidado
        const guest = new Guest({
          eventId,
          name: guestData.name,
          phone: guestData.phone,
          email: guestData.email || '',
          notes: guestData.notes || '',
          qrCodeData: JSON.stringify(qrData),
          status: 'pending'
        });
        
        // Salvar convidado
        await guest.save();
        
        results.success.push({
          data: guestData,
          id: guest._id
        });
      } catch (error) {
        results.errors.push({
          data: guestData,
          message: error.message
        });
      }
    }
    
    // Retornar resposta
    res.status(200).json({
      success: true,
      message: `Processamento concluído: ${results.success.length} convidados adicionados, ${results.duplicates.length} duplicados, ${results.errors.length} erros.`,
      results
    });
  } catch (error) {
    console.error('Erro ao processar lista de convidados:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar lista de convidados. Tente novamente mais tarde.'
    });
  }
};
