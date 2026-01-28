const RouteModel = require('../models/routeModel');

class RouteController {
  static async create(req, res) {
    try {
      const { fromLocationId, toLocationId, capacity, minShipment } = req.body;
      
      if (!fromLocationId || !toLocationId || !capacity || minShipment === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (capacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be greater than 0' });
      }

      if (minShipment < 0) {
        return res.status(400).json({ error: 'minShipment cannot be negative' });
      }

      const route = await RouteModel.create(fromLocationId, toLocationId, capacity, minShipment);
      res.status(201).json(route);
    } catch (error) {
      // Check if this is a database trigger/constraint violation
      if (error.message && (error.message.includes('Invalid route') || error.message.includes('PRODUCER') || error.message.includes('WAREHOUSE') || error.message.includes('RETAILER') || error.message.includes('HOSPITAL'))) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const routes = await RouteModel.getAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RouteController;
