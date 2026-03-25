package com.sportsync.validation;

import com.sportsync.util.InputSanitizer;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for the @Sanitized annotation.
 * Validates that string input doesn't contain potentially malicious content.
 */
public class SanitizedValidator implements ConstraintValidator<Sanitized, String> {

    private SanitizationType sanitizationType;
    private boolean allowSanitizable;

    @Override
    public void initialize(Sanitized constraintAnnotation) {
        this.sanitizationType = constraintAnnotation.value();
        this.allowSanitizable = constraintAnnotation.allowSanitizable();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Null values are handled by @NotNull if required
        if (value == null) {
            return true;
        }

        // Check if input contains potentially malicious content
        boolean containsMaliciousContent = InputSanitizer.containsPotentiallyMaliciousContent(value);

        // If no malicious content detected, input is valid
        if (!containsMaliciousContent) {
            return true;
        }

        // If malicious content is detected but sanitizable inputs are allowed,
        // validate that sanitization produces a meaningful result
        if (allowSanitizable) {
            String sanitized = sanitizeBasedOnType(value);
            // Input is valid if sanitization produces non-empty result
            return sanitized != null && !sanitized.trim().isEmpty();
        }

        // If sanitizable inputs are not allowed, reject any input with malicious content
        return false;
    }

    private String sanitizeBasedOnType(String input) {
        return switch (sanitizationType) {
            case EMAIL -> InputSanitizer.sanitizeEmail(input);
            case NAME -> InputSanitizer.sanitizeName(input);
            case BASIC_FORMATTING -> InputSanitizer.sanitizeWithBasicFormatting(input);
            case STRICT -> InputSanitizer.sanitize(input);
        };
    }
}