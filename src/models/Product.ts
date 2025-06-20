import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt automatiquement
  },
);

export const Product = model('Product', productSchema);
