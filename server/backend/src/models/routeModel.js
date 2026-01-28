const pool = require('../config/db');

class RouteModel {
  static async create(fromLocationId, toLocationId, capacity, minShipment) {
    const result = await pool.query(
      'INSERT INTO routes (from_id, to_id, capacity, min_shipment) VALUES ($1, $2, $3, $4) RETURNING *',
      [fromLocationId, toLocationId, capacity, minShipment]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM routes');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = RouteModel;
