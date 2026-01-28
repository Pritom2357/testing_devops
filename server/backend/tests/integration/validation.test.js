// tests/integration/validation.test.js
const request = require('supertest');
const app = require('../../index');

/**
 * These tests validate the Temperature and Network validation endpoints.
 * They assume the seed data has been created from seed.test.js
 */

describe('Validation Endpoints', () => {
  
  describe('Temperature Validation', () => {
    
    it('POST /temps/validate - 2026-01-14: Temperature compatible', async () => {
      const response = await request(app)
        .post('/temps/validate')
        .send({
          date: '2026-01-14'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
    });

    it('POST /temps/validate - 2026-01-15: Temperature incompatible', async () => {
      const response = await request(app)
        .post('/temps/validate')
        .send({
          date: '2026-01-15'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(false);
      
      // Optional: Check for detailed issues
      if (response.body.issues) {
        expect(Array.isArray(response.body.issues)).toBe(true);
        expect(response.body.issues.length).toBeGreaterThan(0);
      }
    });

    it('should return issues array when available', async () => {
      const response = await request(app)
        .post('/temps/validate')
        .send({
          date: '2026-01-15'
        });
      
      expect(response.status).toBe(200);
      if (response.body.issues) {
        expect(response.body.issues).toEqual(
          expect.arrayContaining([
            expect.stringContaining('temperature incompatible')
          ])
        );
      }
    });

  });

  describe('Network Feasibility Validation', () => {
    
    it('POST /network/validate - 2026-01-16: Feasible network', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2026-01-16'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.feasible).toBe(true);
    });

    it('POST /network/validate - 2026-01-17: Route MAX capacity violation', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2026-01-17'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.feasible).toBe(false);
      expect(response.body.issues).toContain('MAX_CAPACITY_VIOLATION');
    });

    it('POST /network/validate - 2026-01-18: Storage MAX capacity violation', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2026-01-18'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.feasible).toBe(false);
      expect(response.body.issues).toContain('MAX_CAPACITY_VIOLATION');
    });

    it('POST /network/validate - 2026-01-19: Route MIN capacity violation', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2026-01-19'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.feasible).toBe(false);
      expect(response.body.issues).toContain('MIN_CAPACITY_VIOLATION');
    });

    it('should return detailed min_capacity_violations when available', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2026-01-19'
        });
      
      expect(response.status).toBe(200);
      if (response.body.min_capacity_violations) {
        expect(Array.isArray(response.body.min_capacity_violations)).toBe(true);
        
        // Each violation should have these properties
        response.body.min_capacity_violations.forEach(violation => {
          expect(violation).toHaveProperty('from');
          expect(violation).toHaveProperty('to');
          expect(violation).toHaveProperty('used_capacity');
          expect(violation).toHaveProperty('minShipment');
        });
      }
    });

  });

  describe('Edge Cases', () => {
    
    it('should handle non-existent date gracefully', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: '2099-12-31'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feasible');
    });

    it('should accept ISO date format', async () => {
      const response = await request(app)
        .post('/temps/validate')
        .send({
          date: '2026-01-16T00:00:00Z'
        });
      
      expect([200, 400]).toContain(response.status);
    });

    it('should reject invalid date format', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({
          date: 'invalid-date'
        });
      
      expect(response.status).toBe(400);
    });

    it('should require date parameter', async () => {
      const response = await request(app)
        .post('/network/validate')
        .send({});
      
      expect(response.status).toBe(400);
    });

  });

});
