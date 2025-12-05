import ProductPage from '../support/pages/ProductPage.js';

describe('Product Management E2E Tests', () => {
  const productPage = new ProductPage();
  const timestamp = Date.now();
  const testProduct = {
    name: `Iphone Test ${timestamp}`,
    price: '20000000',
    quantity: '100',
    category: 'Test Device'
  };

  beforeEach(() => {
    cy.login('testuser', 'admin123');
    productPage.visit();
  });

  it('A. Should create a new product successfully', () => {
    productPage.clickAddNew();
    cy.get('.modal-content').should('be.visible');
    productPage.fillProductForm(testProduct);
    productPage.submitForm();
    cy.get('.modal-content').should('not.exist');
    cy.contains('.product-card', testProduct.name).should('be.visible');
  });

  it('B. Should display product list', () => {
    cy.get('.products-grid').should('exist');
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  it('E. Should search for the product correctly', () => {
    productPage.searchProduct(testProduct.name);
    cy.contains('.product-card', testProduct.name).should('be.visible');
  });

  it('C. Should update the product price', () => {
    productPage.visit();
    const newPrice = '25000000';
    productPage.clickEditProduct(testProduct.name);
    cy.get('#product-price').should('be.visible').clear().type(newPrice);
    productPage.submitForm();
    cy.contains('.product-card', testProduct.name).should('contain', '25');
  });

  it('D. Should delete the product', () => {
    productPage.visit();
    productPage.acceptDeleteConfirmation();
    productPage.clickDeleteProduct(testProduct.name);
    cy.contains('.product-card', testProduct.name).should('not.exist');
  });
});