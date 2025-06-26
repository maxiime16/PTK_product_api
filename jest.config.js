// jest.config.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // support des imports relatifs .js
  },
  transform: {}, // nécessaire pour éviter la transformation redondante
};