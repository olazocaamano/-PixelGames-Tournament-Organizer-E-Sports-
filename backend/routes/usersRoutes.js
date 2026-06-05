const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/', authenticate, authorize('admin'), usersController.getUsers);

router.get('/players', authenticate, authorize('admin'), usersController.getPlayers);

router.post('/login', usersController.login);

router.post('/', usersController.register);

module.exports = router;
