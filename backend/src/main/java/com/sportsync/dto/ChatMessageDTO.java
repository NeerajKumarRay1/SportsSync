package com.sportsync.dto;

import com.sportsync.validation.Sanitized;
import com.sportsync.validation.SanitizationType;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record ChatMessageDTO(
    @NotNull(message = "Sender ID is required")
    Long senderId,
    
    @NotBlank(message = "Sender name is required")
    @Size(max = 255, message = "Sender name must not exceed 255 characters")
    @Sanitized(value = SanitizationType.NAME, message = "Sender name contains invalid characters")
    String senderName,
    
    @NotBlank(message = "Message content is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    @Sanitized(value = SanitizationType.STRICT, message = "Message contains invalid characters")
    String content,
    
    LocalDateTime timestamp
) {}
