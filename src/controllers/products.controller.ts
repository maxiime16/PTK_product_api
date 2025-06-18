import { Request, Response } from 'express';
import {
  findAllProducts,
  findProductById,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from '../services/products.service.js';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await findAllProducts();
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await findProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const newProduct = await createNewProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await updateExistingProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await removeProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    return res.json({ message: 'Produit supprimé avec succès' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
