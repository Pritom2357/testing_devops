const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');

const locationRoutes = require('./src/routes/locationRoutes');
const productRoutes = require('./src/routes/productRoutes');
const storageUnitRoutes = require('./src/routes/storageUnitRoutes');
const routeRoutes = require('./src/routes/routeRoutes');
const demandRoutes = require('./src/routes/demandRoutes');
const tempRoutes = require('./src/routes/tempRoutes');
const networkRoutes = require('./src/routes/networkRoutes');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'FrostByte Logistics Server Running and Arka gay',
      timestamp: result.rows[0].now,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.use('/locations', locationRoutes);
app.use('/products', productRoutes);
app.use('/storage-units', storageUnitRoutes);
app.use('/routes', routeRoutes);
app.use('/demands', demandRoutes);
app.use('/temps', tempRoutes);
app.use('/network', networkRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
