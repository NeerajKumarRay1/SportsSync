package com.sportsync.dto;

import com.sportsync.entity.SkillLevel;
import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.*;
import java.util.List;

public record UserUpdateDTO(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    @Sanitized(value = SanitizationType.NAME, message = "Name contains invalid characters")
    String name,
    
    @NotEmpty(message = "At least one preferred sport is required")
    @Size(max = 10, message = "Cannot have more than 10 preferred sports")
    List<@NotBlank(message = "Sport name cannot be blank") 
         @Size(max = 100, message = "Sport name must not exceed 100 characters")
         @Sanitized(value = SanitizationType.STRICT, message = "Sport name contains invalid characters") 
         String> preferredSports,
    
    @NotNull(message = "Skill level is required")
    SkillLevel skillLevel,
    
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    Double latitude,
    
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    Double longitude
) {}