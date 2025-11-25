/**
 * Validation Utilities - Các hàm kiểm tra validation
 */

/**
 * Validate username
 * - Không được để trống
 * - Độ dài từ 3-50 ký tự
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username không được để trống';
  }
  if (username.length < 3) {
    return 'Username phải có ít nhất 3 ký tự';
  }
  if (username.length > 50) {
    return 'Username không được quá 50 ký tự';
  }
  return '';
};

/**
 * Validate password
 * - Không được để trống
 * - Độ dài tối thiểu 6 ký tự
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password không được để trống';
  }
  if (password.length < 6) {
    return 'Password phải có ít nhất 6 ký tự';
  }
  return '';
};

/**
 * Validate email
 * - Không được để trống
 * - Định dạng email hợp lệ
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email không được để trống';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  return '';
};

/**
 * Validate product name
 * - Không được để trống
 * - Độ dài tối đa 200 ký tự
 */
export const validateProductName = (name) => {
  if (!name || name.trim() === '') {
    return 'Tên sản phẩm không được để trống';
  }
  if (name.length > 200) {
    return 'Tên sản phẩm không được quá 200 ký tự';
  }
  return '';
};

/**
 * Validate price
 * - Phải là số
 * - Phải lớn hơn 0
 */
export const validatePrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Giá không được để trống';
  }
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return 'Giá phải là số';
  }
  if (numPrice <= 0) {
    return 'Giá phải lớn hơn 0';
  }
  return '';
};

/**
 * Validate quantity
 * - Phải là số nguyên
 * - Không được âm
 */
export const validateQuantity = (quantity) => {
  if (quantity === null || quantity === undefined || quantity === '') {
    return 'Số lượng không được để trống';
  }
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity)) {
    return 'Số lượng phải là số';
  }
  if (!Number.isInteger(numQuantity)) {
    return 'Số lượng phải là số nguyên';
  }
  if (numQuantity < 0) {
    return 'Số lượng không được âm';
  }
  return '';
};

/**
 * Format currency (VND)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};