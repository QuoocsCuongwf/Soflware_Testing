package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.RegisterRequest;
import com.flogin.dto.AuthResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Auth Service - Service xử lý logic đăng nhập, đăng ký
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    /**
     * Đăng ký người dùng mới
     */
    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }

        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // Tạo user mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole("USER");
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Tạo JWT token
        String token = jwtUtils.generateToken(savedUser.getUsername());

        return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );
    }

    /**
     * Đăng nhập
     */
    public AuthResponse login(LoginRequest request) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        // Lấy thông tin user
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));

        // Tạo JWT token
        String token = jwtUtils.generateToken(user.getUsername());

        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
}
