import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Để test navigate nếu cần
import axios from 'axios'; // Mock API calls
import Login from '../../components/Login'; // Adjust path to Login component

jest.mock('axios'); // Mock axios để test API calls mà không gọi real server

describe('Login Component Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Rendering và user interactions: Hiển thị form và cho phép nhập data', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check rendering với getByTestId (thêm data-testid vào code component nếu chưa có)
    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();

    // User interactions: Enter data
    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput.value).toBe('testuser');

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });
    expect(passwordInput.value).toBe('Test123');
  });

  test('Form submission với form rỗng: Hiển thị lỗi validation client-side', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    const usernameError = await screen.findByTestId('username-error'); // Ví dụ: text 'Username không được để trống'
    expect(usernameError).toBeInTheDocument();

    const passwordError = await screen.findByTestId('password-error'); // Ví dụ: text 'Password không được để trống'
    expect(passwordError).toBeInTheDocument();
  });

  test('Form submission với input hợp lệ: Gọi API và handling success messages', async () => {
    // Mock API success
    axios.post.mockResolvedValue({
      data: { success: true, message: 'Đăng nhập thành công!', data: { token: 'fake-token' } }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'Test123' } });

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    await screen.findByTestId('login-message'); // Chờ element xuất hiện trước khi check API call
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { username: 'testuser', password: 'Test123' });
    expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thành công!'); // Hoặc check toast nếu dùng
    // Check lưu token: expect(localStorage.getItem('token')).toBe('fake-token');
  });

  test('Error handling: Hiển thị lỗi server khi API fail', async () => {
    // Mock API error
    axios.post.mockRejectedValue({
      response: { data: { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' } }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId('username-input');
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

    const submitButton = screen.getByTestId('login-button');
    fireEvent.click(submitButton);

    await screen.findByTestId('login-message'); // Chờ element xuất hiện
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('login-message')).toHaveTextContent('Tên đăng nhập hoặc mật khẩu không đúng!'); // Hoặc error element
  });
});