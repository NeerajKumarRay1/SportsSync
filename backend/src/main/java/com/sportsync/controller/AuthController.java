package com.sportsync.controller;

import com.sportsync.dto.AuthResponse;
import com.sportsync.dto.LoginRequest;
import com.sportsync.dto.RegisterRequest;
import com.sportsync.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Validates credentials, returns a signed JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register
     * Creates a new user account and returns a signed JWT.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/logout
     * Optional: add token to a blocklist if you want server-side invalidation.
     * The frontend clears its in-memory token regardless of this response.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless JWT — no server-side action required unless using a blocklist.
        return ResponseEntity.noContent().build();
    }
}
