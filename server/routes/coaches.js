const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all coaches
router.get('/', (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT 
      c.id, c.specialty, c.bio, c.experience_years, c.hourly_rate, 
      c.profile_image, c.available_days, c.available_hours_start, c.available_hours_end,
      u.first_name, u.last_name, u.email
    FROM coaches c
    JOIN users u ON c.user_id = u.id
    WHERE u.status = 'active'
    ORDER BY u.first_name, u.last_name
  `, (err, coaches) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(coaches);
  });
});

// Get coach by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const coachId = req.params.id;
  
  db.get(`
    SELECT 
      c.id, c.specialty, c.bio, c.experience_years, c.hourly_rate, 
      c.profile_image, c.available_days, c.available_hours_start, c.available_hours_end,
      u.first_name, u.last_name, u.email
    FROM coaches c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ? AND u.status = 'active'
  `, [coachId], (err, coach) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    
    res.json(coach);
  });
});

// Get coach availability for a specific date
router.get('/:id/availability/:date', (req, res) => {
  const db = getDb();
  const { id: coachId, date } = req.params;
  
  // Get coach's available hours
  db.get(`
    SELECT available_hours_start, available_hours_end, available_days
    FROM coaches 
    WHERE id = ?
  `, [coachId], (err, coach) => {
    if (err || !coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    
    // Check if coach is available on the requested day
    const requestDate = new Date(date);
    const dayName = requestDate.toLocaleDateString('en-US', { weekday: 'long' });
    const availableDays = coach.available_days.split(',');
    
    if (!availableDays.includes(dayName)) {
      return res.json({ available: false, message: 'Coach not available on this day' });
    }
    
    // Get existing appointments for this date
    db.all(`
      SELECT appointment_time, duration
      FROM appointments 
      WHERE coach_id = ? AND appointment_date = ? AND status = 'scheduled'
    `, [coachId, date], (err, appointments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Generate available time slots (1-hour slots)
      const startHour = parseInt(coach.available_hours_start.split(':')[0]);
      const endHour = parseInt(coach.available_hours_end.split(':')[0]);
      const availableSlots = [];
      
      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = appointments.some(app => app.appointment_time === timeSlot);
        
        if (!isBooked) {
          availableSlots.push(timeSlot);
        }
      }
      
      res.json({
        available: true,
        availableSlots,
        startTime: coach.available_hours_start,
        endTime: coach.available_hours_end
      });
    });
  });
});

module.exports = router; 