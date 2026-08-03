const express = require('express');
const router = express.Router();
const { saveSupplierProfile, getSupplierProfile } = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/profile', protect, authorize('supplier'), saveSupplierProfile);
router.get('/profile', protect, authorize('supplier'), getSupplierProfile);

module.exports = router;
