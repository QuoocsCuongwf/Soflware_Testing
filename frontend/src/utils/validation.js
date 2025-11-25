/**
 * Validation Utilities - Các hàm kiểm tra validation
 */

/**
 * Validate username
 * - Không được để trống
 * - Độ dài từ 3-50 ký tự
 * - Chỉ cho phép chữ cái, số, dấu chấm (.), dấu gạch ngang (-), dấu gạch dưới (_)
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username không được để trống';
  }
  
  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3) {
    return 'Username phải có ít nhất 3 ký tự';
  }
  if (trimmedUsername.length > 50) {
    return 'Username không được quá 50 ký tự';
  }
  
  // Regex: chỉ cho phép a-z, A-Z, 0-9, ., -, _
  const usernameRegex = /^[A-Za-z0-9._-]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return 'Username chỉ được chứa chữ cái, số, dấu chấm (.), dấu gạch ngang (-), dấu gạch dưới (_)';
  }
  
  return '';
};

/**
 * Validate password
 * - Không được để trống
 * - Độ dài 6-100 ký tự
 * - Phải chứa ít nhất 1 chữ cái và 1 chữ số
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password không được để trống';
  }
  
  if (password.length < 6 || password.length > 100) {
    return 'Password phải từ 6-100 ký tự';
  }
  
  // Regex: ít nhất 1 chữ cái và 1 chữ số
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return 'Password phải chứa ít nhất 1 chữ cái và 1 chữ số';
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