/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { connectDB } from '../../src/config/mongoose.js';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

const mockedMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe('connectDB', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    mockedMongoose.connect.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(((code?: number | string | null) => {
      throw new Error(`process.exit: ${code}`);
    }) as any);
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it("devrait se connecter avec l'URI", async () => {
    process.env.MONGODB_PRODUCT_URI =
      'mongodb://mspr:mspr@localhost:27017/products_db?authSource=admin';

    await connectDB();

    expect(mockedMongoose.connect).toHaveBeenCalledWith(
      'mongodb://mspr:mspr@localhost:27017/products_db?authSource=admin',
      expect.any(Object),
    );
    expect(console.log).toHaveBeenCalledWith('🟢 1/2 - Connected to MongoDB (products-db)');
  });

it('doit appeler process.exit si URI manquante', async () => {
  delete process.env.MONGODB_PRODUCT_URI;

  const exitSpy = jest
    .spyOn(process, 'exit')
    .mockImplementation(((code?: number | string | null) => {
      throw new Error(`process.exit: ${code}`);
    }) as any);

  try {
    await connectDB();
    // Si on atteint ici, c’est une erreur
    throw new Error('connectDB() ne devrait pas se résoudre');
  } catch (err: any) {
    expect(err.message).toBe('process.exit: 1');
  }

  expect(mockedMongoose.connect).not.toHaveBeenCalled();
  exitSpy.mockRestore();
});



  it('doit gérer erreur de connexion et appeler process.exit', async () => {
    process.env.MONGODB_PRODUCT_URI =
      'mongodb://mspr:mspr@localhost:27017/products_db?authSource=admin';
    mockedMongoose.connect.mockRejectedValue(new Error('Connection failed'));

    await expect(connectDB()).rejects.toThrow('process.exit: 1');
    expect(console.error).toHaveBeenCalledWith('❌ Failed to connect MongoDB', expect.any(Error));
  });
});
