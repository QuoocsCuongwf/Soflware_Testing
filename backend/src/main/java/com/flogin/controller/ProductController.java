package com.flogin.controller;

import com.flogin.dto.ApiResponse;
import com.flogin.dto.ProductRequest;
import com.flogin.dto.ProductResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Product Controller - REST API cho quản lý sản phẩm
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    public ProductController(ProductService productService, UserRepository userRepository) {
        this.productService = productService;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/products - Lấy tất cả sản phẩm
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductResponse> products = productService.getAllProducts();
            return ResponseEntity.ok(new ApiResponse(true, "Lấy danh sách sản phẩm thành công!", products));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * GET /api/products/{id} - Lấy sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Lấy sản phẩm thành công!", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * POST /api/products - Tạo sản phẩm mới
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request,
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
            
            ProductResponse product = productService.createProduct(request, user.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Tạo sản phẩm thành công!", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * PUT /api/products/{id} - Cập nhật sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                          @Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse product = productService.updateProduct(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Cập nhật sản phẩm thành công!", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * DELETE /api/products/{id} - Xóa sản phẩm
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse(true, "Xóa sản phẩm thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * GET /api/products/search?name=xxx - Tìm kiếm sản phẩm
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String name) {
        try {
            List<ProductResponse> products = productService.searchProducts(name);
            return ResponseEntity.ok(new ApiResponse(true, "Tìm kiếm thành công!", products));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * GET /api/products/category/{category} - Lấy sản phẩm theo danh mục
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String category) {
        try {
            List<ProductResponse> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(new ApiResponse(true, "Lấy sản phẩm theo danh mục thành công!", products));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
