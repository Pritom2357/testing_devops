// tests/setup.js
const pool = require('../src/config/db');

// Close database connection after all tests complete
afterAll(async () => {
  await pool.end();
});
