package com.sportsync.validation;

/**
 * Enumeration of different sanitization types for the @Sanitized annotation.
 */
public enum SanitizationType {
    /**
     * Strict sanitization - removes all HTML tags and potentially malicious content.
     */
    STRICT,
    
    /**
     * Email sanitization - strict sanitization with email-specific rules.
     */
    EMAIL,
    
    /**
     * Name sanitization - removes HTML but preserves basic punctuation and formatting.
     */
    NAME,
    
    /**
     * Basic formatting - allows basic HTML formatting tags like b, i, em, strong.
     */
    BASIC_FORMATTING
}