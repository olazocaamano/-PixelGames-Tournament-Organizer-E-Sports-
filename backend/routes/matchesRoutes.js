const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/tournament/:tournamentId', matchesController.getTournamentMatches);

router.get('/player/:userId', authenticate, matchesController.getPlayerMatches);

router.post('/', authenticate, authorize('admin'), matchesController.createMatch);

router.put('/:id/result', authenticate, authorize('admin'), matchesController.reportResult);

router.post('/generate/:tournamentId', authenticate, authorize('admin'), matchesController.generateBrackets);

module.exports = router;
