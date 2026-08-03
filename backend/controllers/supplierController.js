const SupplierProfile = require('../models/SupplierProfile');

// @desc    Create or update supplier profile
// @route   POST /api/supplier/profile
// @access  Private (Supplier only)
const saveSupplierProfile = async (req, res) => {
  try {
    const { businessName, address, categories, moq, operatingHours, description, phone, taxId } = req.body;

    if (!businessName || !moq || !operatingHours) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in required fields: Business Name, MOQ, Operating Hours',
      });
    }

    if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all address fields (street, city, state, zip code, country)',
      });
    }

    const profileData = {
      user: req.user._id,
      businessName,
      address,
      categories: Array.isArray(categories) ? categories : [],
      moq,
      operatingHours,
      description: description || '',
      phone: phone || '',
      taxId: taxId || '',
    };

    let profile = await SupplierProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await SupplierProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = await SupplierProfile.create(profileData);
    }

    return res.status(200).json({
      success: true,
      message: 'Supplier profile saved successfully',
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current supplier profile
// @route   GET /api/supplier/profile
// @access  Private (Supplier only)
const getSupplierProfile = async (req, res) => {
  try {
    const profile = await SupplierProfile.findOne({ user: req.user._id }).populate('user', 'name email companyName phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Supplier profile not found',
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
  saveSupplierProfile,
  getSupplierProfile,
};
