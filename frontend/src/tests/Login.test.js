import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login.js';
import authService from '../services/authService.js';

// Mock authService
jest.mock('../services/authService');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe('Login Component Tests', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );
  };

  test('renders login form correctly', () => {
    renderLogin();
    
    expect(
      screen.getByRole('heading', { name: /đăng nhập/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  test('validates empty username', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username không được để trống')).toBeInTheDocument();
    });
  });

  test('validates username length', async () => {
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username phải có ít nhất 3 ký tự')).toBeInTheDocument();
    });
  });

  test('validates empty password', async () => {
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password không được để trống')).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    const passwordInput = screen.getByPlaceholderText('Nhập password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password phải có ít nhất 6 ký tự')).toBeInTheDocument();
    });
  });

  test('successful login', async () => {
    authService.login.mockResolvedValue({
      success: true,
      data: {
        token: 'fake-token',
        username: 'testuser'
      }
    });

    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    const passwordInput = screen.getByPlaceholderText('Nhập password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockOnLogin).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith('/products');
    });
  });

  test('failed login shows error message', async () => {
    authService.login.mockRejectedValue({
      response: {
        data: {
          message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
        }
      }
    });

    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Nhập username');
    const passwordInput = screen.getByPlaceholderText('Nhập password');
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Tên đăng nhập hoặc mật khẩu không đúng!')).toBeInTheDocument();
    });
  });
});
