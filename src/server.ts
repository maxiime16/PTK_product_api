import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/mongoose";
import productsRouter from "./routes/products.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/products", productsRouter);

// Server start
const PORT = process.env.PORT || 3003;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Products API running on port ${PORT}`);
  });
});
