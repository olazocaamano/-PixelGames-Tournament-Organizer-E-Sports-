const express = require('express');
const router = express.Router();
const leaderboardsController = require('../controllers/leaderboardsController');

router.get('/', leaderboardsController.getGlobalLeaderboard);

router.get('/tournament/:tournamentId', leaderboardsController.getTournamentLeaderboard);

module.exports = router;
