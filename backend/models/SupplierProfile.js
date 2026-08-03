const mongoose = require('mongoose');

const supplierProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please add a business name'],
      trim: true,
    },
    address: {
      street: { type: String, required: [true, 'Please add street address'] },
      city: { type: String, required: [true, 'Please add city'] },
      state: { type: String, required: [true, 'Please add state'] },
      zipCode: { type: String, required: [true, 'Please add zip code'] },
      country: { type: String, required: [true, 'Please add country'] },
    },
    categories: {
      type: [String],
      default: [],
    },
    moq: {
      type: String,
      required: [true, 'Please specify your Minimum Order Quantity (MOQ)'],
    },
    operatingHours: {
      type: String,
      required: [true, 'Please add operating hours'],
    },
    description: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    taxId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SupplierProfile', supplierProfileSchema);
