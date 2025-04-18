# Smartlead Simplified MCP Server (with Licensing)

This application provides a simplified interface or Multi-Channel Proxy (MCP) for interacting with the Smartlead API. It organizes Smartlead API calls into logical tools and categories, facilitating integration with various clients and workflows.

**Licensing:** This server integrates with an external license server to manage feature access based on user subscription tiers (e.g., Free, Basic, Premium). Availability of certain features and tool categories depends on the active license tier validated against the configured license server.

> **To get started, purchase a license at:** https://sea-turtle-app-64etr.ondigitalocean.app/

> **For setup instructions and developer documentation, see:** [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)

## Core Features

*   **Proxies Smartlead API:** Acts as an intermediary for Smartlead API calls.
*   **Tool Abstraction:** Provides a structured set of tools for managing:
    *   Campaign Management
    *   Lead Management
    *   Campaign Statistics
    *   Smart Delivery (Spam Tests, DNS Checks, etc.)
    *   Webhooks
    *   Client Management
    *   Smart Senders (Domain/Mailbox Purchase)
*   **License Validation:** Checks license status against an external server to enable appropriate features.
*   **Multiple Operation Modes:** Supports standard STDIO communication, Server-Sent Events (SSE) for web clients, and optional Supergateway integration.
*   **Configurable:** Retry logic, API endpoints, and feature flags can be configured via environment variables.

## Prerequisites

*   Node.js (v18+ recommended)
*   npm or yarn
*   A Smartlead API Key
*   A valid License Key obtained from our [license server](https://sea-turtle-app-64etr.ondigitalocean.app/)

## Available Tool Categories (Subject to License)

**FREE Tier:**
*   **Campaign Management**: Create, update, manage campaigns/sequences.
*   **Lead Management**: Add, update, track leads.

**BASIC Tier (includes all FREE features plus):**
*   **Campaign Statistics**: Fetch and analyze performance metrics.
*   **Smart Delivery**: Optimize email delivery, spam tests, DNS checks.
*   **Webhooks**: Manage webhook integrations.
*   **n8n Integration**: Connect with n8n workflows via SSE.

**PREMIUM Tier (includes all BASIC features plus):**
*   **Client Management**: Manage clients and permissions.
*   **Smart Senders**: Search, generate, purchase domains/mailboxes.
*   **Advanced Features**: Higher usage limits and premium capabilities.

---

## Contact

For support or questions, please contact:

*   **Email:** jonathan@jeantechnologies.com
*   **Website:** [jeantechnologies.com](https://jeantechnologies.com)
