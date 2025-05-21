import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/mongoose";
import { connectRabbitMQ } from "./lib/rabbitmq";
import productsRouter from "./routes/products.routes";
import { consumeOrderCreated } from "./services/productConsumer";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/products", productsRouter);

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
    console.error("❌ Error starting Products API:", error);
    process.exit(1);
  }
}

startServer();
