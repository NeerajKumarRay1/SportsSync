# Database Migration Setup

This document describes the database migration setup for the SportSync application using Flyway.

## Overview

The application uses Flyway for database schema versioning and migration management. The migration scripts are located in `src/main/resources/db/migration/`.

## Migration Scripts

### V1__Initial_Schema.sql
- Creates the initial database schema with all required tables
- Uses VARCHAR columns for enum fields with check constraints to ensure compatibility with both H2 (testing) and PostgreSQL (production)
- Includes proper foreign key constraints, indexes, and check constraints
- Creates tables: users, user_preferred_sports, events, rosters, reviews

## Database Schema

### Tables Created

1. **users**
   - Primary key: id (BIGSERIAL)
   - Fields: name, email (unique), password, skill_level, latitude, longitude, reputation_score
   - Indexes: email, location (lat/lng), skill_level, reputation_score
   - Check constraint: skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')

2. **user_preferred_sports**
   - Collection table for user's preferred sports
   - Foreign key to users table with CASCADE delete
   - Indexes: user_id, sport

3. **events**
   - Primary key: id (BIGSERIAL)
   - Foreign key: organizer_id → users(id)
   - Fields: sport_type, location (lat/lng), date_time, max_player_count, required_skill_level, status
   - Indexes: organizer_id, sport_type, location, date_time, status, skill_level, composite indexes
   - Check constraints: skill_level and status enums

4. **rosters**
   - Primary key: id (BIGSERIAL)
   - Foreign keys: event_id → events(id), user_id → users(id)
   - Unique constraint: (event_id, user_id) - prevents duplicate joins
   - Indexes: event_id, user_id, joined_at

5. **reviews**
   - Primary key: id (BIGSERIAL)
   - Foreign keys: reviewer_id → users(id), reviewee_id → users(id), event_id → events(id)
   - Unique constraint: (reviewer_id, reviewee_id, event_id) - one review per user per event
   - Check constraints: rating 1-5, reviewer != reviewee
   - Indexes: reviewer_id, reviewee_id, event_id, rating, created_at

## Configuration

### Flyway Properties

```properties
# Basic Flyway configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
spring.flyway.validate-on-migrate=true
```

### Environment-Specific Settings

- **Development**: `spring.flyway.clean-disabled=false` (allows clean for development)
- **Staging/Production**: `spring.flyway.clean-disabled=true` (prevents accidental data loss)

## Database Compatibility

The migration scripts are designed to work with both:
- **H2 Database** (for testing) - uses VARCHAR with check constraints for enums
- **PostgreSQL** (for production) - uses VARCHAR with check constraints (compatible with both)

The schema uses VARCHAR columns with check constraints instead of native PostgreSQL ENUMs to ensure compatibility across database systems. This approach provides:
- Type safety through check constraints
- Compatibility with H2 for testing
- Easy migration to PostgreSQL for production
- Consistent behavior across environments

## Running Migrations

Migrations run automatically when the application starts. To run migrations manually:

```bash
# Run all pending migrations
mvn flyway:migrate

# Get migration status
mvn flyway:info

# Validate migrations
mvn flyway:validate
```

## Testing

The migration setup includes a test (`FlywayMigrationTest`) that verifies:
- Migration scripts execute without errors
- Schema validation passes
- All tables and constraints are created correctly

## Best Practices

1. **Never modify existing migration scripts** - create new ones instead
2. **Test migrations on a copy of production data** before deploying
3. **Use descriptive migration names** following the pattern `V{version}__{description}.sql`
4. **Include rollback procedures** in deployment documentation
5. **Monitor migration execution time** in production

## Troubleshooting

### Common Issues

1. **Migration checksum mismatch**: Usually caused by modifying existing migration files
   - Solution: Create a new migration or use `flyway:repair`

2. **Schema validation errors**: JPA entities don't match database schema
   - Solution: Ensure migration scripts match entity definitions

3. **Database compatibility issues**: Different behavior between H2 and PostgreSQL
   - Solution: Use compatible SQL syntax and test with both databases

### Recovery Procedures

If migrations fail:
1. Check Flyway schema history table: `flyway_schema_history`
2. Identify failed migration and fix the issue
3. Use `flyway:repair` to mark failed migration as resolved
4. Re-run migrations

## Monitoring

Monitor these metrics in production:
- Migration execution time
- Schema validation results
- Database connection pool status during migrations
- Application startup time (affected by migration duration)