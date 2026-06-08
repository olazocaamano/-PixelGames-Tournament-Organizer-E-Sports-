const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/', authenticate, authorize('admin'), usersController.getUsers);

router.get('/players', authenticate, authorize('admin'), usersController.getPlayers);

router.get('/admins', authenticate, authorize('admin'), usersController.getAdmins);

router.post('/admin', authenticate, authorize('admin'), usersController.createAdmin);

router.patch('/:id/demote', authenticate, authorize('admin'), usersController.demoteAdmin);

router.post('/login', usersController.login);

router.post('/', usersController.register);

router.post('/forgot-password', usersController.forgotPassword);

router.post('/reset-password', usersController.resetPassword);

module.exports = router;
