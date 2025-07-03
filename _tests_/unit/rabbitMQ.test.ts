/* eslint-disable no-undef */
import * as amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

import { connectRabbitMQ } from '../../src/lib/rabbitmq.js';

jest.mock('amqplib');

const mockedAmqplib = amqplib as jest.Mocked<typeof amqplib>;

describe('connectRabbitMQ', () => {
  const OLD_ENV = process.env;
  let mockConnection: any;
  let mockChannel: any;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };

    mockChannel = {}; // Fake channel
    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    mockedAmqplib.connect.mockResolvedValue(mockConnection);

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it('devrait se connecter à RabbitMQ si URI définie', async () => {
    process.env.RabbitMQ_URI = 'amqp://localhost';

    await connectRabbitMQ();

    expect(mockedAmqplib.connect).toHaveBeenCalledWith('amqp://mspr:mspr@localhost:5672');
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🟢 2/2 - Connected to RabbitMQ');
  });

it('doit lancer une erreur si URI manquante (pas de process.exit)', async () => {
  delete process.env.RabbitMQ_URI;

  await expect(connectRabbitMQ()).rejects.toThrow(
    'RabbitMQ_URI is not defined in the environment variables.',
  );

  expect(mockedAmqplib.connect).not.toHaveBeenCalled();
});


  it('doit gérer erreur de connexion et appeler process.exit', async () => {
    process.env.RabbitMQ_URI = 'amqp://localhost';
    mockedAmqplib.connect.mockRejectedValue(new Error('Connection failed'));

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit: ${code}`);
    }) as any);

    await expect(connectRabbitMQ()).rejects.toThrow('process.exit: 1');
    expect(console.error).toHaveBeenCalledWith(
      '❌ Failed to connect to RabbitMQ',
      expect.any(Error),
    );

    exitSpy.mockRestore();
  });

  it('getChannel doit lancer une erreur si channel non initialisé', () => {
    // Reset le module pour s'assurer que channel est null
    jest.resetModules();
    const { getChannel } = require('../../src/lib/rabbitmq.js');

    expect(() => getChannel()).toThrow(
      'RabbitMQ channel not initialized. Call connectRabbitMQ first.',
    );
  });
});
