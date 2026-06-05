const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/', gamesController.getGames);

router.post('/', authenticate, authorize('admin'), gamesController.createGame);

module.exports = router;
