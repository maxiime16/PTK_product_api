import client from 'prom-client';

// Crée un registre global
export const register = new client.Registry();

// Ajoute des métriques par défaut (CPU, RAM, etc.)
client.collectDefaultMetrics({ register });

// Exemple : compteur HTTP par méthode
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
});

register.registerMetric(httpRequestCounter);
