const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/init');
const { authenticateToken, requireClient } = require('../middleware/auth');

const router = express.Router();

// Book new appointment
router.post('/', authenticateToken, requireClient, [
  body('coach_id').isInt({ min: 1 }),
  body('appointment_date').isDate(),
  body('appointment_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notes').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { coach_id, appointment_date, appointment_time, notes } = req.body;
  const clientId = req.user.userId;
  const db = getDb();

  // Check if time slot is available
  db.get(`
    SELECT id FROM appointments 
    WHERE coach_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'
  `, [coach_id, appointment_date, appointment_time], (err, existingAppointment) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Check if client already has an appointment at this time
    db.get(`
      SELECT id FROM appointments 
      WHERE client_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'
    `, [clientId, appointment_date, appointment_time], (err, clientConflict) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (clientConflict) {
        return res.status(400).json({ error: 'You already have an appointment at this time' });
      }

      // Create appointment
      db.run(`
        INSERT INTO appointments (client_id, coach_id, appointment_date, appointment_time, notes, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
      `, [clientId, coach_id, appointment_date, appointment_time, notes], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to book appointment' });
        }

        res.status(201).json({
          message: 'Appointment booked successfully',
          appointmentId: this.lastID
        });
      });
    });
  });
});

// Get user's appointments
router.get('/my', authenticateToken, (req, res) => {
  const db = getDb();
  const userId = req.user.userId;
  const userRole = req.user.role;

  let query;
  let params = [userId];

  if (userRole === 'client') {
    query = `
      SELECT 
        a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
        c.specialty as coach_specialty, c.hourly_rate as coach_hourly_rate,
        u.first_name as coach_first_name, u.last_name as coach_last_name
      FROM appointments a
      JOIN coaches c ON a.coach_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE a.client_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
  } else if (userRole === 'coach') {
    // Get coach ID from user ID
    db.get('SELECT id FROM coaches WHERE user_id = ?', [userId], (err, coach) => {
      if (err || !coach) {
        return res.status(404).json({ error: 'Coach profile not found' });
      }

      db.all(`
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
          u.first_name as client_first_name, u.last_name as client_last_name, u.email as client_email
        FROM appointments a
        JOIN users u ON a.client_id = u.id
        WHERE a.coach_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [coach.id], (err, appointments) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(appointments);
      });
    });
    return;
  } else {
    // Admin can see all appointments
    query = `
      SELECT 
        a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
        c.specialty as coach_specialty, c.hourly_rate as coach_hourly_rate,
        uc.first_name as coach_first_name, uc.last_name as coach_last_name,
        ucl.first_name as client_first_name, ucl.last_name as client_last_name
      FROM appointments a
      JOIN coaches c ON a.coach_id = c.id
      JOIN users uc ON c.user_id = uc.id
      JOIN users ucl ON a.client_id = ucl.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    params = [];
  }

  db.all(query, params, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(appointments);
  });
});

// Delete/Cancel appointment
router.delete('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const appointmentId = req.params.id;
  const userId = req.user.userId;
  const userRole = req.user.role;

  // Build where clause based on user role
  let whereClause = 'id = ?';
  let params = [appointmentId];

  if (userRole === 'client') {
    whereClause += ' AND client_id = ?';
    params.push(userId);
  } else if (userRole === 'coach') {
    // Get coach ID and add to where clause
    db.get('SELECT id FROM coaches WHERE user_id = ?', [userId], (err, coach) => {
      if (err || !coach) {
        return res.status(404).json({ error: 'Coach profile not found' });
      }

      db.run(`
        UPDATE appointments 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND coach_id = ? AND status != 'cancelled'
      `, [appointmentId, coach.id], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Appointment not found or cannot be cancelled' });
        }

        res.json({ message: 'Appointment cancelled successfully' });
      });
    });
    return;
  }
  // Admin can cancel any appointment, no additional where clause needed

  db.run(`
    UPDATE appointments 
    SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
    WHERE ${whereClause} AND status != 'cancelled'
  `, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Appointment not found or cannot be cancelled' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  });
});

// Get appointment by ID
router.get('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const appointmentId = req.params.id;

  db.get(`
    SELECT 
      a.id, a.appointment_date, a.appointment_time, a.duration, a.status, a.notes,
      c.specialty, c.hourly_rate,
      uc.first_name as coach_first_name, uc.last_name as coach_last_name,
      ucl.first_name as client_first_name, ucl.last_name as client_last_name, ucl.email as client_email
    FROM appointments a
    JOIN coaches c ON a.coach_id = c.id
    JOIN users uc ON c.user_id = uc.id
    JOIN users ucl ON a.client_id = ucl.id
    WHERE a.id = ?
  `, [appointmentId], (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  });
});

module.exports = router; 