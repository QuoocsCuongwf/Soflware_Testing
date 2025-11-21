package com.flogin.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Product Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm không quá 200 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả không quá 1000 ký tự")
    private String description;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    @Size(max = 50, message = "Danh mục không quá 50 ký tự")
    private String category;

    @Size(max = 500, message = "URL hình ảnh không quá 500 ký tự")
    private String imageUrl;

    private Boolean isAvailable = true;
}
