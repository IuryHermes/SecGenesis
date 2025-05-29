const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const { authenticate, isOrganizerOrAdmin, isSecurityOrAbove } = require('../middleware/auth.middleware');

// Todas as rotas de convidados requerem autenticação
router.use(authenticate);

// Rotas para convidados
router.post('/', isOrganizerOrAdmin, guestController.createGuest);
router.post('/bulk', isOrganizerOrAdmin, guestController.bulkCreateGuests);
router.get('/event/:eventId', isSecurityOrAbove, guestController.getGuestsByEvent);
router.get('/:id', isSecurityOrAbove, guestController.getGuestById);
router.put('/:id', isOrganizerOrAdmin, guestController.updateGuest);
router.delete('/:id', isOrganizerOrAdmin, guestController.deleteGuest);
router.post('/:id/generate-qrcode', isOrganizerOrAdmin, guestController.generateQRCode);

module.exports = router;
