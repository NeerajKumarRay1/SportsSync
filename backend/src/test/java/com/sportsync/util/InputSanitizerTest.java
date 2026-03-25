package com.sportsync.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for InputSanitizer utility class.
 */
class InputSanitizerTest {

    @Test
    @DisplayName("Should sanitize basic HTML tags")
    void shouldSanitizeBasicHtmlTags() {
        String input = "<script>alert('xss')</script>Hello World";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("Hello World", result);
        assertFalse(result.contains("<script>"));
        assertFalse(result.contains("alert"));
    }

    @Test
    @DisplayName("Should sanitize HTML attributes")
    void shouldSanitizeHtmlAttributes() {
        String input = "<div onclick=\"alert('xss')\">Hello</div>";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("Hello", result);
        assertFalse(result.contains("onclick"));
        assertFalse(result.contains("alert"));
    }

    @Test
    @DisplayName("Should handle null input")
    void shouldHandleNullInput() {
        String nullString = null;
        String result = InputSanitizer.sanitize(nullString);
        assertNull(result);
    }

    @Test
    @DisplayName("Should preserve clean text")
    void shouldPreserveCleanText() {
        String input = "This is clean text with numbers 123 and symbols !@#";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals(input, result);
    }

    @Test
    @DisplayName("Should remove control characters")
    void shouldRemoveControlCharacters() {
        String input = "Hello\u0001\u0002World\u0003";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("HelloWorld", result);
    }

    @Test
    @DisplayName("Should preserve newlines and tabs")
    void shouldPreserveNewlinesAndTabs() {
        String input = "Line 1\nLine 2\tTabbed";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("Line 1\nLine 2\tTabbed", result);
    }

    @Test
    @DisplayName("Should sanitize list of strings")
    void shouldSanitizeListOfStrings() {
        List<String> input = Arrays.asList(
            "<script>alert('xss')</script>Sport1",
            "Clean Sport",
            "<b>Bold Sport</b>"
        );
        
        List<String> result = InputSanitizer.sanitize(input);
        
        assertEquals(3, result.size());
        assertEquals("Sport1", result.get(0));
        assertEquals("Clean Sport", result.get(1));
        assertEquals("Bold Sport", result.get(2));
    }

    @Test
    @DisplayName("Should handle null list")
    void shouldHandleNullList() {
        List<String> nullList = null;
        List<String> result = InputSanitizer.sanitize(nullList);
        assertNull(result);
    }

    @Test
    @DisplayName("Should sanitize email input")
    void shouldSanitizeEmailInput() {
        String input = "<script>alert('xss')</script>TEST@EXAMPLE.COM";
        String result = InputSanitizer.sanitizeEmail(input);
        
        assertEquals("test@example.com", result);
    }

    @Test
    @DisplayName("Should sanitize name input")
    void shouldSanitizeNameInput() {
        String input = "<b>John   Doe</b>";
        String result = InputSanitizer.sanitizeName(input);
        
        assertEquals("John Doe", result);
    }

    @Test
    @DisplayName("Should detect potentially malicious content")
    void shouldDetectPotentiallyMaliciousContent() {
        assertTrue(InputSanitizer.containsPotentiallyMaliciousContent("<script>alert('xss')</script>"));
        assertTrue(InputSanitizer.containsPotentiallyMaliciousContent("<div onclick=\"alert()\">text</div>"));
        assertFalse(InputSanitizer.containsPotentiallyMaliciousContent("Clean text"));
        assertFalse(InputSanitizer.containsPotentiallyMaliciousContent(null));
    }

    @Test
    @DisplayName("Should sanitize with basic formatting")
    void shouldSanitizeWithBasicFormatting() {
        String input = "<b>Bold</b> <i>Italic</i> <script>alert('xss')</script>";
        String result = InputSanitizer.sanitizeWithBasicFormatting(input);
        
        assertTrue(result.contains("<b>Bold</b>"));
        assertTrue(result.contains("<i>Italic</i>"));
        assertFalse(result.contains("<script>"));
        assertFalse(result.contains("alert"));
    }

    @Test
    @DisplayName("Should trim whitespace")
    void shouldTrimWhitespace() {
        String input = "   Hello World   ";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("Hello World", result);
    }

    @Test
    @DisplayName("Should handle empty string")
    void shouldHandleEmptyString() {
        String result = InputSanitizer.sanitize("");
        assertEquals("", result);
    }

    @Test
    @DisplayName("Should handle string with only HTML")
    void shouldHandleStringWithOnlyHtml() {
        String input = "<script>alert('xss')</script>";
        String result = InputSanitizer.sanitize(input);
        
        assertEquals("", result);
    }
}