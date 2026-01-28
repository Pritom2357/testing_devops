const pool = require('../config/db');

class ValidationModel {
  static async validateTemperature(date) {
    const query = `
      SELECT 
        d.id as demand_id,
        l.name as location_name,
        l.type as location_type,
        p.name as product_name,
        p.min_temperature as product_min_temp,
        p.max_temperature as product_max_temp,
        d.location_id,
        d.product_id
      FROM demands d
      JOIN location l ON d.location_id = l.id
      JOIN product p ON d.product_id = p.id
      WHERE d.date = $1
    `;
    
    const demands = await pool.query(query, [date]);
    return demands.rows;
  }

  static async getStorageUnitsForWarehouse(warehouseId) {
    const result = await pool.query(
      'SELECT * FROM storage_unit WHERE location_id = $1',
      [warehouseId]
    );
    return result.rows;
  }

  static async getRoutesToLocation(locationId) {
    const result = await pool.query(
      'SELECT * FROM routes WHERE to_id = $1',
      [locationId]
    );
    return result.rows;
  }

  static async getWarehousesOnRoute(locationId) {
    const result = await pool.query(
      `SELECT DISTINCT l.* 
       FROM location l
       JOIN routes r ON l.id = r.from_id
       WHERE r.to_id = $1 AND l.type = 'WAREHOUSE'`,
      [locationId]
    );
    return result.rows;
  }

  static async getDemandsForDate(date) {
    const result = await pool.query(
      `SELECT d.*, l.name as location_name, l.type as location_type, p.name as product_name
       FROM demands d
       JOIN location l ON d.location_id = l.id
       JOIN product p ON d.product_id = p.id
       WHERE d.date = $1`,
      [date]
    );
    return result.rows;
  }

  static async getRoutes() {
    const result = await pool.query('SELECT * FROM routes');
    return result.rows;
  }

  static async getStorageUnits() {
    const result = await pool.query('SELECT * FROM storage_unit');
    return result.rows;
  }

  static async getAllLocations() {
    const result = await pool.query('SELECT * FROM location');
    return result.rows;
  }
}

module.exports = ValidationModel;
