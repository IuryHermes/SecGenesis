const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para convidados
const GuestSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido']
  },
  qrCodeData: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCodePath: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'invited', 'confirmed', 'cancelled', 'checked-in'],
    default: 'pending'
  },
  messageSent: {
    type: Boolean,
    default: false
  },
  messageSentAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o campo updatedAt antes de salvar
GuestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para melhorar a performance de consultas
GuestSchema.index({ eventId: 1 });
GuestSchema.index({ phone: 1 });
GuestSchema.index({ qrCodeData: 1 });

module.exports = mongoose.model('Guest', GuestSchema);
