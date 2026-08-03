const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, notes } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping address fields',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty',
      });
    }

    // Build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      const itemPrice = product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        supplier: product.supplier,
        quantity: item.quantity,
        price: itemPrice,
        color: item.color || '',
      });
    }

    const freightFee = subtotal > 1000 ? 0 : 45.00;
    const totalAmount = subtotal + freightFee;

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      freightFee,
      totalAmount,
      notes: notes || '',
      status: 'Pending',
    });

    // Clear buyer's cart after successful order creation
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product')
      .populate('items.supplier', 'name companyName email phone')
      .populate('buyer', 'name email companyName phone');

    return res.status(201).json({
      success: true,
      message: 'Purchase Order created successfully',
      data: populatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get buyer orders
// @route   GET /api/orders/buyer
// @access  Private (Buyer)
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.product')
      .populate('items.supplier', 'name companyName')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get supplier incoming orders
// @route   GET /api/orders/supplier
// @access  Private (Supplier)
const getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.supplier': req.user._id })
      .populate('items.product')
      .populate('buyer', 'name email companyName phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('items.supplier', 'name companyName email phone')
      .populate('buyer', 'name email companyName phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Supplier or Buyer)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    order = await Order.findById(order._id)
      .populate('items.product')
      .populate('items.supplier', 'name companyName')
      .populate('buyer', 'name email companyName');

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
  getOrderById,
  updateOrderStatus,
};
