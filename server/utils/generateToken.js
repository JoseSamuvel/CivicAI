const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given userId.
 * Expires in 7 days.
 */
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = generateToken;
