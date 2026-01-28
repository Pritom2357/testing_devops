const DemandModel = require('../models/demandModel');

class DemandController {
  static async create(req, res) {
    try {
      const { locationId, productId, date, minQuantity, maxQuantity } = req.body;
      
      if (!locationId || !productId || !date || minQuantity === undefined || maxQuantity === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (minQuantity < 0) {
        return res.status(400).json({ error: 'minQuantity cannot be negative' });
      }

      if (maxQuantity < minQuantity) {
        return res.status(400).json({ error: 'maxQuantity cannot be less than minQuantity' });
      }

      const demand = await DemandModel.create(locationId, productId, date, minQuantity, maxQuantity);
      res.status(201).json(demand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const demands = await DemandModel.getAll();
      res.json(demands);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DemandController;
