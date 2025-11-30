package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.RegisterRequest;
import com.flogin.dto.AuthResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * AuthService Tests - Test cho AuthService
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("test@example.com");
        registerRequest.setFullName("Test User");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setRole("USER");
        user.setIsActive(true);
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtils.generateToken(anyString())).thenReturn("fake-jwt-token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("USER", response.getRole());

        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository).save(any(User.class));
        verify(jwtUtils).generateToken("testuser");
    }

    @Test
    void testRegister_UsernameExists() {
        // Arrange
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals("Username đã tồn tại!", exception.getMessage());
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_EmailExists() {
        // Arrange
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals("Email đã tồn tại!", exception.getMessage());
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken(anyString())).thenReturn("fake-jwt-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByUsername("testuser");
        verify(jwtUtils).generateToken("testuser");
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("User không tồn tại!", exception.getMessage());
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void testLogin_WrongPassword() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Bad credentials", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils, never()).generateToken(anyString());
    }

    //Validation errors
    @Nested
    class LoginRequestValidationTest {

        @Test
        void testValidation_NullUsername() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername(null);
            request.setPassword("Password123");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Username không được để trống", exception.getMessage());
        }

        @Test
        void testValidation_EmptyUsername() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("   ");
            request.setPassword("Password123");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Username không được để trống", exception.getMessage());
        }

        @Test
        void testValidation_NullPassword() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword(null);

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password không được để trống", exception.getMessage());
        }

        @Test
        void testValidation_EmptyPassword() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("   ");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password không được để trống", exception.getMessage());
        }

        @Test
        void testValidation_UsernameTooShort() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("ab");
            request.setPassword("Password123");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Username phải từ 3-50 ký tự", exception.getMessage());
        }

        @Test
        void testValidation_UsernameTooLong() {
            // Arrange
            String longUsername = "a".repeat(51);
            LoginRequest request = new LoginRequest();
            request.setUsername(longUsername);
            request.setPassword("Password123");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Username phải từ 3-50 ký tự", exception.getMessage());
        }

        @Test
        void testValidation_PasswordTooShort() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("pass1");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password phải từ 6-100 ký tự", exception.getMessage());
        }

        @Test
        void testValidation_PasswordTooLong() {
            // Arrange
            String longPassword = "a".repeat(101);
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword(longPassword);

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password phải từ 6-100 ký tự", exception.getMessage());
        }

        @Test
        void testValidation_UsernameInvalidCharacters() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("user@name");
            request.setPassword("Password123");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Username chỉ được chứa chữ cái, số, dấu chấm (.), dấu gạch ngang (-), dấu gạch dưới (_)", exception.getMessage());
        }

        @Test
        void testValidation_PasswordNoLetters() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("123456");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password phải chứa ít nhất 1 chữ cái và 1 chữ số", exception.getMessage());
        }

        @Test
        void testValidation_PasswordNoDigits() {
            // Arrange
            LoginRequest request = new LoginRequest();
            request.setUsername("testuser");
            request.setPassword("password");

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> authService.login(request));
            assertEquals("Password phải chứa ít nhất 1 chữ cái và 1 chữ số", exception.getMessage());
        }

        @Test
        void testValidation_UsernameStartsWithSpecialChar() {
            // Arrange
            LoginRequest request1 = new LoginRequest();
            request1.setUsername(".testuser");
            request1.setPassword("Password123");
            LoginRequest request2 = new LoginRequest();
            request2.setUsername("-testuser");
            request2.setPassword("Password123");
            LoginRequest request3 = new LoginRequest();
            request3.setUsername("_testuser");
            request3.setPassword("Password123");

            // Act & Assert
            assertAll(
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request1)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request2)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request3))
            );
        }

        @Test
        void testValidation_UsernameEndsWithSpecialChar() {
            // Arrange
            LoginRequest request1 = new LoginRequest();
            request1.setUsername("testuser.");
            request1.setPassword("Password123");
            LoginRequest request2 = new LoginRequest();
            request2.setUsername("testuser-");
            request2.setPassword("Password123");
            LoginRequest request3 = new LoginRequest();
            request3.setUsername("testuser_");
            request3.setPassword("Password123");

            // Act & Assert
            assertAll(
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request1)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request2)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request3))
            );
        }

        @Test
        void testValidation_UsernameConsecutiveSpecialChars() {
            // Arrange
            LoginRequest request1 = new LoginRequest();
            request1.setUsername("test..user");
            request1.setPassword("Password123");
            LoginRequest request2 = new LoginRequest();
            request2.setUsername("test--user");
            request2.setPassword("Password123");
            LoginRequest request3 = new LoginRequest();
            request3.setUsername("test__user");
            request3.setPassword("Password123");
            LoginRequest request4 = new LoginRequest();
            request4.setUsername("test.-user");
            request4.setPassword("Password123");

            // Act & Assert
            assertAll(
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request1)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request2)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request3)),
                    () -> assertThrows(IllegalArgumentException.class, () -> authService.login(request4))
            );
        }
    }

    @Nested
    class ValidationMethodsTests {
        @Test
        void testValidateUsername_ValidCases() {
            assertTrue(authService.validateUsername("user123"));
            assertTrue(authService.validateUsername("test.user"));
            assertTrue(authService.validateUsername("test-user"));
            assertTrue(authService.validateUsername("test_user"));
            assertTrue(authService.validateUsername("User.Name-123"));
        }

        @Test
        void testValidateUsername_InvalidCases() {
            assertFalse(authService.validateUsername("us")); // quá ngắn
            assertFalse(authService.validateUsername("a".repeat(51))); // quá dài
            assertFalse(authService.validateUsername("user@name")); // ký tự đặc biệt
            assertFalse(authService.validateUsername("user name")); // khoảng trắng
            assertFalse(authService.validateUsername("")); // trống
            assertFalse(authService.validateUsername(null)); // null
        }

        @Test
        void testValidatePassword_ValidCases() {
            assertTrue(authService.validatePassword("Pass123"));
            assertTrue(authService.validatePassword("TEST123"));
            assertTrue(authService.validatePassword("abc123"));
            assertTrue(authService.validatePassword("123ABC"));
            assertTrue(authService.validatePassword("P@ssw0rd123"));
        }

        @Test
        void testValidatePassword_InvalidCases() {
            assertFalse(authService.validatePassword("pass")); // quá ngắn
            assertFalse(authService.validatePassword("a".repeat(101))); // quá dài
            assertFalse(authService.validatePassword("password")); // thiếu số
            assertFalse(authService.validatePassword("123456")); // thiếu chữ
            assertFalse(authService.validatePassword("")); // trống
            assertFalse(authService.validatePassword(null)); // null
        }
    }
}