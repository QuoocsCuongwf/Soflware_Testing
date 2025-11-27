import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateProductName,
  validatePrice,
  validateQuantity,
  validateDescription,
  validateCategory,
  formatCurrency,
  formatDate
} from '../utils/validation.js';

describe('Product Validation Utilities Tests', () => {
  // 4. Validate Product Name
  describe('validateProductName', () => {
    test('returns error for empty product name', () => {
      expect(validateProductName('')).toBe('Tên sản phẩm không được để trống');
      expect(validateProductName('   ')).toBe('Tên sản phẩm không được để trống');
    });

    test('returns error for short product name (< 3 chars)', () => {
      expect(validateProductName('AB')).toBe('Tên sản phẩm phải từ 3-100 ký tự');
    });

    test('returns error for long product name (> 100 chars)', () => {
      const longName = 'a'.repeat(101);
      expect(validateProductName(longName)).toBe('Tên sản phẩm phải từ 3-100 ký tự');
    });

    test('returns empty string for valid product name', () => {
      expect(validateProductName('Laptop Dell')).toBe('');
      expect(validateProductName('abc')).toBe(''); // Boundary 3 chars
      expect(validateProductName('a'.repeat(100))).toBe(''); // Boundary 100 chars
    });
  });

  // 5. Validate Price
  describe('validatePrice', () => {
    test('returns error for empty price', () => {
      expect(validatePrice('')).toBe('Giá không được để trống');
      expect(validatePrice(null)).toBe('Giá không được để trống');
      expect(validatePrice(undefined)).toBe('Giá không được để trống');
    });

    test('returns error for non-numeric price', () => {
      expect(validatePrice('abc')).toBe('Giá phải là số');
    });

    test('returns error for price <= 0', () => {
      expect(validatePrice(0)).toBe('Giá phải lớn hơn 0');
      expect(validatePrice(-100)).toBe('Giá phải lớn hơn 0');
    });

    test('returns error for price too large (> 999,999,999)', () => {
      expect(validatePrice(1000000000)).toBe('Giá quá lớn (tối đa 999,999,999)');
    });

    test('returns empty string for valid price', () => {
      expect(validatePrice(100000)).toBe('');
      expect(validatePrice('50000')).toBe('');
      expect(validatePrice(999999999)).toBe(''); // Max boundary
    });
  });

  // 6. Validate Quantity
  describe('validateQuantity', () => {
    test('returns error for empty quantity', () => {
      expect(validateQuantity('')).toBe('Số lượng không được để trống');
      expect(validateQuantity(null)).toBe('Số lượng không được để trống');
    });

    test('returns error for non-numeric quantity', () => {
      expect(validateQuantity('xyz')).toBe('Số lượng phải là số');
    });

    test('returns error for non-integer quantity', () => {
      expect(validateQuantity(10.5)).toBe('Số lượng phải là số nguyên');
    });

    test('returns error for negative quantity', () => {
      expect(validateQuantity(-5)).toBe('Số lượng không được âm');
    });

    test('returns error for quantity too large (> 99,999)', () => {
      expect(validateQuantity(100000)).toBe('Số lượng không được quá 99,999');
    });

    test('returns empty string for valid quantity', () => {
      expect(validateQuantity(10)).toBe('');
      expect(validateQuantity(0)).toBe('');
      expect(validateQuantity(99999)).toBe(''); // Max boundary
    });
  });

  // 7. Validate Description (New)
  describe('validateDescription', () => {
    test('returns error for description too long (> 500 chars)', () => {
      const longDesc = 'a'.repeat(501);
      expect(validateDescription(longDesc)).toBe('Mô tả không được quá 500 ký tự');
    });

    test('returns empty string for valid description', () => {
      expect(validateDescription('Mô tả ngắn gọn')).toBe('');
      expect(validateDescription('')).toBe(''); // Empty is allowed
      expect(validateDescription(null)).toBe(''); // Null is allowed
    });
  });

  // 8. Validate Category (New)
  describe('validateCategory', () => {
    test('returns error for empty category', () => {
      expect(validateCategory('')).toBe('Danh mục không được để trống');
      expect(validateCategory(null)).toBe('Danh mục không được để trống');
    });

    test('returns error for invalid category', () => {
      expect(validateCategory('InvalidCategory')).toBe('Danh mục không hợp lệ');
      expect(validateCategory('cars')).toBe('Danh mục không hợp lệ');
    });

    test('returns empty string for valid category', () => {
      expect(validateCategory('Electronics')).toBe('');
      expect(validateCategory('Fashion')).toBe('');
      expect(validateCategory('Food')).toBe('');
      expect(validateCategory('Books')).toBe('');
    });
  });

  // 9. Format Currency
  describe('formatCurrency', () => {
    test('formats number to VND currency string', () => {
      const result = formatCurrency(100000);
      // Kiểm tra xem chuỗi kết quả có chứa các thành phần mong đợi không
      // (Do output có thể khác nhau về khoảng trắng tùy môi trường)
      expect(result).toMatch(/100\.000/); 
      expect(result).toMatch(/[₫dđ]/i); 
    });
  });

  // 10. Format Date
  describe('formatDate', () => {
    test('formats date string to locale date string', () => {
      const dateStr = '2023-12-25';
      const result = formatDate(dateStr);
      // Kỳ vọng format kiểu VN: 25/12/2023
      expect(result).toMatch(/25\/12\/2023/);
    });
    
    test('handles invalid date', () => {
        const result = formatDate('invalid');
        expect(result).toBe('Invalid Date');
    });
  });

});