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

  //'2. CREATE / UPDATE / DELETE (Manual Trigger)

  // --- 1. CREATE PRODUCT ---

  test('Create product success - Kiểm tra việc tạo sản phẩm mới thành công', async () => {
    // Arrange: Chuẩn bị dữ liệu và mock trả về thành công
    const newProduct = { name: 'Samsung Galaxy S24', price: 20000000 };
    const mockResponse = { success: true, data: { id: 1, ...newProduct } };
    
    productService.createProduct.mockResolvedValue(mockResponse);

    // Act: Gọi hàm
    const result = await productService.createProduct(newProduct);

    // Assert: Kiểm tra kết quả và việc gọi hàm
    expect(result).toEqual(mockResponse); // Kiểm tra dữ liệu trả về đúng
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  test('Create product failure - Kiểm tra việc tạo sản phẩm mới thất bại', async () => {
    // Arrange: Chuẩn bị dữ liệu và mock trả về lỗi (reject)
    const newProduct = { name: 'Invalid Product' };
    const errorMessage = 'Network Error';
    
    productService.createProduct.mockRejectedValue(new Error(errorMessage));

    // Act & Assert: Kiểm tra xem hàm có ném ra lỗi như mong đợi không
    await expect(productService.createProduct(newProduct)).rejects.toThrow(errorMessage);
    
    // Kiểm tra hàm vẫn được gọi dù lỗi
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  // --- 2. UPDATE PRODUCT ---

  test('Update product success - Kiểm tra việc cập nhật sản phẩm thành công', async () => {
    // Arrange
    const productId = 1;
    const updateData = { price: 18000000 };
    const mockResponse = { success: true, message: 'Updated successfully' };

    productService.updateProduct.mockResolvedValue(mockResponse);

    // Act
    const result = await productService.updateProduct(productId, updateData);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(productId, updateData);
  });

  test('Update product failure - Kiểm tra việc cập nhật sản phẩm thất bại', async () => {
    // Arrange
    const productId = 99; // ID không tồn tại
    const updateData = { name: 'Ghost Product' };
    const errorObj = { message: 'Product not found' };

    productService.updateProduct.mockRejectedValue(errorObj);

    // Act & Assert: Sử dụng rejects.toEqual nếu lỗi trả về là object, toThrow nếu là Error instance
    await expect(productService.updateProduct(productId, updateData)).rejects.toEqual(errorObj);

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(productId, updateData);
  });

  // --- 3. DELETE PRODUCT ---

  test('Delete product success - Kiểm tra việc xóa sản phẩm thành công', async () => {
    // Arrange
    const productId = 5;
    const mockResponse = { success: true };

    productService.deleteProduct.mockResolvedValue(mockResponse);

    // Act
    const result = await productService.deleteProduct(productId);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
  });
  test('Delete product failure - Kiểm tra việc xóa sản phẩm thất bại', async () => {
    // Arrange: Giả lập lỗi (ví dụ: lỗi mạng hoặc ID không tồn tại)
    const productId = 9999;
    const errorMessage = 'Delete failed: Product not found';
    
    // Mock trả về một Error (hoặc object lỗi tùy implementation của bạn)
    productService.deleteProduct.mockRejectedValue(new Error(errorMessage));

    // Act & Assert: Kiểm tra hàm ném ra lỗi đúng như mong đợi
    await expect(productService.deleteProduct(productId)).rejects.toThrow(errorMessage);

    // Verify: Đảm bảo hàm vẫn được gọi đúng tham số
    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
  });
});