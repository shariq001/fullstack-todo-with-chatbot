# Health Check API Endpoints

## Endpoints

### GET /health
**Purpose**: Health check endpoint to verify the system is operational.

**Response**:
- Success: `{"status": "healthy", "database": "connected"}`
- Status Code: 200 (OK) if healthy, 503 (Service Unavailable) if database is not available

**Description**: This endpoint checks if the application is running and can connect to the database. It's used for monitoring system health.

### GET /ready
**Purpose**: Readiness check endpoint to verify the system is ready to serve requests.

**Response**:
- Success: `{"status": "ready"}`
- Status Code: 200 (OK)

**Description**: This endpoint indicates whether the application is ready to handle requests. Use this for load balancer readiness probes.

### GET /live
**Purpose**: Liveness check endpoint to verify the application is alive.

**Response**:
- Success: `{"status": "alive"}`
- Status Code: 200 (OK)

**Description**: This endpoint indicates whether the application is alive. Use this for container orchestration liveness probes.