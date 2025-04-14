# Smartlead MCP Managed Service - Architecture Overview

This document outlines the architecture of the Smartlead MCP Managed Service platform.

## System Architecture

The managed service consists of several key components working together:

```
┌────────────────────────────────────────────────────────────────────┐
│                      Smartlead MCP Platform                        │
│                                                                    │
│  ┌─────────────────┐    ┌────────────────┐    ┌──────────────────┐ │
│  │ Web Dashboard   │    │ Service Core   │    │ Instance Manager │ │
│  │                 │    │                │    │                  │ │
│  │ - UI Components │    │ - API Server   │    │ - Docker Control │ │
│  │ - User Auth     │    │ - MCP Registry │    │ - Scaling Logic  │ │
│  │ - Admin Panel   │    │ - Config Mgmt  │    │ - Health Monitor │ │
│  └────────┬────────┘    └───────┬────────┘    └────────┬─────────┘ │
│           │                     │                      │           │
│           └─────────────────────┼──────────────────────┘           │
│                                 │                                  │
│                    ┌────────────┴────────────┐                     │
│                    │       Database          │                     │
│                    │                         │                     │
│                    │ - User Data             │                     │
│                    │ - Instance Config       │                     │
│                    │ - Metrics & Logs        │                     │
│                    └─────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│                       MCP Instances (Docker)                       │
│                                                                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ Instance 1      │    │ Instance 2      │    │ Instance N      │ │
│  │                 │    │                 │    │                 │ │
│  │ - SSE Mode      │    │ - Stdio Mode    │    │ - Both Modes    │ │
│  │ - Client A      │    │ - Client B      │    │ - Client C      │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### 1. Web Dashboard

The frontend user interface that provides:
- User registration and authentication
- MCP instance configuration
- Monitoring and management tools
- Admin controls for multi-tenant deployments

**Technologies**: React, TypeScript, Material UI

### 2. Service Core

The backend API and business logic layer:
- RESTful API endpoints for dashboard and external integrations
- Authentication and authorization services
- Configuration management
- Metrics collection and reporting

**Technologies**: Node.js, Express, TypeScript

### 3. Instance Manager

Responsible for provisioning and managing MCP instances:
- Docker container orchestration
- Auto-scaling (in multi-tenant deployments)
- Health monitoring and automatic recovery
- Log aggregation

**Technologies**: Docker SDK, Node.js

### 4. Database

Persistent storage for all platform data:
- User accounts and authentication
- MCP instance configurations
- Usage metrics and billing information (for SaaS deployments)
- System logs and audit trails

**Technologies**: PostgreSQL (primary database), Redis (caching)

### 5. MCP Instances

Individual Docker containers running the Smartlead MCP service:
- Isolated environment for each user/tenant
- Configurable for different modes (SSE, STDIO, or both)
- Resource-constrained to ensure fair usage

**Technologies**: Docker, Node.js, Supergateway

## Data Flow

1. **Configuration Flow**:
   - User configures MCP instance via Web Dashboard
   - Service Core validates and stores configuration
   - Instance Manager applies configuration to Docker container
   - MCP Instance loads configuration and establishes connections

2. **Connection Flow (n8n)**:
   - n8n connects to MCP instance via SSE endpoint
   - Connection routed through Instance Manager to specific container
   - MCP processes requests and communicates with Smartlead API
   - Responses returned via SSE to n8n

3. **Connection Flow (Standard/STDIO)**:
   - AI Assistant connects to MCP instance via Claude or other MCP client
   - MCP processes requests and communicates with Smartlead API
   - Responses returned to AI Assistant

## Scalability Considerations

The architecture supports three deployment scales:

### Single-User Deployment
- One Dashboard, Service Core, and Instance Manager
- One or more MCP instances for a single user
- Suitable for individual developers or small teams

### Team Deployment
- Shared Dashboard and Service Core
- Multiple MCP instances for different team members
- Suitable for marketing teams or agencies

### Multi-Tenant SaaS Deployment
- Full platform with user isolation
- Dynamic scaling of instances based on demand
- Metering and billing capabilities
- Suitable for commercial SaaS offering

## Security Model

- **User Isolation**: Each user's MCP instances are isolated in separate containers
- **API Key Management**: Smartlead API keys stored securely using environment variables or secret management
- **Authentication**: JWT-based authentication for dashboard access
- **Network Security**: Internal components communicate on private network
- **Audit Logging**: All administrative actions are logged 