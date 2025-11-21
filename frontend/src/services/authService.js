import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

/**
 * Auth Service - Xử lý các API liên quan đến xác thực
 */
const authService = {
  /**
   * Đăng nhập
   */
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  /**
   * Đăng ký
   */
  register: async (username, password, email, fullName) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
      email,
      fullName
    });
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  /**
   * Đăng xuất
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Lấy token hiện tại
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

export default authService;
