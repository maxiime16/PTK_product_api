import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../../src/lib/auth.js';

const app = express();

app.get('/test', authenticateToken, (req, res) => {
  const typedReq = req as AuthRequest;
  res.status(200).json({ user: typedReq.user });
});

describe('authenticateToken', () => {
  it('should return 401 if token is missing', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
  });

  it('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(403);
  });

  it('should call next if token is valid', async () => {
    const token = jwt.sign({ id: 123 }, process.env.JWT_SECRET!);
    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(123);
  });

  // ✅ Test pour couvrir la ligne 17 (absence de JWT_SECRET)
  it('should return 500 if JWT_SECRET is not defined', async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const token = jwt.sign({ id: 123 }, 'dummy');

    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('JWT secret not configured');

    process.env.JWT_SECRET = originalSecret; // Restaurer après le test
  });
});
