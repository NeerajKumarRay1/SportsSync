package com.sportsync.service;

import com.sportsync.dto.*;
import com.sportsync.entity.SkillLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for SanitizationService.
 */
class SanitizationServiceTest {

    private SanitizationService sanitizationService;

    @BeforeEach
    void setUp() {
        sanitizationService = new SanitizationService();
    }

    @Test
    @DisplayName("Should sanitize UserRegistrationDTO")
    void shouldSanitizeUserRegistrationDTO() {
        UserRegistrationDTO dto = new UserRegistrationDTO(
            "<b>John Doe</b>",
            "<b>TEST@EXAMPLE.COM</b>",
            "password123",
            SkillLevel.INTERMEDIATE,
            40.7128,
            -74.0060,
            Arrays.asList("<i>Soccer</i>", "Basketball")
        );

        UserRegistrationDTO sanitized = sanitizationService.sanitize(dto);      

        assertEquals("John Doe", sanitized.name());
        assertEquals("test@example.com", sanitized.email());
        assertEquals("password123", sanitized.password()); 
        assertEquals(SkillLevel.INTERMEDIATE, sanitized.skillLevel());
        assertEquals(40.7128, sanitized.latitude());
        assertEquals(-74.0060, sanitized.longitude());
        assertEquals("Soccer", sanitized.preferredSports().get(0));
        assertEquals("Basketball", sanitized.preferredSports().get(1));
    }

    @Test
    @DisplayName("Should handle null UserRegistrationDTO")
    void shouldHandleNullUserRegistrationDTO() {
        UserRegistrationDTO result = sanitizationService.sanitize((UserRegistrationDTO) null);                                                                          
        assertNull(result);
    }

    @Test
    @DisplayName("Should sanitize AuthRequestDTO")
    void shouldSanitizeAuthRequestDTO() {
        AuthRequestDTO dto = new AuthRequestDTO(
            "<b>TEST@EXAMPLE.COM</b>",
            "password123"
        );

        AuthRequestDTO sanitized = sanitizationService.sanitize(dto);

        assertEquals("test@example.com", sanitized.email());
        assertEquals("password123", sanitized.password()); 
    }

    @Test
    @DisplayName("Should sanitize EventCreateRequestDTO")
    void shouldSanitizeEventCreateRequestDTO() {
        EventCreateRequestDTO dto = new EventCreateRequestDTO(
            1L,
            "<b>Soccer</b>",
            40.7128,
            -74.0060,
            LocalDateTime.now().plusDays(1),
            10,
            SkillLevel.BEGINNER
        );

        EventCreateRequestDTO sanitized = sanitizationService.sanitize(dto);    

        assertEquals(1L, sanitized.organizerId());
        assertEquals("Soccer", sanitized.sportType());
        assertEquals(40.7128, sanitized.lat());
        assertEquals(-74.0060, sanitized.lon());
        assertEquals(10, sanitized.maxPlayerCount());
        assertEquals(SkillLevel.BEGINNER, sanitized.requiredSkillLevel());
    }
    
    @Test
    @DisplayName("Should sanitize ReviewRequestDTO")
    void shouldSanitizeReviewRequestDTO() {
        ReviewRequestDTO dto = new ReviewRequestDTO(
            1L,
            2L,
            3L,
            5,
            "<b>Great player!</b>"
        );

        ReviewRequestDTO sanitized = sanitizationService.sanitize(dto);

        assertEquals(1L, sanitized.reviewerId());
        assertEquals(2L, sanitized.revieweeId());
        assertEquals(3L, sanitized.eventId());
        assertEquals(5, sanitized.rating());
        assertEquals("Great player!", sanitized.comment());
    }

    @Test
    @DisplayName("Should sanitize ChatMessageDTO")
    void shouldSanitizeChatMessageDTO() {
        LocalDateTime timestamp = LocalDateTime.now();
        ChatMessageDTO dto = new ChatMessageDTO(
            1L,
            "<b>John   Doe</b>",
            "<i>Hello everyone!</i>",
            timestamp
        );

        ChatMessageDTO sanitized = sanitizationService.sanitize(dto);

        assertEquals(1L, sanitized.senderId());
        assertEquals("John Doe", sanitized.senderName());
        assertEquals("Hello everyone!", sanitized.content());
        assertEquals(timestamp, sanitized.timestamp());
    }

    @Test
    @DisplayName("Should handle null DTOs")
    void shouldHandleNullDTOs() {
        assertNull(sanitizationService.sanitize((AuthRequestDTO) null));        
        assertNull(sanitizationService.sanitize((EventCreateRequestDTO) null)); 
        assertNull(sanitizationService.sanitize((ReviewRequestDTO) null));      
        assertNull(sanitizationService.sanitize((ChatMessageDTO) null));        
    }
}
