package com.sportsync.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Utility class for validating password strength requirements.
 * Enforces minimum 8 characters, mixed case, numbers, and special characters.
 */
public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");

    /**
     * Validates if a password meets all security requirements.
     * 
     * @param password the password to validate
     * @return true if password meets all requirements, false otherwise
     */
    public static boolean isValid(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }

        return LOWERCASE_PATTERN.matcher(password).find() &&
               UPPERCASE_PATTERN.matcher(password).find() &&
               DIGIT_PATTERN.matcher(password).find() &&
               SPECIAL_CHAR_PATTERN.matcher(password).find();
    }

    /**
     * Gets a list of validation errors for a password.
     * 
     * @param password the password to validate
     * @return list of validation error messages, empty if password is valid
     */
    public static List<String> getValidationErrors(String password) {
        List<String> errors = new ArrayList<>();

        if (password == null) {
            errors.add("Password cannot be null");
            return errors;
        }

        if (password.length() < MIN_LENGTH) {
            errors.add("Password must be at least " + MIN_LENGTH + " characters long");
        }

        if (!LOWERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one lowercase letter");
        }

        if (!UPPERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one uppercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one digit");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one special character");
        }

        return errors;
    }

    /**
     * Gets password requirements as a formatted string for user display.
     * 
     * @return formatted string describing password requirements
     */
    public static String getRequirementsText() {
        return "Password must contain:\n" +
               "• At least " + MIN_LENGTH + " characters\n" +
               "• At least one lowercase letter (a-z)\n" +
               "• At least one uppercase letter (A-Z)\n" +
               "• At least one digit (0-9)\n" +
               "• At least one special character (!@#$%^&*()_+-=[]{}|;':\"\\,.<>?/)";
    }
}