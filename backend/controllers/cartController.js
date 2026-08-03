const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'supplier', select: 'name companyName' },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId and quantity',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const qty = Number(quantity);
    if (product.moq && qty < product.moq) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity for this fabric is ${product.moq} ${product.unit}s`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity: qty, color: color || '' }],
      });
    } else {
      // Check if product already exists in cart with same color
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.color === (color || '')
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty, color: color || '' });
      }

      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'supplier', select: 'name companyName' },
    });

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && (!color || item.color === color)
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
    }

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'supplier', select: 'name companyName' },
    });

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'supplier', select: 'name companyName' },
    });

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
