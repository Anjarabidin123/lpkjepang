// Main export for localStorage utilities

export * from './core';
export * from './auth';
export * from './tables';
export * from './seedData';

import { initializeDefaultAdmin } from './auth';
import { seedDefaultData } from './seedData';

// Initialize localStorage on app start
export function initializeLocalStorage() {
  console.log('Initializing localStorage database...');
  initializeDefaultAdmin();
  seedDefaultData();
  console.log('localStorage database initialized');
}
