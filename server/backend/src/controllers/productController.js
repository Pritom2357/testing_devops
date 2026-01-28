const ProductModel = require('../models/productModel');

class ProductController {
  static async create(req, res) {
    try {
      const { name, minTemperature, maxTemperature } = req.body;
      
      if (!name || minTemperature === undefined || maxTemperature === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (minTemperature > maxTemperature) {
        return res.status(400).json({ error: 'minTemperature cannot be greater than maxTemperature' });
      }

      const product = await ProductModel.create(name, minTemperature, maxTemperature);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
