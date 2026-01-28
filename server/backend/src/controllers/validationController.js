const ValidationModel = require('../models/validationModel');

class ValidationController {
  static async validateTemperature(req, res) {
    try {
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

    
      const dateRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const demands = await ValidationModel.validateTemperature(date);
      
      const issues = [];
      
      for (const demand of demands) {
        const warehouses = await ValidationModel.getWarehousesOnRoute(demand.location_id);
        
        let canStore = false;
        let incompatibleWarehouses = [];
        
        for (const warehouse of warehouses) {
          const storageUnits = await ValidationModel.getStorageUnitsForWarehouse(warehouse.id);
          
          const compatible = storageUnits.some(unit => 
            Number(demand.product_min_temp) >= Number(unit.min_temperature) && 
            Number(demand.product_max_temp) <= Number(unit.max_temperature)
          );
          
          if (compatible) {
            canStore = true;
          } else {
            incompatibleWarehouses.push(warehouse.name);
          }
        }
        
        if (!canStore && warehouses.length > 0) {
          issues.push(
            `Product ${demand.product_name} is temperature incompatible with storage at location ${incompatibleWarehouses.join(', ')} for ${demand.location_name}`
          );
        }
      }

      if (issues.length > 0) {
        return res.json({ valid: false, issues });
      }

      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async validateNetwork(req, res) {
    try {
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      
      const dateRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const demands = await ValidationModel.getDemandsForDate(date);
      const routes = await ValidationModel.getRoutes();
      const storageUnits = await ValidationModel.getStorageUnits();
      const locations = await ValidationModel.getAllLocations();

      const issues = new Set();
      const minCapacityViolations = [];

      const demandsByLocation = {};
      for (const demand of demands) {
        if (!demandsByLocation[demand.location_id]) {
          demandsByLocation[demand.location_id] = [];
        }
        demandsByLocation[demand.location_id].push(demand);
      }

      for (const locationId in demandsByLocation) {
        const locationDemands = demandsByLocation[locationId];
        const totalMaxDemand = locationDemands.reduce((sum, d) => sum + Number(d.max_quantity), 0);
        
        const applicableRoutes = routes.filter(r => r.to_id === locationId);
        
        if (applicableRoutes.length === 0) continue;

        let canBeFulfilled = false;
        for (const route of applicableRoutes) {
          if (totalMaxDemand >= Number(route.min_shipment)) {
            canBeFulfilled = true;
            break;
          }
        }

        if (!canBeFulfilled) {
          issues.add('MIN_CAPACITY_VIOLATION');
          
          for (const route of applicableRoutes) {
            const fromLoc = locations.find(l => l.id === route.from_id);
            const toLoc = locations.find(l => l.id === route.to_id);
            
            minCapacityViolations.push({
              from: fromLoc?.name || route.from_id,
              to: toLoc?.name || route.to_id,
              used_capacity: totalMaxDemand,
              minShipment: route.min_shipment
            });
          }
        }
      }

      const routeUsage = {};
      const warehouseUsage = {};

      for (const route of routes) {
        routeUsage[route.id] = 0;
      }

      for (const locationId in demandsByLocation) {
        const locationDemands = demandsByLocation[locationId];
        const totalMaxDemand = locationDemands.reduce((sum, d) => sum + Number(d.max_quantity), 0);
        
        const applicableRoutes = routes.filter(r => r.to_id === locationId);
        
        if (applicableRoutes.length === 0) continue;

        let remainingDemand = totalMaxDemand;
        const sortedRoutes = [...applicableRoutes].sort((a, b) => Number(b.capacity) - Number(a.capacity));
        
        for (const route of sortedRoutes) {
          if (remainingDemand <= 0) break;
          
          const allocation = remainingDemand;
          routeUsage[route.id] += allocation;
          
          if (!warehouseUsage[route.from_id]) {
            warehouseUsage[route.from_id] = 0;
          }
          warehouseUsage[route.from_id] += allocation;
          
          remainingDemand = 0;
        }
      }

      for (const route of routes) {
        const usage = routeUsage[route.id] || 0;
        
        if (usage > Number(route.capacity)) {
          issues.add('MAX_CAPACITY_VIOLATION');
        }
      }

      for (const warehouseId in warehouseUsage) {
        const usage = warehouseUsage[warehouseId];
        const warehouseUnits = storageUnits.filter(u => u.location_id === warehouseId);
        const totalCapacity = warehouseUnits.reduce((sum, u) => sum + Number(u.capacity), 0);
        
        if (usage > totalCapacity) {
          issues.add('MAX_CAPACITY_VIOLATION');
        }
      }

      if (issues.size > 0) {
        const response = {
          feasible: false,
          issues: Array.from(issues)
        };

        if (minCapacityViolations.length > 0) {
          response.min_capacity_violations = minCapacityViolations;
        }

        return res.json(response);
      }

      res.json({ feasible: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ValidationController;
