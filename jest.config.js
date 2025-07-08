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
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",        // ✅ Inclut tous les fichiers source
    "!src/config/**",                 // ⛔ Ignore tout le dossier config
    "!src/lib/rabbitmq.ts",          // ⛔ Ignore la connexion RabbitMQ
    "!src/server.ts",                // ⛔ Fichier d'initialisation
    "!src/start.ts",                 // ⛔ Fichier de démarrage
    "!src/lib/loggerMiddleware.ts",  // ⛔ Middleware sans logique métier
    "!src/lib/metricsMiddleware.ts"  // ⛔ Pareil
  ]
};
