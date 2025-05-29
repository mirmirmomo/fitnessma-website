const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const config = require('../config');

const dbPath = path.resolve(__dirname, '../../database');
const dbFile = path.resolve(dbPath, 'fitnessma.db');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new sqlite3.Database(dbFile);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'client' CHECK(role IN ('client', 'admin', 'coach')),
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'blocked', 'inactive')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Coaches table
        db.run(`CREATE TABLE IF NOT EXISTS coaches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          specialty TEXT NOT NULL,
          bio TEXT,
          experience_years INTEGER DEFAULT 0,
          hourly_rate DECIMAL(10,2) DEFAULT 0.00,
          profile_image TEXT,
          available_days TEXT DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
          available_hours_start TEXT DEFAULT '09:00',
          available_hours_end TEXT DEFAULT '18:00',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Appointments table
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          coach_id INTEGER NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          duration INTEGER DEFAULT 60,
          status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(client_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY(coach_id) REFERENCES coaches(id) ON DELETE CASCADE
        )`);

        // Create default admin user
        const adminEmail = 'admin@fitnessma.com';
        const adminPassword = await bcrypt.hash('admin123', 12);
        
        db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) 
                VALUES (?, ?, 'Admin', 'User', 'admin')`, 
                [adminEmail, adminPassword]);

        // Create sample coaches
        const coachPassword = await bcrypt.hash('coach123', 12);
        
        // Coach 1
        db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) 
                VALUES (?, ?, 'John', 'Smith', 'coach')`, 
                ['john.smith@fitnessma.com', coachPassword], function() {
          if (this.lastID) {
            db.run(`INSERT OR IGNORE INTO coaches (user_id, specialty, bio, experience_years, hourly_rate) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [this.lastID, 'Weight Training & Strength', 'Certified personal trainer with 5+ years experience in strength training and muscle building.', 5, 75.00]);
          }
        });

        // Coach 2
        db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) 
                VALUES (?, ?, 'Sarah', 'Johnson', 'coach')`, 
                ['sarah.johnson@fitnessma.com', coachPassword], function() {
          if (this.lastID) {
            db.run(`INSERT OR IGNORE INTO coaches (user_id, specialty, bio, experience_years, hourly_rate) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [this.lastID, 'Yoga & Flexibility', 'Experienced yoga instructor specializing in Hatha and Vinyasa yoga for all levels.', 7, 60.00]);
          }
        });

        // Coach 3
        db.run(`INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) 
                VALUES (?, ?, 'Mike', 'Davis', 'coach')`, 
                ['mike.davis@fitnessma.com', coachPassword], function() {
          if (this.lastID) {
            db.run(`INSERT OR IGNORE INTO coaches (user_id, specialty, bio, experience_years, hourly_rate) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [this.lastID, 'Cardio & HIIT', 'High-intensity interval training specialist focused on cardio fitness and weight loss.', 4, 65.00]);
          }
        });

        console.log('Database tables created successfully');
        console.log('Default admin user created: admin@fitnessma.com / admin123');
        console.log('Sample coaches created with password: coach123');
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

const getDb = () => db;

module.exports = { initializeDatabase, getDb }; 