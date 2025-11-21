package com.flogin.service;

import com.flogin.dto.ProductRequest;
import com.flogin.dto.ProductResponse;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Product Service - Service xử lý logic sản phẩm
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Lấy tất cả sản phẩm
     */
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Lấy sản phẩm theo ID
     */
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToResponse(product);
    }

    /**
     * Tạo sản phẩm mới
     */
    public ProductResponse createProduct(ProductRequest request, Long userId) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setIsAvailable(request.getIsAvailable());
        product.setCreatedBy(userId);

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    /**
     * Cập nhật sản phẩm
     */
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setIsAvailable(request.getIsAvailable());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    /**
     * Xóa sản phẩm
     */
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        productRepository.delete(product);
    }

    /**
     * Tìm kiếm sản phẩm theo tên
     */
    public List<ProductResponse> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    /**
     * Map Product entity sang ProductResponse
     */
    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setCategory(product.getCategory());
        response.setImageUrl(product.getImageUrl());
        response.setIsAvailable(product.getIsAvailable());
        response.setCreatedBy(product.getCreatedBy());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
}
