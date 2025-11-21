import axios from 'axios';
import authService from './authService.js';

const API_URL = 'http://localhost:8080/api/products';

/**
 * Lấy Authorization header với JWT token
 */
const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Product Service - Xử lý các API liên quan đến sản phẩm
 */
const productService = {
  /**
   * Lấy tất cả sản phẩm
   */
  getAllProducts: async () => {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Lấy sản phẩm theo ID
   */
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Tạo sản phẩm mới
   */
  createProduct: async (productData) => {
    const response = await axios.post(API_URL, productData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Cập nhật sản phẩm
   */
  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Xóa sản phẩm
   */
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Tìm kiếm sản phẩm theo tên
   */
  searchProducts: async (name) => {
    const response = await axios.get(`${API_URL}/search?name=${name}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  /**
   * Lấy sản phẩm theo danh mục
   */
  getProductsByCategory: async (category) => {
    const response = await axios.get(`${API_URL}/category/${category}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default productService;
