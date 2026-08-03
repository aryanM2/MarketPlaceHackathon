const express = require('express');
const router = express.Router();
const {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('buyer'), createOrder);
router.get('/buyer', authorize('buyer'), getBuyerOrders);
router.get('/supplier', authorize('supplier'), getSupplierOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
