const BuyerProfile = require('../models/BuyerProfile');

// @desc    Create or update buyer profile
// @route   POST /api/buyer/profile
// @access  Private (Buyer only)
const saveBuyerProfile = async (req, res) => {
  try {
    const { businessType, industry, budget, preferredFabrics, orderQuantity, address } = req.body;

    if (!businessType || !industry || !budget || !orderQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: Business Type, Industry, Budget, Order Quantity',
      });
    }

    const profileData = {
      user: req.user._id,
      businessType,
      industry,
      budget,
      preferredFabrics: Array.isArray(preferredFabrics) ? preferredFabrics : [],
      orderQuantity,
      address: address || {},
    };

    let profile = await BuyerProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await BuyerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = await BuyerProfile.create(profileData);
    }

    return res.status(200).json({
      success: true,
      message: 'Buyer profile saved successfully',
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current buyer profile
// @route   GET /api/buyer/profile
// @access  Private (Buyer only)
const getBuyerProfile = async (req, res) => {
  try {
    const profile = await BuyerProfile.findOne({ user: req.user._id }).populate('user', 'name email companyName phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Buyer profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  saveBuyerProfile,
  getBuyerProfile,
};
