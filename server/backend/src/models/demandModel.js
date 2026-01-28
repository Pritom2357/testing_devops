const pool = require('../config/db');

class DemandModel {
  static async create(locationId, productId, date, minQuantity, maxQuantity) {
    const result = await pool.query(
      'INSERT INTO demands (location_id, product_id, date, min_quantity, max_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [locationId, productId, date, minQuantity, maxQuantity]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM demands ORDER BY date');
    return result.rows;
  }

  static async getByDate(date) {
    const result = await pool.query('SELECT * FROM demands WHERE date = $1', [date]);
    return result.rows;
  }
}

module.exports = DemandModel;
