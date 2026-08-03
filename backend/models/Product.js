const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    fabricType: {
      type: String,
      required: [true, 'Please specify fabric type'],
    },
    price: {
      type: Number,
      required: [true, 'Please add price per unit'],
      min: 0,
    },
    unit: {
      type: String,
      default: 'meter',
    },
    stock: {
      type: Number,
      required: [true, 'Please specify available stock'],
      default: 0,
    },
    moq: {
      type: Number,
      default: 100,
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      weightGSM: { type: Number, default: 180 },
      widthInches: { type: Number, default: 58 },
      pattern: { type: String, default: 'Solid Plain' },
      origin: { type: String, default: 'India' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
