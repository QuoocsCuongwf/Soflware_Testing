import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'; // Mock axios
import Login from '../../components/Login'; // Adjust path

jest.mock('axios'); // Mock axios globally

describe('Login Component Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Mock success API response: Đăng nhập thành công và lưu token', async () => {
    // Mock success response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Đăng nhập thành công!',
        data: { token: 'fake-jwt-token', username: 'testuser' }
      }
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

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'Test123'
    }));

    // Check handling success
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(screen.getByTestId('login-message')).toHaveTextContent('Đăng nhập thành công!');
  });

  test('Mock error API response: Hiển thị lỗi khi đăng nhập thất bại', async () => {
    // Mock error response
    axios.post.mockRejectedValue({
      response: {
        data: { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' }
      }
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

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Check handling error
    expect(screen.getByTestId('login-message')).toHaveTextContent('Tên đăng nhập hoặc mật khẩu không đúng!');
  });
});