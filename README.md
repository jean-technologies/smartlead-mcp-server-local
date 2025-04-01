# Smartlead MCP Server

This is a Model Context Protocol (MCP) server for Smartlead campaign management integration. It provides tools for creating and managing campaigns, updating campaign settings, and managing campaign sequences.

## Features

- Create new campaigns
- Update campaign schedule settings
- Update campaign general settings
- Get campaign details
- List all campaigns with filtering options
- Save campaign email sequences

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your Smartlead API key:

```
SMARTLEAD_API_KEY=your_api_key_here
```

4. Build the project:

```bash
npm run build
```

## Usage

### Standalone Usage

To start the server directly:

```bash
npm start
```

### Integration with Claude

To use this MCP server with Claude, you need to add it to the MCP settings file:

1. For Claude VSCode extension, add it to `c:\Users\<username>\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
2. For Claude desktop app, add it to `%APPDATA%\Claude\claude_desktop_config.json` on Windows

Example configuration:

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "node",
      "args": ["E:/mcp-servers/smartlead/dist/index.js"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Replace `your_api_key_here` with your actual Smartlead API key.

## Configuration

The server can be configured using environment variables:

- `SMARTLEAD_API_KEY` (required): Your Smartlead API key
- `SMARTLEAD_API_URL` (optional): Custom API URL (defaults to https://server.smartlead.ai/api/v1)
- `SMARTLEAD_RETRY_MAX_ATTEMPTS`: Maximum retry attempts for API calls (default: 3)
- `SMARTLEAD_RETRY_INITIAL_DELAY`: Initial delay in milliseconds for retries (default: 1000)
- `SMARTLEAD_RETRY_MAX_DELAY`: Maximum delay in milliseconds for retries (default: 10000)
- `SMARTLEAD_RETRY_BACKOFF_FACTOR`: Backoff factor for retry delays (default: 2)

## Available Tools

### smartlead_create_campaign

Create a new campaign in Smartlead.

**Parameters:**
- `name` (required): Name of the campaign
- `client_id` (optional): Client ID for the campaign

### smartlead_update_campaign_schedule

Update a campaign's schedule settings.

**Parameters:**
- `campaign_id` (required): ID of the campaign to update
- `timezone`: Timezone for the campaign (e.g., "America/Los_Angeles")
- `days_of_the_week`: Days of the week to send emails (1-7, where 1 is Monday)
- `start_hour`: Start hour in 24-hour format (e.g., "09:00")
- `end_hour`: End hour in 24-hour format (e.g., "17:00")
- `min_time_btw_emails`: Minimum time between emails in minutes
- `max_new_leads_per_day`: Maximum number of new leads per day
- `schedule_start_time`: Schedule start time in ISO format

### smartlead_update_campaign_settings

Update a campaign's general settings.

**Parameters:**
- `campaign_id` (required): ID of the campaign to update
- `name`: New name for the campaign
- `status`: Status of the campaign (active, paused, completed)
- `settings`: Additional campaign settings

### smartlead_get_campaign

Get details of a specific campaign by ID.

**Parameters:**
- `campaign_id` (required): ID of the campaign to retrieve

### smartlead_list_campaigns

List all campaigns with optional filtering.

**Parameters:**
- `status`: Filter campaigns by status (active, paused, completed, all)
- `limit`: Maximum number of campaigns to return
- `offset`: Offset for pagination

### smartlead_save_campaign_sequence

Save a sequence of emails for a campaign.

**Parameters:**
- `campaign_id` (required): ID of the campaign
- `sequence` (required): Array of email sequence items, each with:
  - `subject` (required): Email subject line
  - `body` (required): Email body content
  - `wait_days`: Days to wait before sending this email

## License

MIT
