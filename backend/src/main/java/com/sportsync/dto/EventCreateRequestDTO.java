package com.sportsync.dto;

import com.sportsync.entity.SkillLevel;
import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record EventCreateRequestDTO(
    @NotNull(message = "Organizer ID is required")
    @Positive(message = "Organizer ID must be positive")
    Long organizerId,
    
    @NotBlank(message = "Sport type is required")
    @Size(max = 100, message = "Sport type must not exceed 100 characters")
    @Sanitized(value = SanitizationType.STRICT, message = "Sport type contains invalid characters")
    String sportType,
    
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    Double lat,
    
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    Double lon,
    
    @NotNull(message = "Date and time is required")
    @Future(message = "Event date must be in the future")
    LocalDateTime dateTime,
    
    @NotNull(message = "Max player count is required")
    @Min(value = 2, message = "Event must allow at least 2 players")
    @Max(value = 100, message = "Event cannot exceed 100 players")
    Integer maxPlayerCount,
    
    @NotNull(message = "Required skill level is required")
    SkillLevel requiredSkillLevel
) {}
