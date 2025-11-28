/* eslint-disable testing-library/await-async-utils, no-undef */

describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  // d) Test UI elements interactions (0.5 điểm)
  it('d) Nên hiển thị đầy đủ các UI elements', () => {
    // Kiểm tra tất cả các elements hiển thị
    cy.get('[data-testid="username-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
    cy.contains('h2', 'Đăng Nhập').should('be.visible');
    cy.contains('Chào mừng bạn trở lại').should('be.visible');
    cy.contains('Chưa có tài khoản?').should('be.visible');
  });

  // d) Test user interactions với form inputs
  it('d) Nên cho phép nhập dữ liệu vào form', () => {
    cy.get('[data-testid="username-input"]')
      .type('testuser')
      .should('have.value', 'testuser');

    cy.get('[data-testid="password-input"]')
      .type('Test123')
      .should('have.value', 'Test123');
  });

  // b) Test validation messages - Client side validation (0.5 điểm)
  it('b) Nên hiển thị validation error khi submit form rỗng', () => {
    cy.get('[data-testid="login-button"]').click();

    // Kiểm tra cả 2 validation messages
    cy.contains('Username không được để trống').should('be.visible');
    cy.contains('Password không được để trống').should('be.visible');
  });

  // b) Test validation với username quá ngắn
  it('b) Nên hiển thị lỗi validation với username không hợp lệ', () => {
    cy.get('[data-testid="username-input"]').type('ab');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Username phải có ít nhất 3 ký tự').should('be.visible');
  });

  // b) Test validation với password quá ngắn
  it('b) Nên hiển thị lỗi validation với password không hợp lệ', () => {
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Password phải có ít nhất 6 ký tự').should('be.visible');
  });

  // d) Test clear error khi user nhập lại
  it('d) Nên xóa error message khi user nhập lại', () => {
    // Submit form rỗng để hiển thị error
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Username không được để trống').should('be.visible');

    // Nhập dữ liệu vào username
    cy.get('[data-testid="username-input"]').type('testuser');

    // Error phải biến mất
    cy.contains('Username không được để trống').should('not.exist');
  });

  // c) Test error flow - Server error (0.5 điểm)
it('c) Nên hiển thị lỗi khi login fail (server error)', () => {
  // Intercept API và mock error response
  cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
    statusCode: 401,
    body: {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
    }
  }).as('loginFail');

  cy.get('[data-testid="username-input"]').type('wronguser');
  cy.get('[data-testid="password-input"]').type('Wrong123'); // SỬA: thêm số để pass validation

  cy.get('[data-testid="login-button"]').click();

  // Chờ API call
  cy.wait('@loginFail');

  // Verify error message hiển thị
  cy.contains('Tên đăng nhập hoặc mật khẩu không đúng!').should('be.visible');
  
  // Verify vẫn ở trang login
  cy.url().should('include', '/login');
});

  // a) & c) Test complete login flow - Success (1 điểm)
  it('a) & c) Nên login thành công với credentials hợp lệ - Complete flow', () => {
    // Intercept API và mock success response
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Đăng nhập thành công!',
        data: {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            username: 'testuser'
          }
        }
      }
    }).as('loginSuccess');

    // Step 1: Nhập credentials
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');

    // Step 2: Submit form
    cy.get('[data-testid="login-button"]').click();

    // Step 3: Chờ API call
    cy.wait('@loginSuccess');

    // Step 4: Verify redirect đến /products (không phải /dashboard)
    cy.url().should('include', '/products');
  });

  // a) Test complete flow với loading state
  it('a) Nên hiển thị loading state khi đang login', () => {
    // Mock API với delay để test loading state
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', (req) => {
      req.reply({
        delay: 1000, // 1 second delay
        statusCode: 200,
        body: {
          success: true,
          message: 'Đăng nhập thành công!',
          data: { token: 'fake-token' }
        }
      });
    }).as('loginDelayed');

    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();

    // Verify button hiển thị loading text
    cy.get('[data-testid="login-button"]')
      .should('contain', 'Đang đăng nhập...')
      .should('be.disabled');

    cy.wait('@loginDelayed');
  });

  // d) Test navigation đến register page
  it('d) Nên navigate đến register page khi click link Đăng ký', () => {
    cy.contains('a', 'Đăng ký ngay').click();
    cy.url().should('include', '/register');
  });
});