const pool = require('../config/db');

class ProductModel {
  static async create(name, minTemperature, maxTemperature) {
    const result = await pool.query(
      'INSERT INTO product (name, min_temperature, max_temperature) VALUES ($1, $2, $3) RETURNING *',
      [name, minTemperature, maxTemperature]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM product ORDER BY name');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = ProductModel;
