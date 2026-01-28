const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'frostbyte',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123'
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    const client = await pool.connect();
    console.log('Connection established successfully');
    
    const result = await client.query('SELECT NOW(), version()');
    console.log('Current timestamp:', result.rows[0].now);
    console.log('PostgreSQL version:', result.rows[0].version);
    
    client.release();
    
    await pool.end();
    console.log('Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database connection test failed:');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();
