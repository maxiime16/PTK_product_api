import {
  findAllProducts,
  findProductById,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from '../../src/services/products.service.js';

import { Product } from '../../src/models/Product.js';

jest.mock('../../src/models/Product');

describe('Product Service', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 100,
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('findAllProducts() should return all products', async () => {
    (Product.find as jest.Mock).mockResolvedValue([mockProduct]);

    const result = await findAllProducts();
    expect(Product.find).toHaveBeenCalled();
    expect(result).toEqual([mockProduct]);
  });

  test('findProductById() should return a product by ID', async () => {
    (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

    const result = await findProductById('1');
    expect(Product.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockProduct);
  });

  test('createNewProduct() should create a new product', async () => {
    (Product.create as jest.Mock).mockResolvedValue(mockProduct);

    const newData = { name: 'Test Product', price: 100, stock: 50 };
    const result = await createNewProduct(newData);
    expect(Product.create).toHaveBeenCalledWith(newData);
    expect(result).toEqual(mockProduct);
  });

  test('updateExistingProduct() should update a product', async () => {
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);

    const updatedData = { name: 'Updated Product' };
    const result = await updateExistingProduct('1', updatedData);
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', updatedData, {
      new: true,
      runValidators: true,
    });
    expect(result).toEqual(mockProduct);
  });

  test('removeProduct() should delete a product', async () => {
    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);

    const result = await removeProduct('1');
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockProduct);
  });
});
