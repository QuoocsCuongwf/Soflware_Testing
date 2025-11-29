package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.ProductRequest;
import com.flogin.dto.ProductResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.security.CustomUserDetailsService;
import com.flogin.security.JwtAuthenticationFilter;
import com.flogin.security.JwtUtils;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc
@Import(JwtAuthenticationFilter.class) 
@DisplayName("Product API Integration Tests")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtils jwtUtils;
    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    // --- Test POST /api/products (Create) ---
    @Test
    @DisplayName("POST /api/products - Tạo sản phẩm mới thành công")
    @WithMockUser(username = "testuser")
    void testCreateProduct() throws Exception {
        ProductRequest request = new ProductRequest(
            "Iphone 15", "Mô tả", new BigDecimal("30000000"), 10, "Phone", "url", true
        );

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");

        ProductResponse response = new ProductResponse(
            1L, "Iphone 15", "Mô tả", new BigDecimal("30000000"), 10, "Phone", "url", true, 1L, null, null
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(productService.createProduct(any(ProductRequest.class), eq(1L))).thenReturn(response);

        mockMvc.perform(post("/api/products")
                .with(csrf()) // Fix lỗi 403
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Tạo sản phẩm thành công!"))
            .andExpect(jsonPath("$.data.name").value("Iphone 15"));
    }

    // --- Test GET /api/products (Read all) ---
    @Test
    @DisplayName("GET /api/products - Lấy danh sách sản phẩm")
    @WithMockUser(username = "testuser")
    void testGetAllProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(
            new ProductResponse(1L, "Laptop", "Desc", new BigDecimal("15000000"), 10, "Electronics", "url", true, 1L, null, null),
            new ProductResponse(2L, "Mouse", "Desc", new BigDecimal("200000"), 50, "Accessories", "url", true, 1L, null, null)
        );

        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data", hasSize(2)))
            .andExpect(jsonPath("$.data[0].name").value("Laptop"));
    }

    // --- Test GET /api/products/{id} (Read one) ---
    @Test
    @DisplayName("GET /api/products/{id} - Lấy chi tiết sản phẩm")
    @WithMockUser(username = "testuser")
    void testGetProductById() throws Exception {
        ProductResponse product = new ProductResponse(
            1L, "Laptop Dell", "Desc", new BigDecimal("20000000"), 5, "Electronics", "url", true, 1L, null, null
        );

        when(productService.getProductById(1L)).thenReturn(product);

        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.name").value("Laptop Dell"));
    }

    // --- Test PUT /api/products/{id} (Update) ---
    @Test
    @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm")
    @WithMockUser(username = "testuser")
    void testUpdateProduct() throws Exception {
        ProductRequest request = new ProductRequest(
            "Laptop Dell Updated", "Desc", new BigDecimal("22000000"), 5, "Electronics", "url", true
        );

        ProductResponse response = new ProductResponse(
            1L, "Laptop Dell Updated", "Desc", new BigDecimal("22000000"), 5, "Electronics", "url", true, 1L, null, null
        );

        when(productService.updateProduct(eq(1L), any(ProductRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/products/1")
                .with(csrf()) 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Cập nhật sản phẩm thành công!"))
            .andExpect(jsonPath("$.data.name").value("Laptop Dell Updated"));
    }

    // --- Test DELETE /api/products/{id} (Delete) ---
    @Test
    @DisplayName("DELETE /api/products/{id} - Xóa sản phẩm")
    @WithMockUser(username = "testuser")
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1")
                .with(csrf())) // Fix lỗi 403
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Xóa sản phẩm thành công!"));
    }
}
