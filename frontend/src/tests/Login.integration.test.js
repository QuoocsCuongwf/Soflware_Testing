import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from '../../src/components/Login';
import authService from '../../src/services/authService';

jest.mock('../../src/services/authService');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Login Component Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // a) Test rendering và user interactions (2 điểm)
test('Rendering component và user interactions cơ bản', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Login />
    </BrowserRouter>
  );

  // Kiểm tra rendering đầy đủ - dùng getByRole để tránh duplicate
  expect(screen.getByTestId('username-input')).toBeInTheDocument();
  expect(screen.getByTestId('password-input')).toBeInTheDocument();
  expect(screen.getByTestId('login-button')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Đăng Nhập/i })).toBeInTheDocument(); // Chỉ lấy h2
  expect(screen.getByText(/Chào mừng bạn trở lại/i)).toBeInTheDocument();

  // Test user interactions - username
  const usernameInput = screen.getByTestId('username-input');
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  expect(usernameInput.value).toBe('testuser');

  // Test user interactions - password
  const passwordInput = screen.getByTestId('password-input');
  fireEvent.change(passwordInput, { target: { value: 'Test123' } });
  expect(passwordInput.value).toBe('Test123');
});

  // a) Bonus: Test clear error khi user nhập lại
  test('Clear error khi user nhập lại sau validation fail', async () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    // Submit form rỗng để hiển thị error
    fireEvent.click(screen.getByTestId('login-button'));
    
    const usernameError = await screen.findByText('Username không được để trống');
    expect(usernameError).toBeInTheDocument();

    // Nhập dữ liệu vào username
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });

    // Error phải biến mất
    expect(screen.queryByText('Username không được để trống')).not.toBeInTheDocument();
  });

  // c) Error handling client-side
  test('Hiển thị lỗi khi submit form rỗng', async () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId('login-button'));

    expect(await screen.findByText('Username không được để trống')).toBeInTheDocument();
    expect(await screen.findByText('Password không được để trống')).toBeInTheDocument();
  });

  // b) Success + redirect
  test('Gọi API khi submit form hợp lệ và handling success', async () => {
    const mockNavigate = jest.fn();
    const mockOnLogin = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    authService.login.mockResolvedValue({
      success: true,
      message: 'Đăng nhập thành công!',
      data: { token: 'fake-token' }
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login onLogin={mockOnLogin} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'Test123');
    });

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products');
    });
  });

  // b) Bonus: Test loading state
  test('Hiển thị loading state khi đang submit', async () => {
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });

    fireEvent.click(screen.getByTestId('login-button'));

    // Button phải hiển thị text loading
    expect(await screen.findByText('Đang đăng nhập...')).toBeInTheDocument();
  });

  // c) Error handling server-side
  test('Handling error khi API fail', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Lỗi server' } }
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    expect(await screen.findByText('Lỗi server')).toBeInTheDocument();
  });

  // c) Bonus: Test API fail không có response.data.message
  test('Hiển thị default error message khi API fail không có message', async () => {
    authService.login.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    expect(await screen.findByText('Tên đăng nhập hoặc mật khẩu không đúng!')).toBeInTheDocument();
  });
});