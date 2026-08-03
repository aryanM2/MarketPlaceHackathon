const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getSupplierProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/mine', protect, authorize('supplier'), getSupplierProducts);
router.get('/:id', getProductById);

// Protected Supplier Routes
router.post('/', protect, authorize('supplier'), createProduct);
router.put('/:id', protect, authorize('supplier'), updateProduct);
router.delete('/:id', protect, authorize('supplier'), deleteProduct);

module.exports = router;
