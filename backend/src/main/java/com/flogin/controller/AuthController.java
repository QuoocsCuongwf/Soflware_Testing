package com.flogin.controller;

import com.flogin.dto.ApiResponse;
import com.flogin.dto.AuthResponse;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.RegisterRequest;
import com.flogin.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Auth Controller - REST API cho xác thực
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register - Đăng ký
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(new ApiResponse(true, "Đăng ký thành công!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login - Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(new ApiResponse(true, "Đăng nhập thành công!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Tên đăng nhập hoặc mật khẩu không đúng!"));
        }
    }

    /**
     * GET /api/auth/test - Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(new ApiResponse(true, "Auth API is working!"));
    }
}
