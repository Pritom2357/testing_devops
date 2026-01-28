// tests/fixtures/testData.js
// This file maintains the UUID mappings for seed data

const testData = {
  locations: {
    // Producers
    P1: null, // Farm Alpha - will be populated after creation
    P2: null, // Vaccine Factory Beta
    // Warehouses
    W1: null, // Central Cold Warehouse
    W2: null, // North Storage Hub
    W3: null, // South Distribution Hub
    // Retailers
    R1: null, // FreshMart Uttara
    R2: null, // FreshMart Dhanmondi
    R3: null, // FreshMart Khulna
    // Hospital
    H1: null  // City General Hospital
  },
  
  products: {
    PR1: null, // Frozen Vaccine
    PR2: null, // Fresh Milk
    PR3: null, // Ice Cream
    PR4: null  // Frozen Meat
  },
  
  storageUnits: {
    SU1: null, // Central Cold Warehouse - Frozen
    SU2: null, // Central Cold Warehouse - Fresh
    SU3: null, // North Storage Hub - Frozen
    SU4: null, // North Storage Hub - Fresh
    SU5: null  // South Distribution Hub - Fresh
  },
  
  routes: {
    RT1: null, // P1 -> W1
    RT2: null, // P2 -> W2
    RT3: null, // P1 -> W3
    RT4: null, // W1 -> R1
    RT5: null, // W1 -> R2
    RT6: null, // W2 -> R2
    RT7: null, // W2 -> H1
    RT8: null, // W3 -> H1
    RT9: null  // W3 -> R3
  }
};

module.exports = testData;
