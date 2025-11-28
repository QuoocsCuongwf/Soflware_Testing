/**
 * Validation Utilities - Các hàm kiểm tra validation
 * Cập nhật theo yêu cầu bài tập lớn (Assignment Requirements)
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
 * - Độ dài từ 3-100 ký tự (Cập nhật theo yêu cầu)
 */
export const validateProductName = (name) => {
  if (!name || name.trim() === '') {
    return 'Tên sản phẩm không được để trống';
  }
  // Yêu cầu: 3-100 ký tự
  if (name.length < 3 || name.length > 100) {
    return 'Tên sản phẩm phải từ 3-100 ký tự';
  }
  return '';
};

/**
 * Validate price
 * - Phải là số
 * - Phải lớn hơn 0
 * - Nhỏ hơn hoặc bằng 999,999,999 (Cập nhật theo yêu cầu)
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
  // Yêu cầu: Max 999,999,999
  if (numPrice > 999999999) {
    return 'Giá quá lớn (tối đa 999,999,999)';
  }
  return '';
};

/**
 * Validate quantity
 * - Phải là số nguyên
 * - Không được âm
 * - Nhỏ hơn hoặc bằng 99,999 (Cập nhật theo yêu cầu)
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
  // Yêu cầu: Max 99,999
  if (numQuantity > 99999) {
    return 'Số lượng không được quá 99,999';
  }
  return '';
};

/**
 * Validate description (Mới)
 * - Tối đa 500 ký tự
 */
export const validateDescription = (description) => {
  if (description && description.length > 500) {
    return 'Mô tả không được quá 500 ký tự';
  }
  return '';
};

/**
 * Validate category (Mới)
 * - Phải thuộc danh sách cho phép
 */
export const validateCategory = (category) => {
  const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Food', 'Books'];
  
  if (!category || category.trim() === '') {
    return 'Danh mục không được để trống';
  }
  
  if (!VALID_CATEGORIES.includes(category)) {
    return 'Danh mục không hợp lệ';
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