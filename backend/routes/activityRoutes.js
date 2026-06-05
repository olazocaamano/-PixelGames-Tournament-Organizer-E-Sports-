const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/', authenticate, authorize('admin'), activityController.getActivities);

module.exports = router;
