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

const val = (record: Record<string, unknown>, key: string): string | null => {
  const v = record[key];
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v.trim() || null;
  return String(v);
};

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const BLOCK_NAMES: Record<string, string> = {
  org: 'Organization', data: 'Data & Infra', eng: 'Engineering',
  sales: 'Sales', support: 'Support', marketing: 'Marketing', product: 'Product',
};

const formatQuizMessage = (r: Record<string, unknown>) => {
  const lines: string[] = ['🧠 New Quiz Submission'];

  const name = val(r, 'name');
  const email = val(r, 'email');
  const role = val(r, 'role');
  const telegram = val(r, 'telegram');
  const dream = val(r, 'dream_outcome');
  const score = val(r, 'overall_score');
  const savingsLow = r['savings_low'] as number | undefined;
  const savingsHigh = r['savings_high'] as number | undefined;
  const blockScores = r['block_scores'] as Record<string, number> | undefined;
  const savingsByBlock = r['savings_by_block'] as {blockId:string; name:string; hc:number; low:number; high:number}[] | undefined;
  const selectedBlocks = r['selected_blocks'] as string[] | undefined;
  const headcounts = r['headcounts'] as Record<string, number> | undefined;
  const textAnswers = r['text_answers'] as Record<string, string> | undefined;

  // Contact info
  lines.push('');
  if (name) lines.push(`👤 ${name}`);
  if (role) lines.push(`💼 ${role}`);
  if (email) lines.push(`📧 ${email}`);
  if (telegram) lines.push(`✈️ ${telegram}`);

  // Dream outcome
  if (dream) {
    lines.push('');
    lines.push(`🎯 Dream outcome: ${dream}`);
  }

  // Org info
  lines.push('');
  if (headcounts && typeof headcounts === 'object') {
    const hcLabels: [string, string][] = [
      ['orgSize', 'Org size'], ['engSize', 'Engineering'], ['salesSize', 'Sales'],
      ['csSize', 'Support'], ['mktSize', 'Marketing'], ['prodSize', 'Product'],
    ];
    hcLabels.forEach(([key, label]) => {
      const v = headcounts[key];
      if (v) lines.push(`👥 ${label}: ${v} people`);
    });
  }

  if (selectedBlocks && Array.isArray(selectedBlocks)) {
    const funcs = selectedBlocks.filter(b => b !== 'org' && b !== 'data').map(b => BLOCK_NAMES[b] || b);
    if (funcs.length) lines.push(`📋 Functions: ${funcs.join(', ')}`);
  }

  // Score
  lines.push('');
  if (score) lines.push(`🏆 Overall Score: ${score}/100`);

  if (blockScores && typeof blockScores === 'object') {
    const entries = Object.entries(blockScores).filter(([, v]) => v >= 0);
    if (entries.length > 0) {
      entries.forEach(([block, s]) => {
        const bar = s >= 70 ? '🟢' : s >= 40 ? '🟡' : '🔴';
        lines.push(`  ${bar} ${BLOCK_NAMES[block] || block}: ${s}/100`);
      });
    }
  }

  // Savings
  if (savingsLow && savingsHigh) {
    lines.push('');
    lines.push(`💰 Total AI Opportunity: ${fmtMoney(savingsLow)} – ${fmtMoney(savingsHigh)}/yr`);
  }

  if (savingsByBlock && Array.isArray(savingsByBlock) && savingsByBlock.length > 0) {
    savingsByBlock.forEach(item => {
      lines.push(`  • ${item.name} (${item.hc} ppl): ${fmtMoney(item.low)}–${fmtMoney(item.high)}`);
    });
  }

  // Free-text answers
  if (textAnswers && typeof textAnswers === 'object') {
    const entries = Object.entries(textAnswers).filter(([, v]) => v?.trim());
    if (entries.length > 0) {
      lines.push('');
      lines.push('📝 Text answers:');
      entries.forEach(([key, v]) => {
        lines.push(`  ${key}: ${v}`);
      });
    }
  }

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
    res.status(500).json({ ok: false, message: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS' });
    return;
  }

  let payload: WebhookPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ ok: false, message: 'Invalid JSON payload' });
    return;
  }

  if (payload?.type && payload.type !== 'INSERT') {
    res.status(200).json({ ok: true, message: 'Ignored non-insert event' });
    return;
  }

  const record = payload?.record || payload?.new || payload?.data || (payload as any) || {};
  const message = formatQuizMessage(record);

  try {
    await Promise.all(
      chatIds.map((chatId) =>
        bot!.sendMessage(chatId, message, { disable_web_page_preview: true })
      )
    );
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, message: 'Failed to send message' });
  }
}
