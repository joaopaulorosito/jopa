#!/usr/bin/env bash
# Fetches a fresh IDS-SESSION-ID for the Informatica catalog-discovery MCP
# server (registered in .mcp.json) using OAuth2 client_credentials.
#
# Usage:
#   IDS_CLIENT_ID=... IDS_CLIENT_SECRET=... ./scripts/get-informatica-session-id.sh
#
# The token expires in ~30 minutes. Re-run this script and re-export
# IDS_SESSION_ID whenever the MCP server starts failing with an auth error.
set -euo pipefail

: "${IDS_CLIENT_ID:?Set IDS_CLIENT_ID}"
: "${IDS_CLIENT_SECRET:?Set IDS_CLIENT_SECRET}"

response=$(curl -sS -X POST "https://dmp-us.informaticacloud.com/authz-service/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${IDS_CLIENT_ID}" \
  -d "client_secret=${IDS_CLIENT_SECRET}")

token=$(python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])" <<<"$response")

echo "export IDS_SESSION_ID=\"$token\""
