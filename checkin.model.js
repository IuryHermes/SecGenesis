const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema para check-ins
const CheckinSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  guestId: {
    type: Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  securityUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deviceInfo: {
    type: Object
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number
    }
  },
  notes: {
    type: String
  }
});

// Índices para melhorar a performance de consultas
CheckinSchema.index({ eventId: 1 });
CheckinSchema.index({ guestId: 1 });
CheckinSchema.index({ timestamp: 1 });

module.exports = mongoose.model('Checkin', CheckinSchema);
