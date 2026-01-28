const pool = require('../config/db');

class LocationModel {
  static async create(name, type, city) {
    const result = await pool.query(
      'INSERT INTO location (name, type, city) VALUES ($1, $2, $3) RETURNING *',
      [name, type, city]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM location ORDER BY name');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM location WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = LocationModel;
