package com.sportsync.util;

import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PasswordValidatorTest {

    @Test
    void testValidPassword() {
        String validPassword = "MySecure123!";
        assertTrue(PasswordValidator.isValid(validPassword));
        assertTrue(PasswordValidator.getValidationErrors(validPassword).isEmpty());
    }

    @Test
    void testPasswordTooShort() {
        String shortPassword = "Abc1!";
        assertFalse(PasswordValidator.isValid(shortPassword));
        
        List<String> errors = PasswordValidator.getValidationErrors(shortPassword);
        assertTrue(errors.stream().anyMatch(error -> error.contains("at least 8 characters")));
    }

    @Test
    void testPasswordMissingLowercase() {
        String password = "MYSECURE123!";
        assertFalse(PasswordValidator.isValid(password));
        
        List<String> errors = PasswordValidator.getValidationErrors(password);
        assertTrue(errors.stream().anyMatch(error -> error.contains("lowercase letter")));
    }

    @Test
    void testPasswordMissingUppercase() {
        String password = "mysecure123!";
        assertFalse(PasswordValidator.isValid(password));
        
        List<String> errors = PasswordValidator.getValidationErrors(password);
        assertTrue(errors.stream().anyMatch(error -> error.contains("uppercase letter")));
    }

    @Test
    void testPasswordMissingDigit() {
        String password = "MySecurePass!";
        assertFalse(PasswordValidator.isValid(password));
        
        List<String> errors = PasswordValidator.getValidationErrors(password);
        assertTrue(errors.stream().anyMatch(error -> error.contains("digit")));
    }

    @Test
    void testPasswordMissingSpecialCharacter() {
        String password = "MySecure123";
        assertFalse(PasswordValidator.isValid(password));
        
        List<String> errors = PasswordValidator.getValidationErrors(password);
        assertTrue(errors.stream().anyMatch(error -> error.contains("special character")));
    }

    @Test
    void testNullPassword() {
        assertFalse(PasswordValidator.isValid(null));
        
        List<String> errors = PasswordValidator.getValidationErrors(null);
        assertEquals(1, errors.size());
        assertTrue(errors.get(0).contains("cannot be null"));
    }

    @Test
    void testGetRequirementsText() {
        String requirements = PasswordValidator.getRequirementsText();
        assertNotNull(requirements);
        assertTrue(requirements.contains("8 characters"));
        assertTrue(requirements.contains("lowercase"));
        assertTrue(requirements.contains("uppercase"));
        assertTrue(requirements.contains("digit"));
        assertTrue(requirements.contains("special character"));
    }
}