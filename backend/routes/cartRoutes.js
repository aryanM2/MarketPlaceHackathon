const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item', updateCartItem);
router.delete('/item/:productId', removeFromCart);

module.exports = router;
