const express = require('express');
const router = express.Router();
const { saveBuyerProfile, getBuyerProfile } = require('../controllers/buyerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/profile', protect, authorize('buyer'), saveBuyerProfile);
router.get('/profile', protect, authorize('buyer'), getBuyerProfile);

module.exports = router;
