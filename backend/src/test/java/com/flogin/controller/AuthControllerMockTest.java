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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest( AuthController . class )
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {
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
    void TC_LOGIN_001() throws Exception {
        AuthResponse mockResponse = new AuthResponse(
                "token123",
                1L,
                "testuser",
                "test@gmail.com",
                "USER"
        );

        when(authService.login(any()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk());
        verify (authService,times(1)).login(any());
    }

	@Test
	void TC_LOGIN_002() throws Exception {
        LoginRequest loginRequest = new LoginRequest("", "Test123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(result ->
                assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
        verify(authService,  never()).login(any(LoginRequest.class));
	}

    @Test
	void TC_LOGIN_003() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin123", "");
        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(result ->
                    assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
        verify(authService,  never()).login(any(LoginRequest.class));
	}


    @Test
	void TC_LOGIN_004() throws Exception {
        LoginRequest loginRequest = new LoginRequest("testuser", "password");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(result ->
                assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
        verify(authService,  never()).login(any(LoginRequest.class));
	}

    @Test
	void TC_LOGIN_005() throws Exception {
        String longUsername = "a".repeat(51);
        LoginRequest loginRequest = new LoginRequest(longUsername, "password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(result ->
                assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
        verify(authService,  never()).login(any(LoginRequest.class));
	}

}
