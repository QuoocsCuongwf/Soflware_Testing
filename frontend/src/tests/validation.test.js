import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateProductName,
  validatePrice,
  validateQuantity
} from '../utils/validation.js';

describe('Validation Utils Tests', () => {
  
  describe('validateUsername', () => {
    test('returns error for empty username', () => {
      expect(validateUsername('')).toBe('Username không được để trống');
      expect(validateUsername('  ')).toBe('Username không được để trống');
    });

    test('returns error for username less than 3 characters', () => {
      expect(validateUsername('ab')).toBe('Username phải có ít nhất 3 ký tự');
    });

    test('returns error for username more than 50 characters', () => {
      const longUsername = 'a'.repeat(51);
      expect(validateUsername(longUsername)).toBe('Username không được quá 50 ký tự');
    });

    test('returns empty string for valid username', () => {
      expect(validateUsername('user123')).toBe('');
      expect(validateUsername('abc')).toBe('');
    });
  });

  describe('validatePassword', () => {
    test('returns error for empty password', () => {
      expect(validatePassword('')).toBe('Password không được để trống');
      expect(validatePassword('  ')).toBe('Password không được để trống');
    });

    test('returns error for password less than 6 characters', () => {
      expect(validatePassword('12345')).toBe('Password phải có ít nhất 6 ký tự');
    });

    test('returns empty string for valid password', () => {
      expect(validatePassword('password123')).toBe('');
      expect(validatePassword('123456')).toBe('');
    });
  });

  describe('validateEmail', () => {
    test('returns error for empty email', () => {
      expect(validateEmail('')).toBe('Email không được để trống');
      expect(validateEmail('  ')).toBe('Email không được để trống');
    });

    test('returns error for invalid email format', () => {
      expect(validateEmail('invalid')).toBe('Email không hợp lệ');
      expect(validateEmail('test@')).toBe('Email không hợp lệ');
      expect(validateEmail('@example.com')).toBe('Email không hợp lệ');
    });

    test('returns empty string for valid email', () => {
      expect(validateEmail('test@example.com')).toBe('');
      expect(validateEmail('user.name@domain.co.uk')).toBe('');
    });
  });

  describe('validateProductName', () => {
    test('returns error for empty product name', () => {
      expect(validateProductName('')).toBe('Tên sản phẩm không được để trống');
      expect(validateProductName('  ')).toBe('Tên sản phẩm không được để trống');
    });

    test('returns error for product name more than 200 characters', () => {
      const longName = 'a'.repeat(201);
      expect(validateProductName(longName)).toBe('Tên sản phẩm không được quá 200 ký tự');
    });

    test('returns empty string for valid product name', () => {
      expect(validateProductName('Laptop Dell XPS')).toBe('');
    });
  });

  describe('validatePrice', () => {
    test('returns error for empty price', () => {
      expect(validatePrice('')).toBe('Giá không được để trống');
      expect(validatePrice(null)).toBe('Giá không được để trống');
      expect(validatePrice(undefined)).toBe('Giá không được để trống');
    });

    test('returns error for non-numeric price', () => {
      expect(validatePrice('abc')).toBe('Giá phải là số');
    });

    test('returns error for price less than or equal to 0', () => {
      expect(validatePrice(0)).toBe('Giá phải lớn hơn 0');
      expect(validatePrice(-10)).toBe('Giá phải lớn hơn 0');
    });

    test('returns empty string for valid price', () => {
      expect(validatePrice(100)).toBe('');
      expect(validatePrice('250.50')).toBe('');
      expect(validatePrice(1000000)).toBe('');
    });
  });

  describe('validateQuantity', () => {
    test('returns error for empty quantity', () => {
      expect(validateQuantity('')).toBe('Số lượng không được để trống');
      expect(validateQuantity(null)).toBe('Số lượng không được để trống');
      expect(validateQuantity(undefined)).toBe('Số lượng không được để trống');
    });

    test('returns error for non-numeric quantity', () => {
      expect(validateQuantity('abc')).toBe('Số lượng phải là số');
    });

    test('returns error for non-integer quantity', () => {
      expect(validateQuantity(10.5)).toBe('Số lượng phải là số nguyên');
    });

    test('returns error for negative quantity', () => {
      expect(validateQuantity(-5)).toBe('Số lượng không được âm');
    });

    test('returns empty string for valid quantity', () => {
      expect(validateQuantity(0)).toBe('');
      expect(validateQuantity(10)).toBe('');
      expect(validateQuantity('25')).toBe('');
    });
  });
});
