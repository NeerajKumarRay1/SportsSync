package com.sportsync.dto;

import com.sportsync.entity.SkillLevel;
import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.*;
import java.util.List;

/**
 * DTO for user registration with validation constraints.
 */
public record UserRegistrationDTO(
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Sanitized(value = SanitizationType.NAME, message = "Name contains invalid characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Sanitized(value = SanitizationType.EMAIL, message = "Email contains invalid characters")
    String email,

    @NotBlank(message = "Password is required")
    String password,

    @NotNull(message = "Skill level is required")
    SkillLevel skillLevel,

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    Double latitude,

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    Double longitude,

    @NotEmpty(message = "At least one preferred sport is required")
    List<String> preferredSports
) {}