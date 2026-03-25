package com.sportsync.dto;

import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRequestDTO(
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Sanitized(value = SanitizationType.EMAIL, message = "Email contains invalid characters")
    String email,
    
    @NotBlank(message = "Password is required")
    String password
) {}
