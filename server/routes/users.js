const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const db = getDb();
  const userId = req.user.userId;

  db.get(`
    SELECT id, email, first_name, last_name, phone, role, status, created_at
    FROM users 
    WHERE id = ?
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, phone } = req.body;
  const userId = req.user.userId;
  const db = getDb();

  db.run(`
    UPDATE users 
    SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [firstName, lastName, phone, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

module.exports = router; 