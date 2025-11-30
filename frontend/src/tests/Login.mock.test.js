import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/components/Login';
import authService from '../../src/services/authService'; // Import authService

// a) Mock authService.login() - ĐÂY LÀ YÊU CẦU (1 điểm)
jest.mock('../../src/services/authService');

describe('Kiểm tra Mock Component Login', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Xóa tất cả mock trước mỗi test
  });

  test('a) Kiểm tra rendering và tương tác người dùng (2 điểm): Hiển thị form và cho phép nhập dữ liệu', () => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    // Kiểm tra rendering
    expect(screen.getByRole('heading', { name: /Đăng Nhập/i })).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();

    // Mô phỏng tương tác người dùng: Nhập dữ liệu
    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    expect(passwordInput.value).toBe('Test123');
  });

  // b) Test với mocked successful response (1 điểm)
  test('b) Kiểm tra form submission với mocked successful response', async () => {
    // Mock authService.login trả về success
    authService.login.mockResolvedValue({
      success: true,
      message: 'Đăng nhập thành công!',
      data: { token: 'fake-token' }
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'Test123' } }); // Password HỢP LỆ

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    // c) Verify mock calls (0.5 điểm)
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'Test123');
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  // b) Test với mocked failed response (1 điểm)
  test('b) Kiểm tra xử lý lỗi với mocked failed response', async () => {
    // Mock authService.login throw error
    authService.login.mockRejectedValue({
      response: { data: { message: 'Tên đăng nhập hoặc mật khẩu không đúng!' } }
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'Wrong123' } }); // SỬA: Password HỢP LỆ để pass validation

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    // Verify error message hiển thị
    expect(await screen.findByText('Tên đăng nhập hoặc mật khẩu không đúng!')).toBeInTheDocument();

    // c) Verify mock calls (0.5 điểm)
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('wronguser', 'Wrong123');
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });

  // c) Verify mock được reset giữa các test
  test('c) Verify mock calls - kiểm tra mock được reset', () => {
    // Mock mới cho test này
    authService.login.mockResolvedValue({
      success: true,
      message: 'Test',
      data: {}
    });

    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </BrowserRouter>
    );

    // Verify mock chưa được gọi (vì chưa submit)
    expect(authService.login).not.toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledTimes(0);
  });
});