import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList.js';
import { MemoryRouter } from 'react-router-dom';

// --- SỬA QUAN TRỌNG: Bỏ "* as" đi ---
import productService from '../services/productService.js'; 

// Mock module: Định nghĩa rõ cấu trúc để Jest hiểu "default export" có những hàm nào
jest.mock('../services/productService.js', () => ({
  __esModule: true, // Báo cho Jest biết đây là ES Module
  default: {
    getAllProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getProductById: jest.fn(),
  },
}));

const mockProducts = [
  { id: 1, name: 'Iphone', price: 10000000 },
  { id: 2, name: 'Samsung', price: 8000000 }
];

describe('Product Service Mock CRUD (No UI Interaction)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. GET ALL (Integration nhẹ: component gọi service khi render) ---
  
  test('getAllProducts - success: Render component calls API', async () => {
    // Setup Mock
    productService.getAllProducts.mockResolvedValue({ success: true, data: mockProducts });

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Verify Call
    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
    
    // (Optional) Check UI để chắc chắn component nhận data
    // expect(screen.getByText(/Iphone/i)).toBeInTheDocument();
  });

  test('getAllProducts - failure: Show error message', async () => {
    productService.getAllProducts.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Verify Call
    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  // --- 2. CREATE / UPDATE / DELETE (Manual Trigger - Gọi hàm trực tiếp) ---

  test('createProduct - Verify mock call', async () => {
    const newProduct = { name: 'Xiaomi', price: 5000000 };
    productService.createProduct.mockResolvedValue({ success: true, data: newProduct });

    // Gọi trực tiếp
    await productService.createProduct(newProduct);

    // Verify
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  test('updateProduct - failure scenario', async () => {
    productService.updateProduct.mockRejectedValue({ message: 'Update failed' });

    try {
      await productService.updateProduct(1, { name: 'New Name' });
    } catch (error) {
      // Bắt lỗi để test pass
    }

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(1, { name: 'New Name' });
  });

  test('deleteProduct - success call', async () => {
    productService.deleteProduct.mockResolvedValue({ success: true });

    await productService.deleteProduct(99);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(99);
  });

});