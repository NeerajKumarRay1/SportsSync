package com.sportsync.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Validation annotation that ensures string input is sanitized for XSS prevention.
 * This annotation can be applied to String fields in DTOs to automatically
 * validate that the input doesn't contain potentially malicious content.
 */
@Documented
@Constraint(validatedBy = SanitizedValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Sanitized {
    
    String message() default "Input contains potentially malicious content";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * The type of sanitization to apply.
     */
    SanitizationType value() default SanitizationType.STRICT;
    
    /**
     * Whether to allow the input if it contains potentially malicious content
     * but can be safely sanitized. If false, any input that requires sanitization
     * will be rejected.
     */
    boolean allowSanitizable() default true;
}