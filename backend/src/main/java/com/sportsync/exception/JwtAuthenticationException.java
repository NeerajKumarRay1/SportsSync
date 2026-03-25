package com.sportsync.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Custom exception for JWT authentication failures.
 * Extends Spring Security's AuthenticationException for proper integration.
 */
public class JwtAuthenticationException extends AuthenticationException {

    public JwtAuthenticationException(String message) {
        super(message);
    }

    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}