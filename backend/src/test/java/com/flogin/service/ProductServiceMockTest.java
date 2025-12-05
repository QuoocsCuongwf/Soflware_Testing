package com.flogin.service;

import com.flogin.dto.ProductRequest;
import com.flogin.dto.ProductResponse;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceMockTest {

    // Mock ProductRepository
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product mockProduct;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Laptop Mock");
        mockProduct.setPrice(new BigDecimal("15000000"));
        mockProduct.setQuantity(5);
        mockProduct.setCategory("Electronics");
        mockProduct.setIsAvailable(true);

        productRequest = new ProductRequest();
        productRequest.setName("Laptop Mock");
        productRequest.setPrice(new BigDecimal("15000000"));
        productRequest.setQuantity(5);
        productRequest.setCategory("Electronics");
    }

    // Test service layer với mocked repository
    @Test
    @DisplayName("Mock: Get Product By ID - Success")
    void testGetProductById() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // Act
        ProductResponse result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Mock", result.getName());
        assertEquals(new BigDecimal("15000000"), result.getPrice());

        // Verify repository interactions
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Mock: Create Product - Success")
    void testCreateProduct() {
        // Arrange
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductResponse result = productService.createProduct(productRequest, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Mock", result.getName());

        // Verify repository interactions
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Delete Product - Success")
    void testDeleteProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        
        // Act
        productService.deleteProduct(1L);

        // Assert & Verify
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).delete(mockProduct);
    }

    @Test
    @DisplayName("Mock: Update Product - Success")
    void testUpdateProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductResponse result = productService.updateProduct(1L, productRequest);

        // Assert
        assertNotNull(result);
        
        // Verify flow: Find -> Save
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }
}