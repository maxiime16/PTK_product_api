import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Charge le .env

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/products_db";

// Configuration de la connexion
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // Les options peuvent varier selon la version de mongoose
    });
    console.log("✅ Connected to MongoDB (products-db)");
  } catch (error) {
    console.error("❌ Failed to connect MongoDB", error);
    process.exit(1);
  }
}


