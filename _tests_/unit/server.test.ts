import request from 'supertest';
import app from '../../src/server.js'; // Assure-toi que ce chemin est correct
import { register } from '../../src/config/metrics.js';

// Mock des dépendances pour éviter les connexions réelles
jest.mock('../../src/config/mongoose.js', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/lib/rabbitmq.js', () => ({
  connectRabbitMQ: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/services/productConsumer.js', () => ({
  consumeOrderCreated: jest.fn().mockResolvedValue(undefined),
}));

describe('App Initialization', () => {
  it('should respond to GET /metrics with metrics data', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe(register.contentType);
  });

  it('should respond 404 on unknown route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
  });

  it('should have security-related headers via helmet', async () => {
    const res = await request(app).get('/metrics');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    expect(res.headers).toHaveProperty('x-content-type-options');
  });

  it('should limit requests (rate limiting)', async () => {
    for (let i = 0; i < 101; i++) {
      await request(app).get('/metrics');
    }
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(429);
    expect(res.text).toMatch(/Trop de requêtes/);
  });
});
