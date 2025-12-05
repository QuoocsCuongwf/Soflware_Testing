import { validateUsername, validatePassword } from '../utils/validation';

describe('Validation Utils Tests', () => {
  
  // ==================== a) Unit tests cho validateUsername() (2 điểm) ====================
  
  describe('validateUsername()', () => {    
    // Test username rỗng
    test('Nên trả về lỗi khi username rỗng', () => {
      expect(validateUsername('')).toBe('Username không được để trống');
      expect(validateUsername(null)).toBe('Username không được để trống');
      expect(validateUsername(undefined)).toBe('Username không được để trống');
    });
    // Test username chỉ có khoảng trắng
    test('Nên trả về lỗi khi username chỉ có khoảng trắng', () => {
      expect(validateUsername('   ')).toBe('Username không được để trống');
      expect(validateUsername('  ')).toBe('Username không được để trống');
    });
    // Test username quá ngắn
    test('Nên trả về lỗi khi username quá ngắn (< 3 ký tự)', () => {
      expect(validateUsername('a')).toBe('Username phải có ít nhất 3 ký tự');
      expect(validateUsername('ab')).toBe('Username phải có ít nhất 3 ký tự');
    });
    // Test username quá dài
    test('Nên trả về lỗi khi username quá dài (> 20 ký tự)', () => {
      const longUsername = 'a'.repeat(21);
      expect(validateUsername(longUsername)).toBe('Username không được vượt quá 20 ký tự');
      expect(validateUsername('abcdefghijklmnopqrstu')).toBe('Username không được vượt quá 20 ký tự');
    });
    // Test ký tự đặc biệt không hợp lệ
    test('Nên trả về lỗi khi username chứa ký tự đặc biệt không hợp lệ', () => {
      expect(validateUsername('user@name')).toBe('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
      expect(validateUsername('user name')).toBe('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
      expect(validateUsername('user-name')).toBe('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
      expect(validateUsername('user#123')).toBe('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
      expect(validateUsername('user.name')).toBe('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
    });

    // Test username hợp lệ
    test('Nên trả về null khi username hợp lệ', () => {
      expect(validateUsername('abc')).toBeNull();
      expect(validateUsername('user123')).toBeNull();
      expect(validateUsername('test_user')).toBeNull();
      expect(validateUsername('User_123')).toBeNull();
      expect(validateUsername('abcdefghij')).toBeNull(); // 10 ký tự
      expect(validateUsername('abcdefghijklmnopqrst')).toBeNull(); // 20 ký tự (max)
    });

    // Test edge cases
    test('Nên xử lý đúng các edge cases', () => {
      expect(validateUsername('___')).toBeNull(); // Chỉ gạch dưới
      expect(validateUsername('123')).toBeNull(); // Chỉ số
      expect(validateUsername('ABC')).toBeNull(); // Chữ hoa
      expect(validateUsername('abc123___')).toBeNull(); // Mix hợp lệ
    });
  });

  // ==================== b) Unit tests cho validatePassword() (2 điểm) ====================
  
  describe('validatePassword()', () => {
    
    // Test password rỗng
    test('Nên trả về lỗi khi password rỗng', () => {
      expect(validatePassword('')).toBe('Password không được để trống');
      expect(validatePassword(null)).toBe('Password không được để trống');
      expect(validatePassword(undefined)).toBe('Password không được để trống');
    });

    // Test password chỉ có khoảng trắng
    test('Nên trả về lỗi khi password chỉ có khoảng trắng', () => {
      expect(validatePassword('      ')).toBe('Password không được để trống');
      expect(validatePassword('  ')).toBe('Password không được để trống');
    });

    // Test password quá ngắn
    test('Nên trả về lỗi khi password quá ngắn (< 6 ký tự)', () => {
      expect(validatePassword('12345')).toBe('Password phải có ít nhất 6 ký tự');
      expect(validatePassword('abc')).toBe('Password phải có ít nhất 6 ký tự');
      expect(validatePassword('a')).toBe('Password phải có ít nhất 6 ký tự');
      expect(validatePassword('Test1')).toBe('Password phải có ít nhất 6 ký tự');
    });

    // Test password quá dài
    test('Nên trả về lỗi khi password quá dài (> 30 ký tự)', () => {
      const longPassword = 'A1' + 'a'.repeat(30);
      expect(validatePassword(longPassword)).toBe('Password không được vượt quá 30 ký tự');
      expect(validatePassword('Test123' + 'a'.repeat(25))).toBe('Password không được vượt quá 30 ký tự');
    });

    // Test password không có chữ cái
    test('Nên trả về lỗi khi password không có chữ cái', () => {
      expect(validatePassword('123456')).toBe('Password phải chứa ít nhất một chữ cái');
      expect(validatePassword('!@#$%^')).toBe('Password phải chứa ít nhất một chữ cái');
      expect(validatePassword('12345678')).toBe('Password phải chứa ít nhất một chữ cái');
    });

    // Test password không có số
    test('Nên trả về lỗi khi password không có số', () => {
      expect(validatePassword('abcdef')).toBe('Password phải chứa ít nhất một chữ số');
      expect(validatePassword('Password')).toBe('Password phải chứa ít nhất một chữ số');
      expect(validatePassword('TestPass')).toBe('Password phải chứa ít nhất một chữ số');
    });

    // Test password hợp lệ
    test('Nên trả về null khi password hợp lệ', () => {
      expect(validatePassword('Pass123')).toBeNull();
      expect(validatePassword('Test123')).toBeNull();
      expect(validatePassword('abcdef1')).toBeNull();
      expect(validatePassword('MyP4ssw0rd')).toBeNull();
      expect(validatePassword('Test@123')).toBeNull(); // Có ký tự đặc biệt vẫn OK
      expect(validatePassword('a1b2c3')).toBeNull(); // Đúng 6 ký tự (min)
      expect(validatePassword('Test123' + 'a'.repeat(23))).toBeNull(); // 30 ký tự (max)
    });

    // Test edge cases - password với ký tự đặc biệt
    test('Nên chấp nhận password có ký tự đặc biệt (nếu có chữ và số)', () => {
      expect(validatePassword('P@ssw0rd')).toBeNull();
      expect(validatePassword('Test!123')).toBeNull();
      expect(validatePassword('My#Pass1')).toBeNull();
    });

    // Test edge cases - mix chữ hoa/thường/số
    test('Nên chấp nhận password mix chữ hoa, thường và số', () => {
      expect(validatePassword('ABCdef123')).toBeNull();
      expect(validatePassword('Test123TEST')).toBeNull();
      expect(validatePassword('aB1cD2eF3')).toBeNull();
    });
  });

  // ==================== c) Coverage tests (1 điểm) ====================
  
  describe('Edge Cases và Coverage', () => {
    
    test('validateUsername - test với giá trị boolean/number', () => {
      // Test với các kiểu dữ liệu khác
      expect(validateUsername(123)).toBe('Username không được để trống');
      expect(validateUsername(true)).toBe('Username không được để trống');
      expect(validateUsername(false)).toBe('Username không được để trống');
    });

    test('validatePassword - test với giá trị boolean/number', () => {
      // Test với các kiểu dữ liệu khác
      expect(validatePassword(123456)).toBe('Password không được để trống');
      expect(validatePassword(true)).toBe('Password không được để trống');
      expect(validatePassword(false)).toBe('Password không được để trống');
    });

    test('validateUsername - test boundary values', () => {
      // Boundary: đúng 3 ký tự (min valid)
      expect(validateUsername('abc')).toBeNull();
      
      // Boundary: đúng 20 ký tự (max valid)
      expect(validateUsername('12345678901234567890')).toBeNull();
      
      // Boundary: 2 ký tự (min - 1)
      expect(validateUsername('ab')).toBe('Username phải có ít nhất 3 ký tự');
      
      // Boundary: 21 ký tự (max + 1)
      expect(validateUsername('123456789012345678901')).toBe('Username không được vượt quá 20 ký tự');
    });

    test('validatePassword - test boundary values', () => {
      // Boundary: đúng 6 ký tự (min valid)
      expect(validatePassword('Pass12')).toBeNull();
      
      // Boundary: đúng 30 ký tự (max valid)
      expect(validatePassword('Pass1' + 'a'.repeat(25))).toBeNull();
      
      // Boundary: 5 ký tự (min - 1)
      expect(validatePassword('Pas12')).toBe('Password phải có ít nhất 6 ký tự');
      
      // Boundary: 31 ký tự (max + 1)
      expect(validatePassword('Pass1' + 'a'.repeat(26))).toBe('Password không được vượt quá 30 ký tự');
    });
  });
});