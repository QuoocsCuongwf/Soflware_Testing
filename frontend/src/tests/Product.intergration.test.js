import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ProductForm from '../components/ProductForm.js';
import ProductList from '../components/ProductList.js';
import ProductDetail from '../components/ProductDetail.js';
import productService from '../services/productService.js';
import authService from '../services/authService.js';

// Mock services
jest.mock('../services/productService.js');
jest.mock('../services/authService.js');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const mockProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'Flagship smartphone 2024',
    price: 999,
    quantity: 5,
    category: 'Phone',
    imageUrl: 'https://example.com/iphone.jpg',
    isAvailable: true,
    createdBy: 1,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    name: 'Galaxy S24 Ultra',
    description: 'Samsung flagship',
    price: 1199,
    quantity: 8,
    category: 'Phone',
    imageUrl: '',
    isAvailable: true,
    createdBy: 1,
    createdAt: '2024-01-02T00:00:00',
    updatedAt: '2024-01-02T00:00:00'
  }
];

describe('Product integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock authService
    authService.getCurrentUser.mockReturnValue({ username: 'testuser', id: 1 });
    authService.getToken.mockReturnValue('fake-token');
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify({ username: 'testuser' })),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  });

  test('ProductForm hiển thị và validate cục bộ', async () => {
    render(
      <MemoryRouter>
        <ProductForm onClose={jest.fn()} />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Tên sản phẩm/i);
    const priceInput = screen.getByLabelText(/Giá/i);
    const quantityInput = screen.getByLabelText(/Số lượng/i);

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
  });

  test('ProductList tải và hiển thị danh sách sản phẩm', async () => {
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Product Management/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Đang tải sản phẩm/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Kiểm tra sản phẩm được hiển thị
    expect(await screen.findByText(/iPhone 15 Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Galaxy S24 Ultra/i)).toBeInTheDocument();
  });

  test('ProductList hiển thị empty state khi không có sản phẩm', async () => {
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: []
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Chưa có sản phẩm nào/i)).toBeInTheDocument();
    });
  });

  test('ProductDetail hiển thị chi tiết sản phẩm', async () => {
    productService.getProductById.mockResolvedValue({
      success: true,
      data: mockProducts[0]
    });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const heading = await screen.findByRole('heading', {
      name: /chi tiết sản phẩm/i
    });

    expect(heading).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText(/Đang tải thông tin sản phẩm/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
  });

  test('ProductList tìm kiếm sản phẩm', async () => {
    productService.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    productService.searchProducts.mockResolvedValue({
      success: true,
      data: [mockProducts[0]]
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm sản phẩm/i);
    const searchButton = screen.getByRole('button', { name: /Tìm kiếm/i });

    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(productService.searchProducts).toHaveBeenCalledWith('iPhone');
      expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
      expect(screen.queryByText(/Galaxy S24 Ultra/i)).not.toBeInTheDocument();
    });
  });
});
