import {
  findAllProducts,
  findProductById,
  createNewProduct,
  updateExistingProduct,
  removeProduct
} from '../../src/services/products.service.js';

import { Product } from '../../src/models/Product.js'

jest.mock('../../src/models/Product.js');

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call findAllProducts', async () => {
    const mockProducts = [{ id: '1', name: 'Alice' }];
    (Product.find as jest.Mock).mockResolvedValue(mockProducts);

    const result = await findAllProducts();

    expect(Product.find).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });

  it('should call findProductById', async () => {
    const mockProduct = { id: '1', name: 'Bob' };
    (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

    const result = await findProductById('1');

    expect(Product.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockProduct);
  });

  it('should call createNewProduct', async () => {
    const newProduct = { name: 'New Product' };
    const mockCreated = { id: '2', ...newProduct };
    (Product.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await createNewProduct(newProduct);

    expect(Product.create).toHaveBeenCalledWith(newProduct);
    expect(result).toEqual(mockCreated);
  });

  it('should call updateExistingProduct', async () => {
    const updateData = { name: 'Updated Product' };
    const mockUpdated = { id: '1', ...updateData };
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

    const result = await updateExistingProduct('1', updateData);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, {
      new: true,
      runValidators: true,
    });
    expect(result).toEqual(mockUpdated);
  });

  it('should call removeProduct', async () => {
    const mockDeleted = { id: '1', name: 'Deleted Product' };
    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

    const result = await removeProduct('1');

    expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockDeleted);
  });
});
