const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get('/', authenticate, authorize('admin'), statsController.getAdvancedStats);

module.exports = router;
