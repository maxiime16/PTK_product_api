import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion
export async function connectDB() {
  const MONGODB_PRODUCT_URI = process.env.MONGODB_PRODUCT_URI;
  try {
    if (!MONGODB_PRODUCT_URI) {
      throw new Error('MONGODB_URI_PRODUCT is not defined in the environment variables.');
    }
    await mongoose.connect(MONGODB_PRODUCT_URI, { 
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // Les options peuvent varier selon la version de mongoose
    });
    console.log('🟢 1/2 - Connected to MongoDB (products-db)');
  } catch (error) {
    console.error('❌ Failed to connect MongoDB', error);
    process.exit(1);
  }
}
