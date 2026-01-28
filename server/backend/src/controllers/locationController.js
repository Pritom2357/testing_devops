const LocationModel = require('../models/locationModel');

class LocationController {
  static async create(req, res) {
    try {
      const { name, type, city } = req.body;
      
      if (!name || !type || !city) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const validTypes = ['PRODUCER', 'WAREHOUSE', 'RETAILER', 'HOSPITAL'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid location type' });
      }

      const location = await LocationModel.create(name, type, city);
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const locations = await LocationModel.getAll();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocationController;
