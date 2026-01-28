// tests/integration/seed.test.js
const request = require('supertest');
const app = require('../../index');
const testData = require('../fixtures/testData');

describe('Seed APIs - Create Locations, Products, Storage Units, Routes, and Demands', () => {
  
  // ==================== LOCATIONS ====================
  
  describe('Create Locations', () => {
    
    describe('Producers', () => {
      it('should create Farm Alpha (P1)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'Farm Alpha',
            type: 'PRODUCER',
            city: 'Bogura'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Farm Alpha');
        expect(response.body.type).toBe('PRODUCER');
        expect(response.body.city).toBe('Bogura');
        expect(response.body.id).toBeDefined();
        
        testData.locations.P1 = response.body.id;
      });

      it('should create Vaccine Factory Beta (P2)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'Vaccine Factory Beta',
            type: 'PRODUCER',
            city: 'Gazipur'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Vaccine Factory Beta');
        expect(response.body.type).toBe('PRODUCER');
        testData.locations.P2 = response.body.id;
      });
    });

    describe('Warehouses', () => {
      it('should create Central Cold Warehouse (W1)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'Central Cold Warehouse',
            type: 'WAREHOUSE',
            city: 'Dhaka'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('WAREHOUSE');
        testData.locations.W1 = response.body.id;
      });

      it('should create North Storage Hub (W2)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'North Storage Hub',
            type: 'WAREHOUSE',
            city: 'Rajshahi'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('WAREHOUSE');
        testData.locations.W2 = response.body.id;
      });

      it('should create South Distribution Hub (W3)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'South Distribution Hub',
            type: 'WAREHOUSE',
            city: 'Khulna'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('WAREHOUSE');
        testData.locations.W3 = response.body.id;
      });
    });

    describe('Retailers', () => {
      it('should create FreshMart Uttara (R1)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'FreshMart Uttara',
            type: 'RETAILER',
            city: 'Dhaka'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('RETAILER');
        testData.locations.R1 = response.body.id;
      });

      it('should create FreshMart Dhanmondi (R2)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'FreshMart Dhanmondi',
            type: 'RETAILER',
            city: 'Dhaka'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('RETAILER');
        testData.locations.R2 = response.body.id;
      });

      it('should create FreshMart Khulna (R3)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'FreshMart Khulna',
            type: 'RETAILER',
            city: 'Khulna'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('RETAILER');
        testData.locations.R3 = response.body.id;
      });
    });

    describe('Hospitals', () => {
      it('should create City General Hospital (H1)', async () => {
        const response = await request(app)
          .post('/locations')
          .send({
            name: 'City General Hospital',
            type: 'HOSPITAL',
            city: 'Dhaka'
          });
        
        expect(response.status).toBe(201);
        expect(response.body.type).toBe('HOSPITAL');
        testData.locations.H1 = response.body.id;
      });
    });

    it('should reject invalid location type', async () => {
      const response = await request(app)
        .post('/locations')
        .send({
          name: 'Invalid Location',
          type: 'INVALID_TYPE',
          city: 'City'
        });
      
      expect(response.status).toBe(400);
    });
  });

  // ==================== PRODUCTS ====================

  describe('Create Products', () => {
    it('should create Frozen Vaccine (PR1)', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          name: 'Frozen Vaccine',
          minTemperature: -20,
          maxTemperature: -10
        });
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Frozen Vaccine');
      expect(Number(response.body.min_temperature)).toBe(-20);
      expect(Number(response.body.max_temperature)).toBe(-10);
      testData.products.PR1 = response.body.id;
    });

    it('should create Fresh Milk (PR2)', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          name: 'Fresh Milk',
          minTemperature: 2,
          maxTemperature: 6
        });
      
      expect(response.status).toBe(201);
      testData.products.PR2 = response.body.id;
    });

    it('should create Ice Cream (PR3)', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          name: 'Ice Cream',
          minTemperature: -18,
          maxTemperature: -5
        });
      
      expect(response.status).toBe(201);
      testData.products.PR3 = response.body.id;
    });

    it('should create Frozen Meat (PR4)', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          name: 'Frozen Meat',
          minTemperature: -20,
          maxTemperature: -5
        });
      
      expect(response.status).toBe(201);
      testData.products.PR4 = response.body.id;
    });

    it('should reject if minTemperature > maxTemperature', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          name: 'Invalid Product',
          minTemperature: 10,
          maxTemperature: 5
        });
      
      expect(response.status).toBe(400);
    });
  });

  // ==================== STORAGE UNITS ====================

  describe('Create Storage Units', () => {
    
    describe('Central Cold Warehouse (W1) Storage Units', () => {
      it('should create frozen storage unit (-25 to -5)', async () => {
        const response = await request(app)
          .post('/storage-units')
          .send({
            locationId: testData.locations.W1,
            minTemperature: -25,
            maxTemperature: -5,
            capacity: 500
          });
        
        expect(response.status).toBe(201);
        expect(Number(response.body.capacity)).toBe(500);
        testData.storageUnits.SU1 = response.body.id;
      });

      it('should create fresh storage unit (0 to 10)', async () => {
        const response = await request(app)
          .post('/storage-units')
          .send({
            locationId: testData.locations.W1,
            minTemperature: 0,
            maxTemperature: 10,
            capacity: 300
          });
        
        expect(response.status).toBe(201);
        testData.storageUnits.SU2 = response.body.id;
      });
    });

    describe('North Storage Hub (W2) Storage Units', () => {
      it('should create frozen storage unit (-22 to -6)', async () => {
        const response = await request(app)
          .post('/storage-units')
          .send({
            locationId: testData.locations.W2,
            minTemperature: -22,
            maxTemperature: -6,
            capacity: 250
          });
        
        expect(response.status).toBe(201);
        testData.storageUnits.SU3 = response.body.id;
      });

      it('should create fresh storage unit (1 to 8)', async () => {
        const response = await request(app)
          .post('/storage-units')
          .send({
            locationId: testData.locations.W2,
            minTemperature: 1,
            maxTemperature: 8,
            capacity: 200
          });
        
        expect(response.status).toBe(201);
        testData.storageUnits.SU4 = response.body.id;
      });
    });

    describe('South Distribution Hub (W3) Storage Units', () => {
      it('should create fresh storage unit (1 to 8)', async () => {
        const response = await request(app)
          .post('/storage-units')
          .send({
            locationId: testData.locations.W3,
            minTemperature: 1,
            maxTemperature: 8,
            capacity: 250
          });
        
        expect(response.status).toBe(201);
        testData.storageUnits.SU5 = response.body.id;
      });
    });

    it('should reject storage unit at non-warehouse location', async () => {
      const response = await request(app)
        .post('/storage-units')
        .send({
          locationId: testData.locations.P1, // Producer, not warehouse
          minTemperature: -20,
          maxTemperature: -5,
          capacity: 100
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject if capacity <= 0', async () => {
      const response = await request(app)
        .post('/storage-units')
        .send({
          locationId: testData.locations.W1,
          minTemperature: -20,
          maxTemperature: -5,
          capacity: 0
        });
      
      expect(response.status).toBe(400);
    });
  });

  // ==================== ROUTES ====================

  describe('Create Routes', () => {
    
    describe('Producer to Warehouse Routes', () => {
      it('should create P1 -> W1 route (RT1)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.P1,
            toLocationId: testData.locations.W1,
            capacity: 300,
            minShipment: 50
          });
        
        expect(response.status).toBe(201);
        expect(Number(response.body.capacity)).toBe(300);
        testData.routes.RT1 = response.body.id;
      });

      it('should create P2 -> W2 route (RT2)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.P2,
            toLocationId: testData.locations.W2,
            capacity: 220,
            minShipment: 40
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT2 = response.body.id;
      });

      it('should create P1 -> W3 route (RT3)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.P1,
            toLocationId: testData.locations.W3,
            capacity: 180,
            minShipment: 30
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT3 = response.body.id;
      });
    });

    describe('Warehouse to Retailer Routes', () => {
      it('should create W1 -> R1 route (RT4)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W1,
            toLocationId: testData.locations.R1,
            capacity: 250,
            minShipment: 40
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT4 = response.body.id;
      });

      it('should create W1 -> R2 route (RT5)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W1,
            toLocationId: testData.locations.R2,
            capacity: 150,
            minShipment: 20
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT5 = response.body.id;
      });

      it('should create W2 -> R2 route (RT6)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W2,
            toLocationId: testData.locations.R2,
            capacity: 120,
            minShipment: 10
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT6 = response.body.id;
      });

      it('should create W3 -> R3 route (RT9)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W3,
            toLocationId: testData.locations.R3,
            capacity: 120,
            minShipment: 30
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT9 = response.body.id;
      });
    });

    describe('Warehouse to Hospital Routes', () => {
      it('should create W2 -> H1 route (RT7)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W2,
            toLocationId: testData.locations.H1,
            capacity: 80,
            minShipment: 25
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT7 = response.body.id;
      });

      it('should create W3 -> H1 route (RT8)', async () => {
        const response = await request(app)
          .post('/routes')
          .send({
            fromLocationId: testData.locations.W3,
            toLocationId: testData.locations.H1,
            capacity: 60,
            minShipment: 15
          });
        
        expect(response.status).toBe(201);
        testData.routes.RT8 = response.body.id;
      });
    });

    it('should reject PRODUCER -> RETAILER route', async () => {
      const response = await request(app)
        .post('/routes')
        .send({
          fromLocationId: testData.locations.P1,
          toLocationId: testData.locations.R1,
          capacity: 100,
          minShipment: 20
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject RETAILER -> WAREHOUSE route', async () => {
      const response = await request(app)
        .post('/routes')
        .send({
          fromLocationId: testData.locations.R1,
          toLocationId: testData.locations.W1,
          capacity: 100,
          minShipment: 20
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject if capacity <= 0', async () => {
      const response = await request(app)
        .post('/routes')
        .send({
          fromLocationId: testData.locations.P1,
          toLocationId: testData.locations.W1,
          capacity: 0,
          minShipment: 20
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject if minShipment < 0', async () => {
      const response = await request(app)
        .post('/routes')
        .send({
          fromLocationId: testData.locations.P1,
          toLocationId: testData.locations.W1,
          capacity: 100,
          minShipment: -5
        });
      
      expect(response.status).toBe(400);
    });
  });

  // ==================== DEMANDS ====================

  describe('Create Demands', () => {
    
    describe('Date: 2026-01-14 - Temperature compatible', () => {
      it('should create demand: R1 requests PR2 (Fresh Milk)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R1,
            productId: testData.products.PR2,
            date: '2026-01-14',
            minQuantity: 60,
            maxQuantity: 120
          });
        
        expect(response.status).toBe(201);
        expect(Number(response.body.min_quantity)).toBe(60);
        expect(Number(response.body.max_quantity)).toBe(120);
      });

      it('should create demand: H1 requests PR1 (Frozen Vaccine)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.H1,
            productId: testData.products.PR1,
            date: '2026-01-14',
            minQuantity: 40,
            maxQuantity: 50
          });
        
        expect(response.status).toBe(201);
      });
    });

    describe('Date: 2026-01-15 - Temperature incompatible', () => {
      it('should create demand: R2 requests PR3 (Ice Cream)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R2,
            productId: testData.products.PR3,
            date: '2026-01-15',
            minQuantity: 40,
            maxQuantity: 80
          });
        
        expect(response.status).toBe(201);
      });

      it('should create demand: R3 requests PR4 (Frozen Meat)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R3,
            productId: testData.products.PR4,
            date: '2026-01-15',
            minQuantity: 30,
            maxQuantity: 60
          });
        
        expect(response.status).toBe(201);
      });
    });

    describe('Date: 2026-01-16 - Network feasible', () => {
      it('should create demand: R1 requests PR2', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R1,
            productId: testData.products.PR2,
            date: '2026-01-16',
            minQuantity: 70,
            maxQuantity: 100
          });
        
        expect(response.status).toBe(201);
      });

      it('should create demand: R2 requests PR3', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R2,
            productId: testData.products.PR3,
            date: '2026-01-16',
            minQuantity: 50,
            maxQuantity: 90
          });
        
        expect(response.status).toBe(201);
      });

      it('should create demand: H1 requests PR1', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.H1,
            productId: testData.products.PR1,
            date: '2026-01-16',
            minQuantity: 30,
            maxQuantity: 50
          });
        
        expect(response.status).toBe(201);
      });
    });

    describe('Date: 2026-01-17 - Route MAX capacity violation', () => {
      it('should create demand: R1 requests PR2 (high quantity)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R1,
            productId: testData.products.PR2,
            date: '2026-01-17',
            minQuantity: 420,
            maxQuantity: 460
          });
        
        expect(response.status).toBe(201);
      });

      it('should create demand: R2 requests PR2 (high quantity)', async () => {
        const response = await request(app)
          .post('/demands')
          .send({
            locationId: testData.locations.R2,
            productId: testData.products.PR2,
            date: '2026-01-17',
            minQuantity: 250,
            maxQuantity: 340
          });
        
        expect(response.status).toBe(201);
      });
    });

    describe('Date: 2026-01-18 - Storage MAX capacity violation', () => {
      it('should create multiple demands exceeding storage capacity', async () => {
        const demands = [
          { locationId: testData.locations.R1, productId: testData.products.PR2, minQuantity: 270, maxQuantity: 320 },
          { locationId: testData.locations.R1, productId: testData.products.PR3, minQuantity: 350, maxQuantity: 420 },
          { locationId: testData.locations.R2, productId: testData.products.PR3, minQuantity: 330, maxQuantity: 390 },
          { locationId: testData.locations.R2, productId: testData.products.PR2, minQuantity: 420, maxQuantity: 460 }
        ];

        for (const demand of demands) {
          const response = await request(app)
            .post('/demands')
            .send({
              ...demand,
              date: '2026-01-18'
            });
          
          expect(response.status).toBe(201);
        }
      });
    });

    describe('Date: 2026-01-19 - Route MIN capacity violation', () => {
      it('should create demands below minimum shipment', async () => {
        const demands = [
          { locationId: testData.locations.R1, productId: testData.products.PR2, minQuantity: 70, maxQuantity: 100 },
          { locationId: testData.locations.R2, productId: testData.products.PR3, minQuantity: 50, maxQuantity: 90 },
          { locationId: testData.locations.H1, productId: testData.products.PR1, minQuantity: 5, maxQuantity: 10 }
        ];

        for (const demand of demands) {
          const response = await request(app)
            .post('/demands')
            .send({
              ...demand,
              date: '2026-01-19'
            });
          
          expect(response.status).toBe(201);
        }
      });
    });

    it('should reject if minQuantity > maxQuantity', async () => {
      const response = await request(app)
        .post('/demands')
        .send({
          locationId: testData.locations.R1,
          productId: testData.products.PR2,
          date: '2026-01-20',
          minQuantity: 100,
          maxQuantity: 50
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject if minQuantity < 0', async () => {
      const response = await request(app)
        .post('/demands')
        .send({
          locationId: testData.locations.R1,
          productId: testData.products.PR2,
          date: '2026-01-20',
          minQuantity: -10,
          maxQuantity: 50
        });
      
      expect(response.status).toBe(400);
    });
  });

});
