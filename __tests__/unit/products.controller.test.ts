import { Request, Response } from 'express';
import * as productService from '../../src/services/products.service.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../src/controllers/products.controller.js';

describe('Products Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    req = {
      params: {},
      body: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('getAllProducts', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: 'Product 1',
          price: 10,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '2',
          name: 'Product 2',
          price: 20,
          stock: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(productService, 'findAllProducts').mockResolvedValue(mockProducts as any);

      await getAllProducts(req as Request, res as Response);

      expect(productService.findAllProducts).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockProducts);
    });

    it('should return 500 if service throws an error', async () => {
      jest.spyOn(productService, 'findAllProducts').mockRejectedValue(new Error('Erreur serveur'));
      await getAllProducts(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    });
  });

  describe('getProductById', () => {
    it('should return product by id with status 200', async () => {
      const mockProduct = {
        _id: '1',
        name: 'Product 1',
        price: 10,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req.params = { id: '1' };

      jest.spyOn(productService, 'findProductById').mockResolvedValue(mockProduct as any);

      await getProductById(req as Request, res as Response);

      expect(productService.findProductById).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if Produit introuvable', async () => {
      req.params = { id: '1' };
      jest.spyOn(productService, 'findProductById').mockResolvedValue(null);

      await getProductById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Produit introuvable' });
    });

    it('should return 500 if service throws an error', async () => {
      req.params = { id: '1' };
      jest.spyOn(productService, 'findProductById').mockRejectedValue(new Error('Erreur serveur'));
      await getProductById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    });
  });

  describe('createProduct', () => {
    it('should create product and return it with status 201', async () => {
      const productData = {
        name: 'New Product',
        price: 15,
        stock: 7,
      };

      const createdProduct = {
        _id: '3',
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req.body = productData;

      jest.spyOn(productService, 'createNewProduct').mockResolvedValue(createdProduct as any);

      await createProduct(req as Request, res as Response);

      expect(productService.createNewProduct).toHaveBeenCalledWith(productData);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdProduct);
    });

    it('should return 400 if service throws an error', async () => {
      jest.spyOn(productService, 'createNewProduct').mockRejectedValue(new Error('Erreur validation'));
      await createProduct(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erreur validation' });
    });
  });

  describe('updateProduct', () => {
    it('should update product and return updated product with status 200', async () => {
      const productId = '1';
      const updateData = {
        name: 'Updated Product',
        price: 30,
      };

      const updatedProduct = {
        _id: productId,
        ...updateData,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req.params = { id: productId };
      req.body = updateData;

      jest.spyOn(productService, 'updateExistingProduct').mockResolvedValue(updatedProduct as any);

      await updateProduct(req as Request, res as Response);

      expect(productService.updateExistingProduct).toHaveBeenCalledWith(productId, updateData);
      expect(jsonMock).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return 404 if product to update not found', async () => {
      req.params = { id: '1' };
      req.body = { name: 'No Product' };

      jest.spyOn(productService, 'updateExistingProduct').mockResolvedValue(null);

      await updateProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Produit introuvable' });
    });

    it('should return 400 if service throws an error', async () => {
      req.params = { id: '1' };
      jest.spyOn(productService, 'updateExistingProduct').mockRejectedValue(new Error('Erreur validation'));
      await updateProduct(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erreur validation' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product and return 200 with success message', async () => {
      req.params = { id: '1' };

      const mockDeletedProduct = {
        _id: '1',
        name: 'Deleted Product',
        price: 20,
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(productService, 'removeProduct').mockResolvedValue(mockDeletedProduct as any);

      await deleteProduct(req as Request, res as Response);

      expect(productService.removeProduct).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Produit supprimé avec succès' });
    });

    it('should return 404 if product to delete not found', async () => {
      req.params = { id: '1' };

      jest.spyOn(productService, 'removeProduct').mockResolvedValue(null);

      await deleteProduct(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Produit introuvable' });
    });

    it('should return 500 if service throws an error', async () => {
      req.params = { id: '1' };
      jest.spyOn(productService, 'removeProduct').mockRejectedValue(new Error('Erreur serveur'));
      await deleteProduct(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    });
  });
});
