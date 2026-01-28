const pool = require('../config/db');

class StorageUnitModel {
  static async create(locationId, minTemperature, maxTemperature, capacity) {
    const result = await pool.query(
      'INSERT INTO storage_unit (location_id, min_temperature, max_temperature, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
      [locationId, minTemperature, maxTemperature, capacity]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM storage_unit');
    return result.rows;
  }

  static async getByLocationId(locationId) {
    const result = await pool.query('SELECT * FROM storage_unit WHERE location_id = $1', [locationId]);
    return result.rows;
  }
}

module.exports = StorageUnitModel;
