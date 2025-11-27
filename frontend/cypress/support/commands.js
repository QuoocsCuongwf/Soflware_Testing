// cypress/support/commands.js

Cypress.Commands.add('login', (username, password) => {
  // 1. Truy cập trang đăng nhập (Giả sử đường dẫn là /login hoặc /)
  // Bạn hãy sửa lại thành '/' nếu trang chủ là trang login
  cy.visit('/login'); 

  // 2. Điền Username
  // Component của bạn dùng <input name="username" ... />
  cy.get('input[name="username"]')
    .should('be.visible')
    .clear()
    .type(username);

  // 3. Điền Password
  // Component của bạn dùng <input name="password" ... />
  cy.get('input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password);

  // 4. Click nút Đăng nhập
  // Component dùng <button type="submit" ...>
  cy.get('button[type="submit"]').click();

  // 5. Kiểm tra đăng nhập thành công
  // Logic trong Login.js là: navigate('/products')
  // Nên ta kiểm tra xem URL có chứa '/products' không
  cy.url().should('include', '/products');
});