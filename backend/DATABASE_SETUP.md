# Database Configuration Guide

## Overview

SportSync has been migrated from H2 in-memory database to PostgreSQL for production readiness. This document outlines the database configuration, environment variables, and setup requirements.

## Environment Profiles

The application supports three environment profiles:

### Development (`dev`)
- **Database**: `sportsync_dev` on localhost:5432
- **Connection Pool**: 2-10 connections
- **DDL Mode**: `update` (auto-creates/updates schema)
- **Logging**: Verbose SQL logging enabled
- **CORS**: Permissive for local development

### Staging (`staging`)
- **Database**: `sportsync_staging` on staging-db:5432
- **Connection Pool**: 5-15 connections
- **DDL Mode**: `validate` (requires migrations)
- **Logging**: Moderate logging
- **CORS**: Configured via environment variable

### Production (`prod`)
- **Database**: Configured via environment variables
- **Connection Pool**: 10-30 connections
- **DDL Mode**: `validate` (requires migrations)
- **Logging**: Minimal logging for performance
- **CORS**: Strict configuration
- **Security**: Enhanced cookie security settings

## Required Environment Variables

### Development
All variables have defaults, no environment variables required.

### Staging & Production
The following environment variables are **required**:

```bash
DATABASE_URL=jdbc:postgresql://your-db-host:5432/your-database
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Database Setup

### Local Development Setup

1. Install PostgreSQL locally
2. Create development database:
```sql
CREATE DATABASE sportsync_dev;
CREATE USER sportsync_dev WITH PASSWORD 'sportsync_dev';
GRANT ALL PRIVILEGES ON DATABASE sportsync_dev TO sportsync_dev;
```

3. Run the application with dev profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production Setup

1. Set up PostgreSQL database
2. Create production database and user
3. Set environment variables
4. Run database migrations (Task 1.2)
5. Start application with production profile:
```bash
java -jar sportsync.jar --spring.profiles.active=prod
```

## Connection Pool Configuration

The application uses HikariCP for connection pooling with the following settings:

| Setting | Development | Staging | Production |
|---------|-------------|---------|------------|
| Minimum Idle | 2 | 5 | 10 |
| Maximum Pool Size | 10 | 15 | 30 |
| Connection Timeout | 20s | 20s | 20s |
| Idle Timeout | 5min | 5min | 5min |
| Max Lifetime | 20min | 20min | 20min |

## Health Checks

The application includes database health checks available at:
- `/actuator/health` - Basic health status
- `/actuator/health/db` - Database-specific health

## Monitoring

Metrics are available via:
- `/actuator/metrics` - Application metrics
- `/actuator/prometheus` - Prometheus-formatted metrics

## Troubleshooting

### Connection Issues
1. Verify database is running and accessible
2. Check environment variables are set correctly
3. Verify database credentials
4. Check network connectivity and firewall rules

### Performance Issues
1. Monitor connection pool metrics
2. Check for connection leaks
3. Review slow query logs
4. Consider adjusting pool settings

### Migration Issues
1. Ensure database user has DDL permissions
2. Check migration scripts for syntax errors
3. Verify database compatibility
4. Review migration logs for detailed errors