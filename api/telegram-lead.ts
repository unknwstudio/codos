import type { VercelRequest, VercelResponse } from '@vercel/node';
import TelegramBot from 'node-telegram-bot-api';

type WebhookPayload = {
  type?: string;
  table?: string;
  record?: Record<string, unknown>;
  new?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = (process.env.TELEGRAM_CHAT_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

const bot = botToken ? new TelegramBot(botToken, { polling: false }) : null;

const getValue = (record: Record<string, unknown>, key: string) => {
  const value = record[key];
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return value.trim() || null;
  }
  return String(value);
};

const formatLeadMessage = (record: Record<string, unknown>) => {
  const lines: string[] = ['New Codos lead'];
  const createdAt = getValue(record, 'created_at');

  if (createdAt) {
    lines.push(`Submitted: ${createdAt}`);
  }

  const fields = [
    { label: 'Name', keys: ['name'] },
    { label: 'Team size', keys: ['team_size', 'teamSize'] },
    { label: 'Role', keys: ['role'] },
    { label: 'Looking for', keys: ['looking_for', 'lookingFor'] },
    { label: 'Tried', keys: ['tried'] },
    { label: 'Budget', keys: ['budget'] },
    { label: 'Source', keys: ['source'] },
    { label: 'Email', keys: ['email'] },
    { label: 'Telegram', keys: ['telegram'] },
  ];

  fields.forEach(({ label, keys }) => {
    const value = keys.map((key) => getValue(record, key)).find(Boolean);
    if (value) {
      lines.push(`${label}: ${value}`);
    }
  });

  return lines.join('\n');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  if (process.env.LEADS_WEBHOOK_SECRET) {
    const headerSecret = req.headers['x-webhook-secret'];
    if (!headerSecret || headerSecret !== process.env.LEADS_WEBHOOK_SECRET) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }
  }

  if (!bot || !botToken || chatIds.length === 0) {
    res.status(500).json({
      ok: false,
      message: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS',
    });
    return;
  }

  let payload: WebhookPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (error) {
    res.status(400).json({ ok: false, message: 'Invalid JSON payload' });
    return;
  }

  if (payload?.type && payload.type !== 'INSERT') {
    res.status(200).json({ ok: true, message: 'Ignored non-insert event' });
    return;
  }

  const record =
    payload?.record || payload?.new || payload?.data || (payload as any) || {};
  const message = formatLeadMessage(record);

  try {
    await Promise.all(
      chatIds.map((chatId) =>
        bot.sendMessage(chatId, message, {
          disable_web_page_preview: true,
        })
      )
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Failed to send message' });
  }
}
