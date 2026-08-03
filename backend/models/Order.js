const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: [true, 'Please add full name for shipping'] },
      phone: { type: String, required: [true, 'Please add contact phone number'] },
      street: { type: String, required: [true, 'Please add street address'] },
      city: { type: String, required: [true, 'Please add city'] },
      state: { type: String, required: [true, 'Please add state'] },
      zipCode: { type: String, required: [true, 'Please add zip code'] },
      country: { type: String, required: [true, 'Please add country'] },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    freightFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
