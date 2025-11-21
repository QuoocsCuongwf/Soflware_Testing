package com.flogin.service;

import com.flogin.dto.ProductRequest;
import com.flogin.dto.ProductResponse;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * ProductService Tests - Test cho ProductService
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Laptop Dell XPS");
        product.setDescription("High-end laptop");
        product.setPrice(new BigDecimal("25000000"));
        product.setQuantity(10);
        product.setCategory("Electronics");
        product.setImageUrl("http://example.com/laptop.jpg");
        product.setIsAvailable(true);
        product.setCreatedBy(1L);

        productRequest = new ProductRequest();
        productRequest.setName("Laptop Dell XPS");
        productRequest.setDescription("High-end laptop");
        productRequest.setPrice(new BigDecimal("25000000"));
        productRequest.setQuantity(10);
        productRequest.setCategory("Electronics");
        productRequest.setImageUrl("http://example.com/laptop.jpg");
        productRequest.setIsAvailable(true);
    }

    @Test
    void testGetAllProducts() {
        // Arrange
        List<Product> products = Arrays.asList(product);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<ProductResponse> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop Dell XPS", result.get(0).getName());
        verify(productRepository).findAll();
    }

    @Test
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));

        // Act
        ProductResponse result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laptop Dell XPS", result.getName());
        verify(productRepository).findById(1L);
    }

    @Test
    void testGetProductById_NotFound() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(999L);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy sản phẩm"));
        verify(productRepository).findById(999L);
    }

    @Test
    void testCreateProduct() {
        // Arrange
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        ProductResponse result = productService.createProduct(productRequest, 1L);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Dell XPS", result.getName());
        assertEquals(new BigDecimal("25000000"), result.getPrice());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_Success() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        ProductResponse result = productService.updateProduct(1L, productRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop Dell XPS", result.getName());
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_NotFound() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(999L, productRequest);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy sản phẩm"));
        verify(productRepository).findById(999L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testDeleteProduct_Success() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));
        doNothing().when(productRepository).delete(any(Product.class));

        // Act
        productService.deleteProduct(1L);

        // Assert
        verify(productRepository).findById(1L);
        verify(productRepository).delete(product);
    }

    @Test
    void testDeleteProduct_NotFound() {
        // Arrange
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(999L);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy sản phẩm"));
        verify(productRepository).findById(999L);
        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    void testSearchProducts() {
        // Arrange
        List<Product> products = Arrays.asList(product);
        when(productRepository.findByNameContainingIgnoreCase(anyString())).thenReturn(products);

        // Act
        List<ProductResponse> result = productService.searchProducts("Laptop");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop Dell XPS", result.get(0).getName());
        verify(productRepository).findByNameContainingIgnoreCase("Laptop");
    }

    @Test
    void testGetProductsByCategory() {
        // Arrange
        List<Product> products = Arrays.asList(product);
        when(productRepository.findByCategory(anyString())).thenReturn(products);

        // Act
        List<ProductResponse> result = productService.getProductsByCategory("Electronics");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Electronics", result.get(0).getCategory());
        verify(productRepository).findByCategory("Electronics");
    }
}
