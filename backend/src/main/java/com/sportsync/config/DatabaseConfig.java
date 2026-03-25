package com.sportsync.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import lombok.extern.slf4j.Slf4j;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Database configuration and health check component.
 * Validates database connection on application startup and provides
 * environment-specific configuration validation.
 */
@Component
@Slf4j
public class DatabaseConfig {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Environment environment;

    /**
     * Validates database connection when application is ready.
     * This ensures the database is accessible before the application
     * starts accepting requests.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void validateDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            String databaseUrl = connection.getMetaData().getURL();
            String databaseProduct = connection.getMetaData().getDatabaseProductName();
            String databaseVersion = connection.getMetaData().getDatabaseProductVersion();
            
            log.info("Database connection validated successfully");
            log.info("Database URL: {}", maskPassword(databaseUrl));
            log.info("Database Product: {} {}", databaseProduct, databaseVersion);
            
            // Log active profile
            String[] activeProfiles = environment.getActiveProfiles();
            if (activeProfiles.length > 0) {
                log.info("Active profiles: {}", String.join(", ", activeProfiles));
            } else {
                log.info("No active profiles set, using default configuration");
            }
            
            // Validate required environment variables for non-dev profiles
            validateEnvironmentVariables();
            
        } catch (SQLException e) {
            log.error("Failed to validate database connection", e);
            throw new RuntimeException("Database connection validation failed", e);
        }
    }

    /**
     * Validates that required environment variables are set for production environments.
     */
    private void validateEnvironmentVariables() {
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isProductionLike = false;
        
        for (String profile : activeProfiles) {
            if ("prod".equals(profile) || "staging".equals(profile)) {
                isProductionLike = true;
                break;
            }
        }
        
        if (isProductionLike) {
            validateRequiredEnvVar("DATABASE_URL");
            validateRequiredEnvVar("DATABASE_USERNAME");
            validateRequiredEnvVar("DATABASE_PASSWORD");
            validateRequiredEnvVar("CORS_ALLOWED_ORIGINS");
            
            log.info("Environment variable validation completed for production profile");
        }
    }

    /**
     * Validates that a required environment variable is set.
     */
    private void validateRequiredEnvVar(String varName) {
        String value = environment.getProperty(varName);
        if (value == null || value.trim().isEmpty()) {
            String message = String.format("Required environment variable '%s' is not set", varName);
            log.error(message);
            throw new RuntimeException(message);
        }
    }

    /**
     * Masks password in database URL for logging.
     */
    private String maskPassword(String url) {
        if (url == null) return null;
        return url.replaceAll("password=[^&;]*", "password=***");
    }
}