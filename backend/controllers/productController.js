const Product = require('../models/Product');
const User = require('../models/User');
const sampleProducts = require('../utils/sampleProducts');

// Internal helper to seed initial sample products if database is empty
const seedSampleProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // Find or create a default supplier user
      let supplierUser = await User.findOne({ role: 'supplier' });
      if (!supplierUser) {
        supplierUser = await User.create({
          name: 'Apex Textile Mills',
          email: 'supplier@textrade.com',
          password: 'password123',
          role: 'supplier',
          companyName: 'Apex Global Mills Ltd.',
          phone: '+1 (555) 990-1122',
        });
      }

      const productsToSeed = sampleProducts.map((item) => ({
        ...item,
        supplier: supplierUser._id,
      }));

      await Product.insertMany(productsToSeed);
      console.log('🌱 Sample B2B textile products seeded successfully');
    }
  } catch (err) {
    console.error('Failed to seed sample products:', err);
  }
};

// @desc    Get all products (with search & filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    await seedSampleProductsIfEmpty();

    const { search, category, fabricType, minPrice, maxPrice, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabricType: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (fabricType) {
      query.fabricType = { $regex: fabricType, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const products = await Product.find(query)
      .populate('supplier', 'name companyName email phone')
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    await seedSampleProductsIfEmpty();

    const featured = await Product.find({ isFeatured: true })
      .limit(6)
      .populate('supplier', 'name companyName');

    return res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'supplier',
      'name companyName email phone'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create new product (Supplier only)
// @route   POST /api/products
// @access  Private (Supplier)
const createProduct = async (req, res) => {
  try {
    const { name, description, category, fabricType, price, unit, stock, moq, colors, images, specifications, isFeatured } = req.body;

    if (!name || !description || !category || !fabricType || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in required fields (name, description, category, fabricType, price, stock)',
      });
    }

    const product = await Product.create({
      supplier: req.user._id,
      name,
      description,
      category,
      fabricType,
      price: Number(price),
      unit: unit || 'meter',
      stock: Number(stock),
      moq: Number(moq) || 100,
      colors: Array.isArray(colors) ? colors : [],
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80'],
      specifications: specifications || {},
      isFeatured: !!isFeatured,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update product (Supplier only)
// @route   PUT /api/products/:id
// @access  Private (Supplier)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ensure logged in user is the owner of product
    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete product (Supplier only)
// @route   DELETE /api/products/:id
// @access  Private (Supplier)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Product removed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
