const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticate, isOrganizerOrAdmin } = require('../middleware/auth.middleware');

// Todas as rotas de eventos requerem autenticação
router.use(authenticate);

// Rotas para eventos
router.post('/', isOrganizerOrAdmin, eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', isOrganizerOrAdmin, eventController.updateEvent);
router.delete('/:id', isOrganizerOrAdmin, eventController.deleteEvent);

module.exports = router;
