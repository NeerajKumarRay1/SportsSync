package com.sportsync.dto;

import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.*;

public record ReviewRequestDTO(
    @NotNull(message = "Reviewer ID is required")
    Long reviewerId,
    
    @NotNull(message = "Reviewee ID is required")
    Long revieweeId,
    
    @NotNull(message = "Event ID is required")
    Long eventId,
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    Integer rating,
    
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    @Sanitized(value = SanitizationType.STRICT, message = "Comment contains invalid characters")
    String comment
) {}
