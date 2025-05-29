const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');
const { authenticate, isSecurityOrAbove, isOrganizerOrAdmin } = require('../middleware/auth.middleware');

// Todas as rotas de check-in requerem autenticação
router.use(authenticate);

// Rotas para check-ins
router.post('/perform', isSecurityOrAbove, checkinController.performCheckin);
router.post('/validate', isSecurityOrAbove, checkinController.validateQRCode);
router.get('/event/:eventId', isOrganizerOrAdmin, checkinController.getCheckinsByEvent);
router.get('/stats/:eventId', isOrganizerOrAdmin, checkinController.getCheckinStats);

module.exports = router;
