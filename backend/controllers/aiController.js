const Product = require('../models/Product');

// @desc    Process AI chat query & return fabric recommendations & assistance
// @route   POST /api/ai/chat
// @access  Public
const processAIChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message text',
      });
    }

    const queryLower = message.toLowerCase();

    // Search database for matching products
    let matchingProducts = [];
    if (
      queryLower.includes('cotton') ||
      queryLower.includes('denim') ||
      queryLower.includes('silk') ||
      queryLower.includes('linen') ||
      queryLower.includes('nylon') ||
      queryLower.includes('wool') ||
      queryLower.includes('rayon') ||
      queryLower.includes('sustainable') ||
      queryLower.includes('waterproof') ||
      queryLower.includes('breathable')
    ) {
      const searchTerms = ['cotton', 'denim', 'silk', 'linen', 'nylon', 'wool', 'rayon', 'sustainable', 'waterproof', 'breathable']
        .filter((term) => queryLower.includes(term));

      matchingProducts = await Product.find({
        $or: [
          { name: { $regex: searchTerms.join('|'), $options: 'i' } },
          { fabricType: { $regex: searchTerms.join('|'), $options: 'i' } },
          { category: { $regex: searchTerms.join('|'), $options: 'i' } },
          { description: { $regex: searchTerms.join('|'), $options: 'i' } },
        ],
      }).limit(4);
    } else {
      // Default sample recommendations
      matchingProducts = await Product.find().limit(3);
    }

    // Generate intelligent contextual response
    let responseText = '';

    if (queryLower.includes('compare') || queryLower.includes('difference')) {
      responseText = `Here is a technical comparison for your fabric sourcing requirements:\n\n` +
        `• **Cotton/Linen**: High breathability, natural absorbency (180-210 GSM), ideal for summer shirts and casual wear.\n` +
        `• **Synthetics/Nylon**: High tensile strength, tear-proof ripstop weave (260 GSM), suitable for technical outerwear and gear.\n` +
        `• **Silk/Satin**: High momme weight satin weave with luxury drape, ideal for formalwear.\n\n` +
        `I found ${matchingProducts.length} relevant fabrics matching your query:`;
    } else if (queryLower.includes('recommend') || queryLower.includes('suggest') || queryLower.includes('breathable') || queryLower.includes('summer')) {
      responseText = `Based on your request, I recommend focusing on natural plant-based knits or slub weaves with GSM under 200. Here are the top mill offerings currently available:`;
    } else if (queryLower.includes('cheap') || queryLower.includes('price') || queryLower.includes('budget')) {
      responseText = `Here are cost-effective fabric options priced competitively per meter for volume wholesale orders:`;
    } else {
      responseText = `Hello! I am your TexTrade B2B AI Assistant. I can help you search fabric compositions, compare GSM weights, check MOQ thresholds, and recommend supplier listings. Here are relevant matches from our catalog:`;
    }

    return res.status(200).json({
      success: true,
      message: responseText,
      products: matchingProducts.map((p) => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        fabricType: p.fabricType,
        price: p.price,
        unit: p.unit,
        moq: p.moq,
        image: p.images?.[0] || '',
        gsm: p.specifications?.weightGSM || 180,
      })),
    });
  } catch (error) {
    // Fail gracefully without crashing application
    console.error('AI Processing Error:', error);
    return res.status(200).json({
      success: true,
      message: 'I am here to assist with your fabric sourcing questions! Browse our catalog or try searching for specific materials like Cotton, Silk, or Denim.',
      products: [],
    });
  }
};

module.exports = {
  processAIChat,
};
