export default {
  preset: 'ts-jest/presets/default-esm', // obligatoire pour ESM
  testEnvironment: "node",
  testMatch: ["**/__tests__/integration/**/*.test.[jt]s?(x)"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // pour mapper les imports .js en .ts
  },
  collectCoverage: false,
  transform: {},
};
