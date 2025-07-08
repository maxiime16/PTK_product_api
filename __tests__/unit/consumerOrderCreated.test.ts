import { consumeOrderCreated } from '../../src/services/productConsumer.js';
import { Product } from '../../src/models/Product.js';
import { getChannel } from '../../src/lib/rabbitmq.js';
import jwt from 'jsonwebtoken';

jest.mock('../../src/models/Product');
jest.mock('../../src/lib/rabbitmq');
jest.mock('jsonwebtoken');

const fakeChannel = {
  assertExchange: jest.fn(),
  assertQueue: jest.fn(),
  bindQueue: jest.fn(),
  consume: jest.fn(),
  ack: jest.fn(),
  nack: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (getChannel as jest.Mock).mockReturnValue(fakeChannel);
  process.env.SERVICE_SECRET = 'test-secret';
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('consumeOrderCreated', () => {
  it('devrait traiter un message avec un token valide et décrémenter le stock', async () => {
    const fakeProduct = {
      stock: 10,
      save: jest.fn(),
    };

    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'fake-token',
        data: { items: [{ productId: '123', quantity: 2 }] },
      })),
    };

    (Product.findById as jest.Mock).mockResolvedValue(fakeProduct);
    (jwt.verify as jest.Mock).mockReturnValue({ service: 'orders-api' });

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, callback) => {
      callback(fakeMsg);
    });

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.ack).toHaveBeenCalledWith(fakeMsg);
    expect(fakeProduct.stock).toBe(8);
    expect(fakeProduct.save).toHaveBeenCalled();
  });

  it('rejette le message sans token', async () => {
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        data: { items: [{ productId: '123', quantity: 1 }] },
      })),
    };

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, callback) => {
      callback(fakeMsg);
    });

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.nack).toHaveBeenCalledWith(fakeMsg, false, false);
  });

  it('rejette le message avec un token invalide', async () => {
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'invalid-token',
        data: { items: [{ productId: '123', quantity: 1 }] },
      })),
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, callback) => {
      callback(fakeMsg);
    });

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.nack).toHaveBeenCalledWith(fakeMsg, false, false);
  });

  it('rejette le message si le token ne vient pas du bon service', async () => {
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'wrong-service-token',
        data: { items: [{ productId: '123', quantity: 1 }] },
      })),
    };

    (jwt.verify as jest.Mock).mockReturnValue({ service: 'unknown-service' });

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, cb) => cb(fakeMsg));

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.nack).toHaveBeenCalledWith(fakeMsg, false, false);
  });

  it("ne traite pas le message si 'items' n'est pas un tableau", async () => {
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'valid-token',
        data: { items: null },
      })),
    };

    (jwt.verify as jest.Mock).mockReturnValue({ service: 'orders-api' });

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, cb) => cb(fakeMsg));

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.ack).toHaveBeenCalledWith(fakeMsg); // message valide, aucun item à traiter
  });

  it("ignore un message avec un champ 'data' sans 'items'", async () => {
    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'valid-token',
        data: {},
      })),
    };

    (jwt.verify as jest.Mock).mockReturnValue({ service: 'orders-api' });

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, cb) => cb(fakeMsg));

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.ack).toHaveBeenCalledWith(fakeMsg); // pas d'erreur, mais rien à traiter
  });

  it('rejette un message non JSON (JSON.parse échoue)', async () => {
    const fakeMsg = {
      content: Buffer.from('not a json'),
    };

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, cb) => cb(fakeMsg));

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.nack).toHaveBeenCalledWith(fakeMsg, false, false);
  });

  it("rejette le message si SERVICE_SECRET n'est pas défini", async () => {
    delete process.env.SERVICE_SECRET;

    const fakeMsg = {
      content: Buffer.from(JSON.stringify({
        token: 'any-token',
        data: { items: [{ productId: '123', quantity: 1 }] },
      })),
    };

    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, cb) => cb(fakeMsg));

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.nack).toHaveBeenCalledWith(fakeMsg, false, false);
  });

  // ✅ Nouveau test pour couvrir la ligne 19
  it('ignore les messages null (ligne 19)', async () => {
    (fakeChannel.consume as jest.Mock).mockImplementation((_queue, callback) => {
      callback(null); // msg = null → couvre ligne 19
    });

    await consumeOrderCreated();
    await new Promise((resolve) => setImmediate(resolve));

    expect(fakeChannel.ack).not.toHaveBeenCalled();
    expect(fakeChannel.nack).not.toHaveBeenCalled();
  });
});
