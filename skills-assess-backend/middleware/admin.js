const pool = require('../config/db');

// Middleware to check if a user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists in request (should be added by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Query the database to check if the user is an admin
    const [users] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is an admin
    if (!users[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isAdmin;