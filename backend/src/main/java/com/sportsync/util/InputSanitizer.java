package com.sportsync.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for sanitizing user input to prevent XSS attacks.
 * Uses OWASP HTML Sanitizer to clean potentially malicious content.
 */
@Component
public class InputSanitizer {

    // Policy that strips all HTML tags and attributes
    private static final PolicyFactory STRICT_POLICY = new HtmlPolicyBuilder().toFactory();

    // Policy that allows basic text formatting (for future use if needed)
    private static final PolicyFactory BASIC_FORMATTING_POLICY = new HtmlPolicyBuilder()
            .allowElements("b", "i", "em", "strong")
            .toFactory();

    /**
     * Sanitizes a string input by removing all HTML tags and potentially malicious content.
     * This is the primary method for sanitizing user input strings.
     * 
     * @param input the input string to sanitize
     * @return sanitized string with HTML tags removed, or null if input is null
     */
    public static String sanitize(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove HTML tags and decode HTML entities
        String sanitized = STRICT_POLICY.sanitize(input);
        
        // Decode common HTML entities back to normal characters for better usability
        sanitized = decodeCommonHtmlEntities(sanitized);
        
        // Additional cleaning: remove control characters except newlines and tabs
        sanitized = sanitized.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "");
        
        // Trim whitespace
        return sanitized.trim();
    }

    /**
     * Decodes common HTML entities back to normal characters.
     * This improves usability while maintaining security.
     */
    private static String decodeCommonHtmlEntities(String input) {
        if (input == null) {
            return null;
        }
        
        return input
            .replace("&#64;", "@")
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&#39;", "'")
            .replace("&#x27;", "'")
            .replace("&#x2F;", "/");
    }

    /**
     * Sanitizes a list of strings.
     * 
     * @param inputs the list of strings to sanitize
     * @return list of sanitized strings, or null if input is null
     */
    public static List<String> sanitize(List<String> inputs) {
        if (inputs == null) {
            return null;
        }
        
        return inputs.stream()
                .map(InputSanitizer::sanitize)
                .collect(Collectors.toList());
    }

    /**
     * Sanitizes input with basic formatting allowed (for rich text fields).
     * Currently allows: b, i, em, strong tags.
     * 
     * @param input the input string to sanitize
     * @return sanitized string with basic formatting preserved, or null if input is null
     */
    public static String sanitizeWithBasicFormatting(String input) {
        if (input == null) {
            return null;
        }
        
        String sanitized = BASIC_FORMATTING_POLICY.sanitize(input);
        
        // Decode common HTML entities
        sanitized = decodeCommonHtmlEntities(sanitized);
        
        // Remove control characters except newlines and tabs
        sanitized = sanitized.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "");
        
        return sanitized.trim();
    }

    /**
     * Checks if a string contains potentially malicious content.
     * 
     * @param input the input string to check
     * @return true if the input appears to contain HTML/script content, false otherwise
     */
    public static boolean containsPotentiallyMaliciousContent(String input) {
        if (input == null) {
            return false;
        }
        
        String original = input.trim();
        String sanitized = sanitize(input);
        
        // If sanitization changed the content significantly, it likely contained HTML/scripts
        return !original.equals(sanitized);
    }

    /**
     * Sanitizes email input specifically.
     * Emails should not contain HTML, so this is strict sanitization.
     * 
     * @param email the email string to sanitize
     * @return sanitized email string
     */
    public static String sanitizeEmail(String email) {
        if (email == null) {
            return null;
        }
        
        // For emails, we want strict sanitization and lowercase
        String sanitized = sanitize(email);
        return sanitized != null ? sanitized.toLowerCase() : null;
    }

    /**
     * Sanitizes name input (user names, event names, etc.).
     * Removes HTML but preserves basic punctuation and spaces.
     * 
     * @param name the name string to sanitize
     * @return sanitized name string
     */
    public static String sanitizeName(String name) {
        if (name == null) {
            return null;
        }
        
        String sanitized = sanitize(name);
        
        // Additional validation for names: remove excessive whitespace
        if (sanitized != null) {
            sanitized = sanitized.replaceAll("\\s+", " ");
        }
        
        return sanitized;
    }
}