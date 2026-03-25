package com.sportsync.service;

import com.sportsync.dto.*;
import com.sportsync.util.InputSanitizer;
import org.springframework.stereotype.Service;

/**
 * Service for sanitizing DTO objects to prevent XSS attacks.
 * This service provides methods to sanitize various DTO types used in the application.
 */
@Service
public class SanitizationService {

    /**
     * Sanitizes a UserRegistrationDTO by cleaning all string fields.
     * 
     * @param dto the DTO to sanitize
     * @return a new DTO with sanitized fields
     */
    public UserRegistrationDTO sanitize(UserRegistrationDTO dto) {
        if (dto == null) {
            return null;
        }

        return new UserRegistrationDTO(
            InputSanitizer.sanitizeName(dto.name()),
            InputSanitizer.sanitizeEmail(dto.email()),
            dto.password(), // Password is not sanitized as it should be hashed
            dto.skillLevel(),
            dto.latitude(),
            dto.longitude(),
            InputSanitizer.sanitize(dto.preferredSports())
        );
    }

    /**
     * Sanitizes an AuthRequestDTO by cleaning string fields.
     * 
     * @param dto the DTO to sanitize
     * @return a new DTO with sanitized fields
     */
    public AuthRequestDTO sanitize(AuthRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return new AuthRequestDTO(
            InputSanitizer.sanitizeEmail(dto.email()),
            dto.password() // Password is not sanitized
        );
    }

    /**
     * Sanitizes an EventCreateRequestDTO by cleaning string fields.
     * 
     * @param dto the DTO to sanitize
     * @return a new DTO with sanitized fields
     */
    public EventCreateRequestDTO sanitize(EventCreateRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return new EventCreateRequestDTO(
            dto.organizerId(),
            InputSanitizer.sanitize(dto.sportType()),
            dto.lat(),
            dto.lon(),
            dto.dateTime(),
            dto.maxPlayerCount(),
            dto.requiredSkillLevel()
        );
    }

    /**
     * Sanitizes a ReviewRequestDTO by cleaning string fields.
     * 
     * @param dto the DTO to sanitize
     * @return a new DTO with sanitized fields
     */
    public ReviewRequestDTO sanitize(ReviewRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return new ReviewRequestDTO(
            dto.reviewerId(),
            dto.revieweeId(),
            dto.eventId(),
            dto.rating(),
            InputSanitizer.sanitize(dto.comment())
        );
    }

    /**
     * Sanitizes a ChatMessageDTO by cleaning string fields.
     * 
     * @param dto the DTO to sanitize
     * @return a new DTO with sanitized fields
     */
    public ChatMessageDTO sanitize(ChatMessageDTO dto) {
        if (dto == null) {
            return null;
        }

        return new ChatMessageDTO(
            dto.senderId(),
            InputSanitizer.sanitizeName(dto.senderName()),
            InputSanitizer.sanitize(dto.content()),
            dto.timestamp()
        );
    }
}