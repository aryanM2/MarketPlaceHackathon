const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessType: {
      type: String,
      required: [true, 'Please select a business type'],
    },
    industry: {
      type: String,
      required: [true, 'Please select an industry segment'],
    },
    budget: {
      type: String,
      required: [true, 'Please select your estimated budget'],
    },
    preferredFabrics: {
      type: [String],
      default: [],
    },
    orderQuantity: {
      type: String,
      required: [true, 'Please specify your average order quantity'],
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
