const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();

  db.all(`
    SELECT id, email, first_name, last_name, phone, role, status, created_at, updated_at
    FROM users 
    ORDER BY created_at DESC
  `, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(users);
  });
});

// Create new client (admin only)
router.post('/users', authenticateToken, requireAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('role').optional().isIn(['client', 'coach', 'admin'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, phone, role = 'client' } = req.body;
  const db = getDb();

  try {
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      db.run(
        'INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, phone, role],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          res.status(201).json({
            message: 'User created successfully',
            user: {
              id: this.lastID,
              email,
              firstName,
              lastName,
              phone,
              role
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Block/Unblock user (admin only)
router.patch('/users/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['active', 'blocked', 'inactive'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { status } = req.body;
  const db = getDb();

  // Prevent admin from blocking themselves
  if (parseInt(userId) === req.user.userId) {
    return res.status(400).json({ error: 'You cannot change your own status' });
  }

  db.run(`
    UPDATE users 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [status, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: `User ${status === 'blocked' ? 'blocked' : status === 'active' ? 'unblocked' : 'deactivated'} successfully` 
    });
  });
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  const db = getDb();

  // Prevent admin from deleting themselves
  if (parseInt(userId) === req.user.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }

  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

// Get system statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();

  const stats = {};

  // Get user counts by role
  db.get(`
    SELECT 
      COUNT(*) as total_users,
      SUM(CASE WHEN role = 'client' THEN 1 ELSE 0 END) as clients,
      SUM(CASE WHEN role = 'coach' THEN 1 ELSE 0 END) as coaches,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
      SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked_users
    FROM users
  `, (err, userStats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    stats.users = userStats;

    // Get appointment counts by status
    db.get(`
      SELECT 
        COUNT(*) as total_appointments,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'no-show' THEN 1 ELSE 0 END) as no_shows
      FROM appointments
    `, (err, appointmentStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      stats.appointments = appointmentStats;

      // Get recent activity (last 30 days)
      db.get(`
        SELECT 
          COUNT(*) as new_users_this_month
        FROM users 
        WHERE created_at >= date('now', '-30 days')
      `, (err, recentUsers) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.get(`
          SELECT 
            COUNT(*) as appointments_this_month
          FROM appointments 
          WHERE created_at >= date('now', '-30 days')
        `, (err, recentAppointments) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          stats.recent = {
            new_users_this_month: recentUsers.new_users_this_month,
            appointments_this_month: recentAppointments.appointments_this_month
          };

          res.json(stats);
        });
      });
    });
  });
});

// Get all appointments (admin only)
router.get('/appointments', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();

  db.all(`
    SELECT 
      a.id, a.appointment_date, a.appointment_time, a.duration, a.status, a.notes, a.created_at,
      c.specialty, c.hourly_rate,
      uc.first_name as coach_first_name, uc.last_name as coach_last_name, uc.email as coach_email,
      ucl.first_name as client_first_name, ucl.last_name as client_last_name, ucl.email as client_email
    FROM appointments a
    JOIN coaches c ON a.coach_id = c.id
    JOIN users uc ON c.user_id = uc.id
    JOIN users ucl ON a.client_id = ucl.id
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(appointments);
  });
});

// Get all coaches for admin
router.get('/coaches', authenticateToken, requireAdmin, (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT 
      c.id, c.specialty, c.bio, c.hourly_rate, c.experience_years,
      c.available_days, c.available_hours_start, c.available_hours_end,
      c.created_at, c.updated_at,
      u.id as user_id, u.email, u.first_name, u.last_name, u.status
    FROM coaches c
    JOIN users u ON c.user_id = u.id
    ORDER BY u.first_name, u.last_name
  `, [], (err, coaches) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(coaches);
  });
});

// Create new coach
router.post('/coaches', authenticateToken, requireAdmin, [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().isLength({ min: 1 }),
  body('last_name').trim().isLength({ min: 1 }),
  body('specialty').trim().isLength({ min: 1 }),
  body('bio').optional().trim(),
  body('hourly_rate').isFloat({ min: 0 }),
  body('experience_years').isInt({ min: 0 }),
  body('available_days').trim().isLength({ min: 1 }),
  body('available_hours_start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('available_hours_end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    email, password, first_name, last_name, 
    specialty, bio, hourly_rate, experience_years,
    available_days, available_hours_start, available_hours_end 
  } = req.body;

  const db = getDb();

  try {
    // Check if email already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user first
      db.run(`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES (?, ?, ?, ?, 'coach')
      `, [email, hashedPassword, first_name, last_name], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const userId = this.lastID;

        // Create coach profile
        db.run(`
          INSERT INTO coaches (
            user_id, specialty, bio, hourly_rate, experience_years,
            available_days, available_hours_start, available_hours_end
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId, specialty, bio || '', hourly_rate, experience_years,
          available_days, available_hours_start, available_hours_end
        ], function(err) {
          if (err) {
            // Rollback user creation if coach creation fails
            db.run('DELETE FROM users WHERE id = ?', [userId]);
            return res.status(500).json({ error: 'Failed to create coach profile' });
          }

          res.status(201).json({
            message: 'Coach created successfully',
            coachId: this.lastID,
            userId: userId
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update coach
router.put('/coaches/:id', authenticateToken, requireAdmin, [
  body('specialty').trim().isLength({ min: 1 }),
  body('bio').optional().trim(),
  body('hourly_rate').isFloat({ min: 0 }),
  body('experience_years').isInt({ min: 0 }),
  body('available_days').trim().isLength({ min: 1 }),
  body('available_hours_start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('available_hours_end').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('first_name').optional().trim().isLength({ min: 1 }),
  body('last_name').optional().trim().isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const coachId = req.params.id;
  const { 
    specialty, bio, hourly_rate, experience_years,
    available_days, available_hours_start, available_hours_end,
    first_name, last_name
  } = req.body;

  const db = getDb();

  // Update coach profile
  db.run(`
    UPDATE coaches 
    SET specialty = ?, bio = ?, hourly_rate = ?, experience_years = ?,
        available_days = ?, available_hours_start = ?, available_hours_end = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    specialty, bio || '', hourly_rate, experience_years,
    available_days, available_hours_start, available_hours_end, coachId
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update coach profile' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    // Update user details if provided
    if (first_name || last_name) {
      db.get('SELECT user_id FROM coaches WHERE id = ?', [coachId], (err, coach) => {
        if (err || !coach) {
          return res.status(404).json({ error: 'Coach not found' });
        }

        const updateFields = [];
        const updateValues = [];

        if (first_name) {
          updateFields.push('first_name = ?');
          updateValues.push(first_name);
        }
        if (last_name) {
          updateFields.push('last_name = ?');
          updateValues.push(last_name);
        }

        if (updateFields.length > 0) {
          updateValues.push(coach.user_id);
          
          db.run(`
            UPDATE users 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, updateValues, (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update user details' });
            }
            res.json({ message: 'Coach updated successfully' });
          });
        } else {
          res.json({ message: 'Coach updated successfully' });
        }
      });
    } else {
      res.json({ message: 'Coach updated successfully' });
    }
  });
});

// Delete coach
router.delete('/coaches/:id', authenticateToken, requireAdmin, (req, res) => {
  const coachId = req.params.id;
  const db = getDb();

  // Get coach's user_id first
  db.get('SELECT user_id FROM coaches WHERE id = ?', [coachId], (err, coach) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    // Check if coach has any appointments
    db.get('SELECT COUNT(*) as count FROM appointments WHERE coach_id = ? AND status != "cancelled"', [coachId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.count > 0) {
        return res.status(400).json({ error: 'Cannot delete coach with active appointments. Cancel all appointments first.' });
      }

      // Delete coach profile
      db.run('DELETE FROM coaches WHERE id = ?', [coachId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete coach profile' });
        }

        // Delete associated user
        db.run('DELETE FROM users WHERE id = ?', [coach.user_id], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to delete user account' });
          }

          res.json({ message: 'Coach deleted successfully' });
        });
      });
    });
  });
});

module.exports = router; 