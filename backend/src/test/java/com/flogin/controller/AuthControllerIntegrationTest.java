package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.AuthResponse;
import com.flogin.dto.LoginRequest;
import com.flogin.security.CustomUserDetailsService;
import com.flogin.security.JwtAuthenticationFilter;
import com.flogin.security.JwtUtils;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest(
                "testuser", "Test123"
        );

        AuthResponse mockResponse = new AuthResponse(
                "token123",
                1L,
                "testuser",
                "test@gmail.com",
                "USER"
        );

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
        .andExpect(jsonPath("$.data.token").value("token123"))
        .andExpect(jsonPath("$.data.id").value(1L))
        .andExpect(jsonPath("$.data.username").value("testuser"))
        .andExpect(jsonPath("$.data.email").value("test@gmail.com"))
        .andExpect(jsonPath("$.data.role").value("USER"));
    }

    @Test
    void testLoginFailed_UsernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest (
                "unknownUser",
                "Test123"
        );

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("User khong ton tai"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(jsonPath("$.message").value("User khong ton tai"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginFailed_PasswordIncorrect() throws Exception {
        LoginRequest loginRequestDTO = new LoginRequest(
                "admin123",
                "wrongPassword123"
        );
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Mat khau khong dung"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(jsonPath("$.message").value("Mat khau khong dung"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginFailed_InvalidPassword() throws Exception {
        LoginRequest loginRequestDTO = new LoginRequest("admin123", "221123"	);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
        .andExpect(status().isBadRequest())
        .andExpect(result ->
                assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException)
        );
     }

    @Test
    void testLoginResponseStructure() throws Exception {
        LoginRequest request = new LoginRequest(
                "testuser", "Test123"
        );

        AuthResponse mockResponse = new AuthResponse(
                "token123",
                1L,
                "testuser",
                "test@gmail.com",
                "USER"
        );

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.data.email").exists())
                .andExpect(jsonPath("$.data.role").exists());
    }

    @Test
    void testLoginMissingFields() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCORSHeaders() throws Exception {
        mockMvc.perform(
                        org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                                .options("/api/auth/login")
                                .header("Origin", "http://localhost:3000")
                                .header("Access-Control-Request-Method", "POST")
                )
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("POST")));
    }
@Test
 void  testCORSHeaders_POST()  throws  Exception {
	mockMvc.perform(post("/api/auth/login")
	.contentType(MediaType.APPLICATION_JSON)
	.header("Origin", "http://localhost:3000")
	.header("Access-Control-Request-Method",  "POST")
	.header("Access-Control-Request-Headers",  "content-type")
	.content(objectMapper.writeValueAsString(new LoginRequest("admin123", "admin123"))))
	.andExpect(status().isOk());

 }

}
