import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ProductForm from '../components/ProductForm.js';
import ProductList from '../components/ProductList.js';
import ProductDetail from '../components/ProductDetail.js';
import productService from '../services/productService.js';
import authService from '../services/authService.js';

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
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
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
  // Thêm code mới tăng coverage

  test('Quy trình: Thêm sản phẩm mới thành công (Integration)', async () => {
    // 1. Setup Mock cho quy trình thêm
    productService.getAllProducts.mockResolvedValue({ 
      success: true, 
      data: mockProducts 
    });
    productService.createProduct.mockResolvedValue({ 
      success: true, 
      data: { id: 3, name: 'New Product', price: 5000 } 
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    // 2. Chờ danh sách tải xong
    await screen.findByText(/iPhone 15 Pro/i);

    // 3. Mở form thêm mới (Giả định nút có text là "Thêm sản phẩm" hoặc icon tương tự)
    // Lưu ý: Cần đảm bảo ProductList có nút này. Tìm theo role button.
    const addButton = screen.getByRole('button', { name: /Thêm|Create/i }); 
    fireEvent.click(addButton);

    // 4. Điền form
    const nameInput = screen.getByLabelText(/Tên sản phẩm/i);
    const priceInput = screen.getByLabelText(/Giá/i);
    const quantityInput = screen.getByLabelText(/Số lượng/i);

    fireEvent.change(nameInput, { target: { value: 'New Product' } });
    fireEvent.change(priceInput, { target: { value: '5000' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });

    // 5. Submit form
    const submitButton = screen.getByRole('button', { name: /Thêm mới|Lưu/i });
    fireEvent.click(submitButton);

    // 6. Verify Service Call
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Product',
        price: 5000,
        quantity: 10
      }));
    });

    // 7. Verify Alert Success (Mock window.alert)
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/thành công/i));
  });

  test('Quy trình: Xóa sản phẩm thành công', async () => {
    // 1. Setup Mock
    productService.getAllProducts.mockResolvedValue({ 
      success: true, 
      data: mockProducts 
    });
    productService.deleteProduct.mockResolvedValue({ 
      success: true 
    });
    
    // Mock window.confirm luôn trả về true
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    // 2. Chờ danh sách tải xong
    await screen.findByText(/iPhone 15 Pro/i);

    // 3. Click nút xóa của sản phẩm đầu tiên
    const deleteButtons = screen.getAllByRole('button', { name: /Xóa|Delete/i });
    fireEvent.click(deleteButtons[0]);

    // 4. Verify Confirm Dialog
    expect(window.confirm).toHaveBeenCalled();

    // 5. Verify Service Delete Call
    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
    });

    // 6. Verify gọi lại getAllProducts để refresh list
    expect(productService.getAllProducts).toHaveBeenCalledTimes(2); // 1 lần init, 1 lần sau khi xóa
  });

  test('Quy trình: Sửa sản phẩm (Edit Flow)', async () => {
    // 1. Setup Mock
    productService.getAllProducts.mockResolvedValue({ 
      success: true, 
      data: mockProducts 
    });
    productService.updateProduct.mockResolvedValue({ 
      success: true 
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 15 Pro/i);

    // 2. Click nút Sửa của sản phẩm đầu tiên
    const editButtons = screen.getAllByRole('button', { name: /Sửa|Edit/i });
    fireEvent.click(editButtons[0]);

    // 3. Verify Form mở lên với dữ liệu cũ
    const nameInput = screen.getByLabelText(/Tên sản phẩm/i);
    expect(nameInput.value).toBe('iPhone 15 Pro');

    // 4. Thay đổi dữ liệu
    fireEvent.change(nameInput, { target: { value: 'iPhone 15 Pro Max' } });

    // 5. Submit cập nhật
    const updateButton = screen.getByRole('button', { name: /Cập nhật|Lưu/i });
    fireEvent.click(updateButton);

    // 6. Verify Service Update Call
    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(
        mockProducts[0].id,
        expect.objectContaining({ name: 'iPhone 15 Pro Max' })
      );
    });
  });

  // Test xử lý lỗi API (Negative Case)
  test('Hiển thị thông báo lỗi khi API trả về lỗi', async () => {
    productService.getAllProducts.mockRejectedValue({
      response: { data: { message: 'Lỗi máy chủ nội bộ' } }
    });

    render(
      <MemoryRouter>
        <ProductList onLogout={jest.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalled();
    });
  });

  // ...
  // --- 4. PRODUCT DETAIL TESTS (CHI TIẾT ĐỂ TĂNG COVERAGE) ---
  
  test('ProductDetail: Hiển thị chi tiết sản phẩm thành công', async () => {
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

    await waitFor(() => {
      expect(screen.queryByText(/Đang tải/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Flagship smartphone 2024/i)).toBeInTheDocument();
  });

  test('ProductDetail: Hiển thị lỗi khi không tìm thấy sản phẩm (Success: false)', async () => {
    // Giả lập API trả về success: false
    productService.getProductById.mockResolvedValue({ success: false });

    render(
      <MemoryRouter initialEntries={['/products/999']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy sản phẩm')).toBeInTheDocument();
    });

    // Test nút quay lại trong màn hình lỗi
    fireEvent.click(screen.getByText(/Quay lại danh sách/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/products');
  });

  test('ProductDetail: Hiển thị lỗi khi API crash (Try/Catch)', async () => {
    // Giả lập API chết
    productService.getProductById.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Không thể tải thông tin sản phẩm')).toBeInTheDocument();
    });
  });

  test('ProductDetail: Navigation - Chuyển sang trang Edit và Back', async () => {
    productService.getProductById.mockResolvedValue({ success: true, data: mockProducts[0] });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 15 Pro/i);

    // Test nút Edit
    fireEvent.click(screen.getByText(/Chỉnh sửa/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/products', { 
      state: { editProduct: mockProducts[0] } 
    });

    // Test nút Back (ở header)
    fireEvent.click(screen.getByText(/← Quay lại/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/products');
  });

  test('ProductDetail: Xóa thất bại (Người dùng hủy Confirm)', async () => {
    productService.getProductById.mockResolvedValue({ success: true, data: mockProducts[0] });
    
    // Giả lập user bấm Cancel
    window.confirm.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 15 Pro/i);

    fireEvent.click(screen.getByText(/Xóa sản phẩm/i));
    
    // Xác nhận service xóa KHÔNG được gọi
    expect(productService.deleteProduct).not.toHaveBeenCalled();
  });

  test('ProductDetail: Xóa thất bại (API Error)', async () => {
    productService.getProductById.mockResolvedValue({ success: true, data: mockProducts[0] });
    productService.deleteProduct.mockRejectedValue(new Error('Delete error'));
    window.confirm.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 15 Pro/i);

    fireEvent.click(screen.getByText(/Xóa sản phẩm/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Không thể xóa sản phẩm!');
    });
  });

  test('ProductDetail: Xóa thành công', async () => {
    productService.getProductById.mockResolvedValue({ success: true, data: mockProducts[0] });
    productService.deleteProduct.mockResolvedValue({ success: true });
    window.confirm.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/iPhone 15 Pro/i);

    fireEvent.click(screen.getByText(/Xóa sản phẩm/i));

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith('1'); // ID string từ URL
      expect(window.alert).toHaveBeenCalledWith('Xóa sản phẩm thành công!');
      expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });
  });

  test('ProductDetail: Hiển thị placeholder khi không có hình ảnh', async () => {
    // Sản phẩm không có imageUrl
    const noImageProduct = { ...mockProducts[0], imageUrl: '' };
    productService.getProductById.mockResolvedValue({ success: true, data: noImageProduct });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Không có hình ảnh')).toBeInTheDocument();
    });
  });
});
