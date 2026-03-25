package com.sportsync.validation;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 * Unit tests for SanitizedValidator.
 */
class SanitizedValidatorTest {

    private SanitizedValidator validator;

    @Mock
    private Sanitized sanitizedAnnotation;

    @Mock
    private ConstraintValidatorContext context;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validator = new SanitizedValidator();
    }

    @Test
    @DisplayName("Should accept null values")
    void shouldAcceptNullValues() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.STRICT);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertTrue(validator.isValid(null, context));
    }

    @Test
    @DisplayName("Should accept clean text")
    void shouldAcceptCleanText() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.STRICT);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertTrue(validator.isValid("Clean text with numbers 123", context));
    }

    @Test
    @DisplayName("Should accept sanitizable content when allowed")
    void shouldAcceptSanitizableContentWhenAllowed() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.STRICT);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertTrue(validator.isValid("<b>Bold text</b>", context));
    }

    @Test
    @DisplayName("Should reject sanitizable content when not allowed")
    void shouldRejectSanitizableContentWhenNotAllowed() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.STRICT);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(false);
        validator.initialize(sanitizedAnnotation);

        assertFalse(validator.isValid("<b>Bold text</b>", context));
    }

    @Test
    @DisplayName("Should reject content that sanitizes to empty")
    void shouldRejectContentThatSanitizesToEmpty() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.STRICT);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertFalse(validator.isValid("<script>alert('xss')</script>", context));
    }

    @Test
    @DisplayName("Should handle email sanitization type")
    void shouldHandleEmailSanitizationType() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.EMAIL);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertTrue(validator.isValid("test@example.com", context));
        assertTrue(validator.isValid("TEST@EXAMPLE.COM", context)); // Should be sanitizable
    }

    @Test
    @DisplayName("Should handle name sanitization type")
    void shouldHandleNameSanitizationType() {
        when(sanitizedAnnotation.value()).thenReturn(SanitizationType.NAME);
        when(sanitizedAnnotation.allowSanitizable()).thenReturn(true);
        validator.initialize(sanitizedAnnotation);

        assertTrue(validator.isValid("John Doe", context));
        assertTrue(validator.isValid("John   Doe", context)); // Should be sanitizable
    }
}