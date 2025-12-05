package com.flogin.config;

import com.flogin.security.CustomUserDetailsService;
import com.flogin.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security Configuration
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, 
                         JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .headers(headers -> headers
//                        .frameOptions(frame -> frame.sameOrigin())                         // Clickjacking
//                        .contentTypeOptions(Customizer.withDefaults())                    // MIME sniffing
//                        .httpStrictTransportSecurity(hsts -> hsts                         // HSTS
//                                .includeSubDomains(true)
//                                .maxAgeInSeconds(31536000)
//                        )
//                        .referrerPolicy(referrer -> referrer                              // Referrer Policy
//                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)
//                        )
//                        .permissionsPolicy(policy -> policy                                // Permissions-Policy
//                                .policy("camera=(), microphone=(), geolocation=()")
//                        )
//                        .crossOriginOpenerPolicy(opener -> opener.sameOrigin())           // COOP
//                        .crossOriginEmbedderPolicy(embedder -> embedder.requireCorp())     // COEP
//                        .crossOriginResourcePolicy(resource -> resource.sameOrigin())      // CORP
//                        .contentSecurityPolicy(csp -> csp                                  // CSP
//                                .policyDirectives("default-src 'self'; script-src 'self'; img-src 'self' data:; style-src 'self'")
//                        )
//                )
//                .csrf(csrf -> csrf.disable()); // Nếu là REST API
//        return http.build();
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Chỉ disable nếu dùng JWT trong API stateless
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()
                    .requestMatchers("/api/products/**").authenticated()
                    .anyRequest().authenticated()
            )
            .headers(headers -> headers
                    .xssProtection(xss -> xss
                            .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                    )
                    .contentSecurityPolicy(csp -> csp
                            .policyDirectives(
                                    "default-src 'self'; " +
                                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                                            "style-src 'self' 'unsafe-inline'; " +
                                            "img-src 'self' data: blob:; " +
                                            "font-src 'self' data:; " +
                                            "connect-src 'self'; " +
                                            "frame-ancestors 'self'; " +
                                            "form-action 'self';"
                            )
                    )
                    .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                    .contentTypeOptions(Customizer.withDefaults())
                    .httpStrictTransportSecurity(hsts -> hsts
                            .includeSubDomains(true)
                            .preload(true)  // Thêm preload cho HSTS
                            .maxAgeInSeconds(31536000)
                    )
                    .referrerPolicy(referrer -> referrer
                            .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                    )
                    .permissionsPolicy(policy -> policy
                            .policy("camera=(), microphone=(), geolocation=(), payment=()")
                    )
            );
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://172.31.240.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
