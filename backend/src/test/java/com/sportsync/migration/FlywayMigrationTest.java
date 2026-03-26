package com.sportsync.migration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

/**
 * Test to verify Flyway migration scripts execute successfully
 */
@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=validate",
    "spring.flyway.enabled=true",
    "spring.flyway.clean-disabled=false"
})
public class FlywayMigrationTest {

    @Test
    public void testMigrationExecutesSuccessfully() {
        // This test verifies that the Flyway migration scripts can execute
        // without errors. The actual migration is handled by Spring Boot's
        // auto-configuration during test context startup.
        assertDoesNotThrow(() -> {
            // If we reach this point, the migration was successful
            System.out.println("Flyway migration executed successfully");
        });
    }
}