// Follows Supabase Edge Functions Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const TELEGRAM_CHAT_IDS_RAW = Deno.env.get('TELEGRAM_CHAT_IDS') ?? Deno.env.get('TELEGRAM_CHAT_ID') ?? '';
const TELEGRAM_PARSE_MODE = Deno.env.get('TELEGRAM_PARSE_MODE') ?? 'HTML';

function normalizeParseMode(value: string) {
  const v = value.trim().toLowerCase();
  if (v === 'markdown') return 'Markdown';
  if (v === 'markdownv2') return 'MarkdownV2';
  return 'HTML';
}

function parseChatIds(raw: string) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function splitTelegramMessage(text: string, maxLen = 3800) {
  if (text.length <= maxLen) return [text];
  const parts: string[] = [];
  let i = 0;
  while (i < text.length) {
    parts.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return parts;
}

async function telegramSendMessage(chatId: string, text: string) {
  const parseMode = normalizeParseMode(TELEGRAM_PARSE_MODE);
  const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Telegram API error: ${resp.status} ${body}`.slice(0, 1200));
  }
}

interface AlertPayload {
  type: 'INSERT' | 'UPDATE';
  table: string;
  record: {
    id: string;
    device_id: string;
    type: string;
    severity: string;
    message: string;
    created_at: string;
  };
  schema: string;
}

serve(async (req) => {
  try {
    const payload: AlertPayload = await req.json();

    // Only trigger on new alerts
    if (payload.type === 'INSERT' && payload.table === 'alerts') {
      const alert = payload.record;
      
      const chatIds = parseChatIds(TELEGRAM_CHAT_IDS_RAW);
      const createdAt = new Date(alert.created_at).toLocaleString();

      const messageHtml = [
        `<b>AEGIS PRIME ALERT</b>`,
        ``,
        `<b>Type:</b> <code>${escapeHtml(String(alert.type || '').toUpperCase())}</code>`,
        `<b>Severity:</b> <code>${escapeHtml(String(alert.severity || '').toUpperCase())}</code>`,
        `<b>Device:</b> <code>${escapeHtml(String(alert.device_id || ''))}</code>`,
        `<b>Message:</b> ${escapeHtml(String(alert.message || ''))}`,
        `<b>Time:</b> <code>${escapeHtml(createdAt)}</code>`,
        ``,
        `<code>alert_id=${escapeHtml(String(alert.id || ''))}</code>`,
      ].join('\n');

      if (!TELEGRAM_BOT_TOKEN || chatIds.length === 0) {
        return new Response(JSON.stringify({ success: true, message: "Alert processed (telegram disabled)" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      const chunks = splitTelegramMessage(messageHtml);
      for (const chatId of chatIds) {
        for (const chunk of chunks) {
          await telegramSendMessage(chatId, chunk);
        }
      }

      return new Response(JSON.stringify({ success: true, message: "Alert processed" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ message: "Not an alert insert event" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
