const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'textile_marketplace_hackathon_secret_key_2026',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
