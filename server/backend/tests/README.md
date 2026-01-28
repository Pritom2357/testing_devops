// tests/README.md

# Test Suite Documentation

## Overview

This test suite covers the Frostbite Warehouse cold chain logistics system. Tests are organized into:

- **Integration Tests** - Full API endpoint testing with actual database operations
- **Fixtures** - Shared test data and UUID mappings

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Integration Tests Only
```bash
npm run test:integration
```

### Seed Data Tests
```bash
npm run test:seed
```

### Validation Tests
```bash
npm run test:validation
```

---

## Test Structure

### Seed Tests (`tests/integration/seed.test.js`)

Tests the creation of all entities and constraint validation:

#### Locations (9 tests)
- ✅ Create 2 Producers
- ✅ Create 3 Warehouses
- ✅ Create 3 Retailers
- ✅ Create 1 Hospital
- ✅ Reject invalid location type

#### Products (5 tests)
- ✅ Create 4 products with different temperature ranges
- ✅ Reject invalid temperature constraints (min > max)

#### Storage Units (11 tests)
- ✅ Create 5 storage units across 3 warehouses
- ✅ Reject storage unit at non-warehouse locations (trigger validation)
- ✅ Reject invalid capacity (must be > 0)
- ✅ Reject invalid temperature ranges (min > max)

#### Routes (18 tests)
- ✅ Create 3 Producer → Warehouse routes
- ✅ Create 4 Warehouse → Retailer routes
- ✅ Create 2 Warehouse → Hospital routes
- ✅ Reject invalid route types (PRODUCER → RETAILER)
- ✅ Reject invalid capacities and shipment constraints

#### Demands (24 tests)
- ✅ Create demands for 7 different dates
- ✅ Test temperature compatibility scenarios
- ✅ Test network feasibility scenarios
- ✅ Test capacity violation scenarios (max and min)
- ✅ Reject invalid quantity constraints

### Validation Tests (`tests/integration/validation.test.js`)

Tests the validation endpoints for temperature and network feasibility:

#### Temperature Validation (3 tests)
- ✅ Date 2026-01-14: All products compatible with storage units → `valid: true`
- ✅ Date 2026-01-15: Frozen Meat cannot be stored at W3 → `valid: false`
- ✅ Returns detailed issues when available

#### Network Validation (6 tests)
- ✅ Date 2026-01-16: All demands are network feasible → `feasible: true`
- ✅ Date 2026-01-17: Route max capacity exceeded at W1 → `feasible: false`
- ✅ Date 2026-01-18: Storage max capacity exceeded → `feasible: false`
- ✅ Date 2026-01-19: Route min shipment violated at H1 → `feasible: false`
- ✅ Returns detailed violation information when available

#### Edge Cases (3 tests)
- ✅ Non-existent dates handled gracefully
- ✅ Invalid date formats rejected

---

## Test Data Flow

The test suite uses symbolic UUIDs that are populated during test execution:

### Locations
| Symbol | Name | Type |
|--------|------|------|
| P1 | Farm Alpha | PRODUCER |
| P2 | Vaccine Factory Beta | PRODUCER |
| W1 | Central Cold Warehouse | WAREHOUSE |
| W2 | North Storage Hub | WAREHOUSE |
| W3 | South Distribution Hub | WAREHOUSE |
| R1 | FreshMart Uttara | RETAILER |
| R2 | FreshMart Dhanmondi | RETAILER |
| R3 | FreshMart Khulna | RETAILER |
| H1 | City General Hospital | HOSPITAL |

### Products
| Symbol | Name | Temp Range |
|--------|------|-----------|
| PR1 | Frozen Vaccine | -20 to -10 |
| PR2 | Fresh Milk | 2 to 6 |
| PR3 | Ice Cream | -18 to -5 |
| PR4 | Frozen Meat | -20 to -5 |

### Storage Units
| Symbol | Location | Temp Range | Capacity |
|--------|----------|-----------|----------|
| SU1 | W1 | -25 to -5 | 500 |
| SU2 | W1 | 0 to 10 | 300 |
| SU3 | W2 | -22 to -6 | 250 |
| SU4 | W2 | 1 to 8 | 200 |
| SU5 | W3 | 1 to 8 | 250 |

### Routes
| Symbol | From | To | Capacity | Min |
|--------|------|----|---------|----|
| RT1 | P1 | W1 | 300 | 50 |
| RT2 | P2 | W2 | 220 | 40 |
| RT3 | P1 | W3 | 180 | 30 |
| RT4 | W1 | R1 | 250 | 40 |
| RT5 | W1 | R2 | 150 | 20 |
| RT6 | W2 | R2 | 120 | 10 |
| RT7 | W2 | H1 | 80 | 25 |
| RT8 | W3 | H1 | 60 | 15 |
| RT9 | W3 | R3 | 120 | 30 |

---

## Test Scenarios

### 1. Temperature Feasibility (2026-01-15)
**Issue:** R3 (FreshMart Khulna) requests PR4 (Frozen Meat: -20 to -5).
- R3 can only be supplied via W3
- W3 only has fresh storage (-1 to 8)
- **Result:** INVALID ❌

### 2. Route Capacity Violation (2026-01-17)
**Issue:** Demands exceed outbound capacity of W1
- R1 requests: 420-460 units of PR2
- R2 requests: 250-340 units of PR2
- W1 capacity: RT4 (250) + RT5 (150) = 400 total
- **Result:** INFEASIBLE ❌

### 3. Storage Capacity Violation (2026-01-18)
**Issue:** Multiple demands exceed total frozen storage
- W1 frozen (SU1): 500
- W2 frozen (SU3): 250
- Total: 750
- Combined PR2 + PR3 demands: > 750
- **Result:** INFEASIBLE ❌

### 4. Minimum Shipment Violation (2026-01-19)
**Issue:** Hospital demand below minimum shipment requirements
- H1 requests PR1: 5-10 units
- RT7 minShipment: 25
- RT8 minShipment: 15
- **Result:** INFEASIBLE ❌

---

## Environment Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Port 8000 available for test server

### Database Setup
```bash
# In database/ directory
psql -U postgres -d frostbite_warehouse -f init.sql
```

### Install Dependencies
```bash
npm install
```

---

## Configuration

Tests expect the following environment variables (or defaults):
- `DB_HOST` - Default: localhost
- `DB_PORT` - Default: 5432
- `DB_NAME` - Default: frostbite_warehouse
- `DB_USER` - Default: postgres
- `DB_PASSWORD` - Default: (empty)
- `SERVER_PORT` - Default: 8000

---

## Troubleshooting

### Tests fail with "Cannot find module"
```bash
npm install
```

### Database connection errors
- Ensure PostgreSQL is running
- Check `src/config/db.js` connection settings
- Verify database exists: `createdb frostbite_warehouse`

### Tests timeout
- Increase Jest timeout: `jest.config.js` → `testTimeout: 20000`
- Check database performance

---

## Coverage Goals

- **Statements:** 70%+
- **Branches:** 70%+
- **Functions:** 70%+
- **Lines:** 70%+

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## Next Steps

1. Run seed tests: `npm run test:seed`
2. Verify all locations, products, routes created
3. Run validation tests: `npm run test:validation`
4. Check validation endpoint responses
5. Review coverage: `npm run test:coverage`
