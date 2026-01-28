const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'frostbite_warehouse',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20
});

module.exports = pool;
