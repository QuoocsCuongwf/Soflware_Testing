/* eslint-disable testing-library/await-async-utils, no-undef */ // Disable misapplied RTL rules cho Cypress globals

describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login'); // Adjust nếu route khác
  });

  it('Nên hiển thị form login', () => {
    cy.get('[data-testid="username-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('Nên hiển thị lỗi với credentials không hợp lệ', () => {
    cy.get('[data-testid="username-input"]').type('ab');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="username-error"]').should('be.visible');
    // Thêm check password error nếu cần, ví dụ: cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('Nên login thành công với credentials hợp lệ', () => {
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="login-message"]').should('contain', 'thanh cong'); // Adjust exact message từ code
    cy.url().should('include', '/dashboard');
  });
});