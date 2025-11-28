import ProductPage from '../support/pages/ProductPage.js';

describe('Product Management E2E Tests', () => {
  const productPage = new ProductPage();
  
  // DỮ LIỆU TEST ĐỘNG
  // Dùng Date.now() để tạo tên duy nhất, tránh lỗi trùng lặp khi chạy lại test nhiều lần
  const timestamp = Date.now();
  const testProduct = {
    name: `Iphone Test ${timestamp}`,
    price: '20000000',
    quantity: '100',
    category: 'Test Device'
  };

  beforeEach(() => {
    // Chạy trước mỗi test case
    cy.login('testuser', 'admin123');
    productPage.visit();
  });

  // --- Kịch bản A: CREATE (Thêm mới) ---
  it('A. Should create a new product successfully', () => {
    productPage.clickAddNew();
    
    // Kiểm tra modal hiện lên
    cy.get('.modal-content').should('be.visible');

    // Điền form và submit
    productPage.fillProductForm(testProduct);
    productPage.submitForm();

    // Verify: Modal đóng và sản phẩm xuất hiện
    cy.get('.modal-content').should('not.exist');
    cy.contains('.product-card', testProduct.name).should('be.visible');
  });

  // --- Kịch bản B: READ (Xem danh sách) ---
  it('B. Should display product list', () => {
    // Kiểm tra lưới sản phẩm tồn tại
    cy.get('.products-grid').should('exist');
    // Kiểm tra có ít nhất 1 sản phẩm đang hiển thị
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  // --- Kịch bản E: SEARCH (Tìm kiếm) ---
  // Lưu ý: Đưa Search lên trước Update/Delete để dễ test
  it('E. Should search for the product correctly', () => {
    productPage.searchProduct(testProduct.name);

    // Verify: Chỉ sản phẩm khớp tên mới hiện ra
    cy.contains('.product-card', testProduct.name).should('be.visible');
    
    // Nếu bạn muốn check kỹ hơn: Kiểm tra số lượng card hiển thị ít đi
    // cy.get('.product-card').should('have.length', 1);
  });

  // --- Kịch bản C: UPDATE (Cập nhật) ---
  it('C. Should update the product price', () => {
    // Reload lại để chắc chắn hiển thị đủ danh sách trước khi sửa
    productPage.visit(); 
    
    const newPrice = '25000000';

    productPage.clickEditProduct(testProduct.name);
    
    // Form hiện ra, sửa giá
    cy.get('#product-price').should('be.visible').clear().type(newPrice);
    
    productPage.submitForm();

    // Verify: Giá mới hiển thị trên card (kiểm tra text chứa số 25)
    cy.contains('.product-card', testProduct.name)
      .should('contain', '25'); 
  });

  // --- Kịch bản D: DELETE (Xóa) ---
  it('D. Should delete the product', () => {
    productPage.visit();
    
    // Setup tự động click OK cho popup confirm
    productPage.acceptDeleteConfirmation();

    productPage.clickDeleteProduct(testProduct.name);

    // Verify: Sản phẩm biến mất khỏi danh sách
    cy.contains('.product-card', testProduct.name).should('not.exist');
  });

});