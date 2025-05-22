import { Product } from '../models/Product';

export async function findAllProducts() {
  return Product.find();
}

export async function findProductById(id: string) {
  return Product.findById(id);
}

export async function createNewProduct(data: any) {
  return Product.create(data);
}

export async function updateExistingProduct(id: string, data: any) {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function removeProduct(id: string) {
  return Product.findByIdAndDelete(id);
}
