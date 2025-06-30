import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import router from './routes/products.routes.js';
import { register } from './config/metrics.js';
import { connectDB } from './config/mongoose.js';
import { connectRabbitMQ } from './lib/rabbitmq.js';
import { requestLogger } from './lib/loggerMiddleware.js';
import { metricsMiddleware } from './lib/metricsMiddleware.js';
import { consumeOrderCreated } from './services/productConsumer.js';

const app = express();
// Configuration des origines autorisées
const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://payetonkawa.fr'] : ['*'];
// Configuration de la limite de taux
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: 'Trop de requêtes. Réessaie plus tard.',
});

// Configuration de dotenv
dotenv.config();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(compression());
app.use(requestLogger);
app.use(metricsMiddleware);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Routes
app.use('/products', router);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT_PRODUCT = process.env.PORT_PRODUCT;

export async function startServer() {
  try {
    // On attend la connexion MongoDB et RabbitMQ
    await connectDB();
    await connectRabbitMQ();

    // Démarrer le consumer qui écoute
    await consumeOrderCreated();

    // On démarre ensuite le serveur
    app.listen(PORT_PRODUCT, () => {
      console.log(`✅ Evertything is OK, Products API running on port ${PORT_PRODUCT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
}
export default app;
