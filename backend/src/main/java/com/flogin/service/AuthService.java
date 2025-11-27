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
        validateLoginRequest(request);
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

    private void validateLoginRequest(LoginRequest loginRequest) {
        // Kiểm tra null và empty
        if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username không được để trống");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password không được để trống");
        }

        String username = loginRequest.getUsername().trim();
        String password = loginRequest.getPassword();

        // Validate độ dài username
        if (username.length() < 3 || username.length() > 50) {
            throw new IllegalArgumentException("Username phải từ 3-50 ký tự");
        }

        // Validate độ dài password
        if (password.length() < 6 || password.length() > 100) {
            throw new IllegalArgumentException("Password phải từ 6-100 ký tự");
        }

        // Validate format username: chỉ cho phép chữ cái, số, ., -, _
        if (!username.matches("^[A-Za-z0-9._-]+$")) {
            throw new IllegalArgumentException("Username chỉ được chứa chữ cái, số, dấu chấm (.), dấu gạch ngang (-), dấu gạch dưới (_)");
        }

        // Validate format password: ít nhất 1 chữ cái và 1 chữ số
        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d).+$")) {
            throw new IllegalArgumentException("Password phải chứa ít nhất 1 chữ cái và 1 chữ số");
        }

        // Validate không có khoảng trắng ở đầu/cuối username (đã trim nên không cần)
        // Validate không chứa khoảng trắng trong username
        if (username.contains(" ")) {
            throw new IllegalArgumentException("Username không được chứa khoảng trắng");
        }

        // Validate username không bắt đầu bằng ký tự đặc biệt
        if (username.matches("^[._-].*")) {
            throw new IllegalArgumentException("Username không được bắt đầu bằng ký tự đặc biệt (. _ -)");
        }

        // Validate username không kết thúc bằng ký tự đặc biệt
        if (username.matches(".*[._-]$")) {
            throw new IllegalArgumentException("Username không được kết thúc bằng ký tự đặc biệt (. _ -)");
        }

        // Validate không có nhiều ký tự đặc biệt liên tiếp
        if (username.matches(".*[._-]{2,}.*")) {
            throw new IllegalArgumentException("Username không được có nhiều ký tự đặc biệt liên tiếp");
        }
    }

    public boolean validateUsername(String username) {
        if (username == null) return false;
        return username.matches("^[A-Za-z0-9._-]{3,50}$");
    }

    public boolean validatePassword(String password) {
        if (password == null || password.length() < 6 || password.length() > 100) {
            return false;
        }
        return password.matches("^(?=.*[A-Za-z])(?=.*\\d).+$");
    }
}
