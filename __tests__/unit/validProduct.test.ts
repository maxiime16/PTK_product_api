import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { validateProduct } from '../../src/lib/validateProduct.js'; // ajuste le chemin

const app = express();
app.use(bodyParser.json());

app.post('/products', validateProduct, (req, res) => {
  res.status(200).json({ message: 'Valid product' });
});
describe('validateProduct middleware', () => {
  it('should return 400 if product data is invalid', async () => {
    const invalidProduct = {
      name: '', // invalide : min(1)
      price: -10, // invalide : non négatif
    };

    const res = await request(app)
      .post('/products')
      .send(invalidProduct);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should call next if product data is valid', async () => {
    const validProduct = {
      name: 'Test Product',
      price: 100,
      stock: 5,
      category: 'Books',
    };

    const res = await request(app)
      .post('/products')
      .send(validProduct);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Valid product');
  });
});

