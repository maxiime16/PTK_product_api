import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/mongoose.js';
import { connectRabbitMQ } from './lib/rabbitmq.js';
<<<<<<< Updated upstream
import productsRouter from './routes/products.routes.js';
import { consumeOrderCreated } from './services/productConsumer.js';
=======
import { requestLogger } from './lib/loggerMiddleware.js';
import { metricsMiddleware } from './lib/metricsMiddleware.js';
>>>>>>> Stashed changes

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use('/products', productsRouter);

const PORT_PRODUCT = process.env.PORT_PRODUCT;

async function startServer() {
  try {
    // 1) Connecter la DB et RabbitMQ
    await connectDB();
    await connectRabbitMQ();

    // 3) Lancer le consumer "order.created"
    await consumeOrderCreated();

    // 4) Lancer le serveur HTTP
    app.listen(PORT_PRODUCT, () => {
      console.log(`✅ Products API running on port ${PORT_PRODUCT}`);
    });
  } catch (error) {
    console.error('❌ Error starting Products API:', error);
    process.exit(1);
  }
}
<<<<<<< Updated upstream

startServer();
=======
export default app;
>>>>>>> Stashed changes
