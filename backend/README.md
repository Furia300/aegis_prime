# Aegis Prime v2.0 - Backend & Functions

## 1. Database Schema
Execute `schema.sql` in your Supabase SQL Editor to set up the tables for:
- Profiles & Roles
- Devices & Locations
- Intercepted Messages & Keylogs
- Alerts & Panic Sessions

## 2. Edge Functions
### `send-alert`
Triggers notifications to the security team when a new row is added to the `alerts` table.

**Deployment:**
```bash
supabase functions deploy send-alert --no-verify-jwt
```

**Database Webhook Setup:**
Go to Supabase Dashboard -> Database -> Webhooks -> Create Webhook:
- Name: `alert-notification`
- Table: `alerts`
- Events: `INSERT`
- Type: `HTTP Request`
- URL: `https://<project-ref>.supabase.co/functions/v1/send-alert`
- Method: `POST`
- HTTP Headers: `Content-Type: application/json`

## 3. Environment Variables
Ensure these are set in your Supabase project:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID` (legacy single chat)
- `TELEGRAM_CHAT_IDS` (recommended, comma-separated)
- `TELEGRAM_PARSE_MODE` (optional: `HTML`, `Markdown`, `MarkdownV2`)
