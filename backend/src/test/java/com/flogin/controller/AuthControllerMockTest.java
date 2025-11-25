package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.AuthResponse;
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
    void testLoginWithMockedService() throws Exception {
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
}
