# Smartlead MCP Managed Service - Development Guide

This guide outlines the development workflow and implementation details for the Smartlead MCP Managed Service.

## Project Structure

The project is organized into several modules:

```
smartlead-mcp-server/
├── src/                      # Original MCP server code
├── managed-service/          # Managed service components
│   ├── dashboard/            # Web UI (React)
│   ├── service-core/         # Backend API (Express)
│   ├── instance-manager/     # Docker orchestration
│   └── common/               # Shared utilities and types
├── docker/                   # Docker configuration
│   ├── base/                 # Base MCP server image
│   ├── dashboard/            # Dashboard container
│   ├── service-core/         # API container
│   └── docker-compose.yml    # Development compose file
└── docs/                     # Documentation
    └── managed-service/      # Managed service documentation
```

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (local or containerized)
- Git

### Initial Setup

1. Clone the repository and checkout the feature branch:

```bash
git clone https://github.com/yourusername/smartlead-mcp-server.git
cd smartlead-mcp-server
git checkout feature/managed-service-platform
```

2. Install dependencies for the MCP server:

```bash
npm install
```

3. Install dependencies for the managed service components:

```bash
cd managed-service/dashboard && npm install
cd ../service-core && npm install
cd ../instance-manager && npm install
```

4. Create configuration files:

```bash
cp managed-service/service-core/.env.example managed-service/service-core/.env
cp managed-service/dashboard/.env.example managed-service/dashboard/.env
```

5. Start the development environment:

```bash
docker-compose -f docker/docker-compose.yml up
```

## Implementation Plan

### Phase 1: Core Framework

1. **Enhanced Configuration System**
   - Create a unified configuration module in `src/config/`
   - Support both environment variables and config files
   - Add multi-mode configuration options

2. **Multi-Mode Transport Layer**
   - Modify server initialization to support multiple transport types
   - Implement `TransportManager` to handle connections
   - Create connection factories for each transport type

3. **Server Refactoring**
   - Separate core MCP functionality from transport-specific code
   - Extract shared business logic to reusable modules
   - Implement dependency injection for better testability

### Phase 2: Dashboard & Service Core

1. **API Server**
   - Create RESTful API endpoints for dashboard communication
   - Implement authentication and authorization
   - Add configuration management endpoints
   - Build instance provisioning API

2. **Web Dashboard**
   - Create React application with Material UI
   - Implement user registration and login
   - Build configuration interface
   - Add monitoring and management screens

### Phase 3: Docker Orchestration

1. **Docker Image Creation**
   - Create base MCP server image
   - Add configuration mounting points
   - Optimize for minimal size and fast startup

2. **Instance Manager**
   - Implement Docker SDK integration
   - Create instance lifecycle management
   - Add health monitoring
   - Implement log aggregation

### Phase 4: Database & Persistence

1. **Database Schema**
   - Design user and authentication tables
   - Create configuration storage schema
   - Add metrics and logging tables

2. **Data Access Layer**
   - Implement repository pattern
   - Add data validation
   - Create migration system

## Code Guidelines

### Coding Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Document all public APIs with JSDoc
- Write unit tests for all new functionality

### Commit Guidelines

- Use semantic commit messages: `feat:`, `fix:`, `docs:`, etc.
- Keep commits focused on single changes
- Include issue numbers in commit messages when applicable

### Pull Request Workflow

1. Create feature branches from `feature/managed-service-platform`
2. Submit PRs to the main feature branch
3. Require code review before merging
4. Ensure all tests pass

## Testing Strategy

### Unit Testing

- Use Jest for all unit tests
- Aim for 80%+ coverage of business logic
- Mock external dependencies

### Integration Testing

- Test API endpoints with Supertest
- Use Docker Compose for integration testing environment
- Validate database interactions

### End-to-End Testing

- Use Cypress for dashboard UI testing
- Test complete workflows from UI to container creation
- Validate instance connectivity

## Containerization

### Base Container

```dockerfile
# Base MCP server image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/

# Set default environment variables
ENV NODE_ENV=production
ENV USE_SUPERGATEWAY=true
ENV SSE_PORT=3001

# Expose the default SSE port
EXPOSE 3001

# Start the server with Supergateway
CMD ["npm", "run", "start:n8n"]
```

### Dashboard Container

```dockerfile
# Dashboard image
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY managed-service/dashboard/package*.json ./
RUN npm ci

# Copy source code and build
COPY managed-service/dashboard/ ./
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY managed-service/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Service Core Container

```dockerfile
# Service Core image
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY managed-service/service-core/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY managed-service/service-core/dist/ ./dist/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose API port
EXPOSE 3000

# Start the service
CMD ["node", "dist/index.js"]
```

## Development Workflow

1. **Local Development**:
   - Use `docker-compose` to start dependent services
   - Run individual components in development mode
   - Use hot reloading for dashboard and service core

2. **Testing**:
   - Run unit tests before committing changes
   - Use integration tests for API validation
   - Run end-to-end tests for major features

3. **Documentation**:
   - Update documentation alongside code changes
   - Document all APIs with OpenAPI specification
   - Maintain user guides and examples

## Next Steps

Once the foundation is in place, future enhancements could include:

1. **Monitoring & Analytics**:
   - Add detailed usage metrics
   - Implement alerting for instance issues
   - Create dashboard visualizations

2. **User Management**:
   - Add team collaboration features
   - Implement role-based access control
   - Add API key management for headless usage

3. **Marketplace**:
   - Create template library for common configurations
   - Add one-click deployment options
   - Enable sharing configurations between users 