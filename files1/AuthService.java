package com.sportsync.service;

import com.sportsync.dto.AuthResponse;
import com.sportsync.dto.LoginRequest;
import com.sportsync.dto.RegisterRequest;
import com.sportsync.entity.User;
import com.sportsync.exception.AuthenticationException;
import com.sportsync.repository.UserRepository;
import com.sportsync.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Validates credentials and returns a signed JWT.
     * Throws AuthenticationException (→ HTTP 401) on bad credentials.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user.getId().toString(), user.getEmail());
        return new AuthResponse(token, user.getId().toString(), user.getEmail(), user.getDisplayName());
    }

    /**
     * Creates a new user, hashes password with BCrypt, returns a signed JWT.
     * Throws ValidationException (→ HTTP 409) if email already exists.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.sportsync.exception.ValidationException("Email already in use.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getDisplayName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Set sensible defaults
        user.setReputationScore(0);
        user.setSkillLevel(1);

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId().toString(), saved.getEmail());
        return new AuthResponse(token, saved.getId().toString(), saved.getEmail(), saved.getDisplayName());
    }
}
