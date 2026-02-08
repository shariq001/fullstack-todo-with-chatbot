# Environment Variables Configuration

This document describes the environment variables required for the Backend Infrastructure & Data Layer application.

## Required Environment Variables

### DATABASE_URL
- **Type**: String
- **Required**: Yes
- **Description**: Connection string for the PostgreSQL database
- **Format**: `postgresql://username:password@host:port/database_name`
- **Example**: `postgresql://user:pass@localhost:5432/myapp`
- **Security**: This should contain sensitive credentials and must not be hardcoded in source code

### ENVIRONMENT
- **Type**: String
- **Required**: No
- **Default**: `development`
- **Description**: Defines the environment the application is running in
- **Values**: `development`, `staging`, `production`

### DEBUG
- **Type**: Boolean
- **Required**: No
- **Default**: `False`
- **Description**: Enables debug mode for additional logging and error information

## Example .env File

```bash
# Database Configuration
DATABASE_URL='postgresql://neondb_owner:npg_usfaEr1c3MXR@ep-billowing-pine-aix5tlpa-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Application Configuration
ENVIRONMENT=development
DEBUG=True
```

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use different credentials** for different environments (dev/staging/prod)
3. **Rotate credentials** periodically
4. **Restrict database permissions** to only necessary operations
5. **Use strong passwords** for database users
6. **Enable SSL/TLS** connections when possible (recommended for Neon PostgreSQL)

## Validation

The application validates the following:
- DATABASE_URL must be present and not empty
- DATABASE_URL must start with 'postgresql://' to ensure proper connection protocol
- All required environment variables are present before application startup