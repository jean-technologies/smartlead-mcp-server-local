# Smartlead Simplified MCP Server (with Licensing)

This application provides a simplified interface or Multi-Channel Proxy (MCP) for interacting with the Smartlead API. It organizes Smartlead API calls into logical tools and categories, facilitating integration with various clients and workflows.

**Licensing:** This server integrates with an external license server (`smartlead-license-server`) to manage feature access based on user subscription tiers (e.g., Free, Basic, Premium). Availability of certain features and tool categories depends on the active license tier validated against the configured license server.

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
*   A Smartlead API Key.
*   A running instance of the [`smartlead-license-server`](https://github.com/your-username/smartlead-license-server) application (either deployed or running locally).
*   A valid License Key obtained from the `smartlead-license-server` instance.

## Setup Instructions

1.  **Clone this repository:**
    ```bash
    git clone https://github.com/your-username/smartlead-simplified.git
    cd smartlead-simplified
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file `.env.example` to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file and provide the necessary values:

    ```dotenv
    # --- Core Smartlead Configuration ---
    SMARTLEAD_API_KEY=your_smartlead_api_key_here # (Required)
    # SMARTLEAD_API_URL=https://custom-server.smartlead.ai/api/v1 # (Optional)

    # --- License Server Integration ---
    LICENSE_SERVER_URL=https://sea-turtle-app-64etr.ondigitalocean.app # (Required) URL of your license server
    SMARTLEAD_LICENSE_KEY=SL-XXXX-XXXX-XXXX # (Required) Your license key

    # --- Optional Configurations ---
    # Retry Logic
    SMARTLEAD_RETRY_MAX_ATTEMPTS=3
    SMARTLEAD_RETRY_INITIAL_DELAY=1000
    SMARTLEAD_RETRY_MAX_DELAY=10000
    SMARTLEAD_RETRY_BACKOFF_FACTOR=2

    # Supergateway Integration
    # USE_SUPERGATEWAY=false
    # SUPERGATEWAY_API_KEY=your_supergateway_api_key

    # License Level Override (for Development/Testing)
    # Force a specific tier locally, bypassing the server check.
    # Values: 'free', 'basic', 'premium'. Leave blank for normal operation.
    # LICENSE_LEVEL_OVERRIDE=
    ```
4.  **(If using TypeScript) Build the project:**
    ```bash
    npm run build
    ```

## Running the Application

The server can operate in different modes depending on your integration needs:

### 1. Standard Mode (STDIO)

This is the default mode for direct communication with clients like the Claude VSCode extension or other tools expecting MCP communication over standard input/output.

```bash
npm start
```

*(You may need to configure your MCP client (e.g., Claude settings JSON) to point to the `dist/index.js` script and pass the required environment variables like `SMARTLEAD_API_KEY`, `LICENSE_SERVER_URL`, `SMARTLEAD_LICENSE_KEY`).*

### 2. Server-Sent Events (SSE) Mode (for Web Clients like n8n)

This mode exposes an HTTP endpoint for clients that communicate via Server-Sent Events.

1.  **Start the server in SSE mode:**
    ```bash
    npm run start:sse
    ```
    *(This script likely starts the server configured to listen on an HTTP port, e.g., 3000, and handle SSE connections at an endpoint like `/sse`.)*

2.  **Connect from Client (e.g., n8n):**
    *   In your web client (like n8n's MCP Client node), configure it to connect to the server's SSE endpoint (e.g., `http://localhost:3000/sse`).
    *   If you need to expose your local server running in SSE mode to the internet (e.g., for n8n cloud), use a tunneling tool like `ngrok`:
        ```bash
        # Install ngrok if you haven't: npm install -g ngrok
        ngrok http 3000 # Or the port your SSE server runs on
        ```
        Use the public HTTPS URL provided by ngrok (e.g., `https://xxxxxxx.ngrok.io/sse`) in your client configuration.

### 3. Supergateway Mode (Alternative SSE/Management)

The Supergateway package can manage running the MCP server and exposing it via SSE.

```bash
# Ensure supergateway is installed (e.g., npx -y ...)
npx supergateway --stdio "node dist/index.js" --port 3000 --passEnv SMARTLEAD_API_KEY,LICENSE_SERVER_URL,SMARTLEAD_LICENSE_KEY
```
This runs the MCP server in stdio mode but makes it accessible via SSE on port 3000, automatically handling session management and passing necessary environment variables.

## Licensing System Integration

Feature access is controlled by the external `smartlead-license-server`.

*   **Validation:** The app validates the `SMARTLEAD_LICENSE_KEY` against the `LICENSE_SERVER_URL` on startup and before critical actions.
*   **Feature Enabling:** The license level (`free`, `basic`, `premium`) returned by the server determines which tool categories are enabled locally (based on `src/licensing/index.ts`).
*   **Offline Fallback:** If the license server is unreachable, the app may use cached data or default to FREE tier functionality.
*   **Feature Tokens:** Critical premium actions (like n8n integration) might use secure feature tokens obtained from the license server for stronger validation.

## Available Tool Categories (Subject to License)

*   **Campaign Management**: Create, update, manage campaigns/sequences.
*   **Lead Management**: Add, update, track leads.
*   **Campaign Statistics**: Fetch and analyze performance metrics.
*   **Smart Delivery**: Optimize email delivery, spam tests, DNS checks.
*   **Webhooks**: Manage webhook integrations.
*   **Client Management**: Manage clients and permissions.
*   **Smart Senders**: Search, generate, purchase domains/mailboxes. *(Note: Uses `https://smart-senders.smartlead.ai/api/v1`)*

---
*(You can add sections on Contributing, License, etc. if applicable)*
