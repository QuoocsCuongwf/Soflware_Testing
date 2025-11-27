class ProductPage {
  // --- 1. NAVIGATION ---
  visit() {
    // Truy cập trang chủ hoặc trang danh sách sản phẩm
    cy.visit('/'); 
  }

  // --- 2. ACTIONS (Hành động) ---
  
  // Click nút "Thêm sản phẩm" màu xanh
  clickAddNew() {
    cy.contains('button', 'Thêm sản phẩm').click();
  }

  // Điền form (Dùng ID từ code HTML của bạn để chính xác nhất)
  fillProductForm(product) {
    if (product.name) {
      cy.get('#product-name').should('be.visible').clear().type(product.name);
    }
    if (product.price) {
      cy.get('#product-price').clear().type(product.price);
    }
    if (product.quantity) {
      cy.get('#product-quantity').clear().type(product.quantity);
    }
    if (product.category) {
      cy.get('#product-category').clear().type(product.category);
    }
  }

  // Click nút Lưu/Thêm mới trong Modal
  submitForm() {
    // Tìm nút có type="submit" trong modal
    cy.get('.modal-content button[type="submit"]').click();
  }

  // Tìm kiếm sản phẩm
  searchProduct(keyword) {
    cy.get('.search-box input').clear().type(keyword);
    cy.get('.search-box button').contains('Tìm kiếm').click();
    // Chờ một chút để kết quả lọc hiển thị (nếu API chậm)
    cy.wait(500); 
  }

  // --- 3. ELEMENTS (Lấy phần tử) ---

  // Lấy thẻ Card của 1 sản phẩm cụ thể theo tên
getProductCard(productName) {
    // Chỉ cần contains là đủ để lấy thẻ card rồi
    return cy.contains('.product-card', productName); 
}

  // Click nút Sửa của 1 sản phẩm cụ thể
  clickEditProduct(productName) {
    this.getProductCard(productName).find('.btn-primary').contains('Sửa').click();
  }

  // Click nút Xóa của 1 sản phẩm cụ thể
  clickDeleteProduct(productName) {
    this.getProductCard(productName).find('.btn-danger').contains('Xóa').click();
  }

  // Tự động bấm OK khi browser hiện popup xác nhận xóa
  acceptDeleteConfirmation() {
    cy.on('window:confirm', () => true);
  }
}

export default ProductPage;