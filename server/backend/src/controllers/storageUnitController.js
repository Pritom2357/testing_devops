const StorageUnitModel = require('../models/storageUnitModel');

class StorageUnitController {
  static async create(req, res) {
    try {
      const { locationId, minTemperature, maxTemperature, capacity } = req.body;
      
      if (!locationId || minTemperature === undefined || maxTemperature === undefined || !capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (minTemperature > maxTemperature) {
        return res.status(400).json({ error: 'minTemperature cannot be greater than maxTemperature' });
      }

      if (capacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be greater than 0' });
      }

      const storageUnit = await StorageUnitModel.create(locationId, minTemperature, maxTemperature, capacity);
      res.status(201).json(storageUnit);
    } catch (error) {
      // Check if this is a database trigger/constraint violation
      if (error.message && (error.message.includes('Storage units') || error.message.includes('WAREHOUSE'))) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const storageUnits = await StorageUnitModel.getAll();
      res.json(storageUnits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StorageUnitController;
