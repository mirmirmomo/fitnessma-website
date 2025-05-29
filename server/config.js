module.exports = {
  PORT: process.env.PORT || 5001,
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  DB_PATH: process.env.DB_PATH || './database/fitnessma.db',
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 