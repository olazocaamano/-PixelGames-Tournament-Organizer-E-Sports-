const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticate } = require('../utils/authMiddleware');

router.get('/:userId', authenticate, notificationsController.getNotifications);

router.put('/:id/read', authenticate, notificationsController.markAsRead);

router.put('/read-all/:userId', authenticate, notificationsController.markAllAsRead);

module.exports = router;
