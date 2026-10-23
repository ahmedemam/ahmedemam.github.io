const http = require('http');
const nodemailer = require('nodemailer');
const { notification } = require('./templates');

const env = process.env;
const PORT = env.PORT || 8787;
const NOTIFY_TO = (env.NOTIFY_TO || 'ahmedabdelazizemam@gmail.com,ahmed.emam@masteryhub-its.com').split(',').map((s) => s.trim());
const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS || 'https://ahmedemam.github.io').split(',').map((s) => s.trim());
const FROM = env.MAIL_FROM || `Ahmed Emam <${env.SMTP_USER}>`;
const ROLES = ['Recruiter', 'Founder', 'Investor', 'Engineer', 'Other'];
const DRY_RUN = env.MAIL_DRY_RUN === '1';

const transport = DRY_RUN
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(env.SMTP_PORT || 465),
      secure: (env.SMTP_PORT || '465') === '465',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
    });

// Naive per-IP limit: 5 requests per 10 minutes.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 600000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function send(res, status, body, origin) {
  const headers = { 'Content-Type': 'application/json' };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 10000) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

http.createServer(async (req, res) => {
  const origin = req.headers.origin;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin'
    });
    return res.end();
  }
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true }, origin);
  if (req.method !== 'POST' || req.url !== '/resume-request') return send(res, 404, { error: 'Not found' }, origin);
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return send(res, 403, { error: 'Origin not allowed' }, origin);

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (limited(ip)) return send(res, 429, { error: 'Too many requests' }, origin);

  let input;
  try { input = JSON.parse(await readBody(req)); } catch (e) { return send(res, 400, { error: 'Invalid JSON' }, origin); }

  if (input.website) return send(res, 200, { ok: true }, origin); // honeypot: pretend success to bots

  const email = String(input.email || '').trim().slice(0, 200);
  const role = String(input.role || '').trim();
  const company = String(input.company || '').trim().slice(0, 120);
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) return send(res, 400, { error: 'Invalid email' }, origin);
  if (!ROLES.includes(role)) return send(res, 400, { error: 'Invalid role' }, origin);

  const when = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short' }) + ' (Cairo)';

  try {
    const n = notification({ email, role, company, when });
    // Owner is notified only. The résumé is sent manually after vetting the requester.
    const result = await transport.sendMail({ from: FROM, to: NOTIFY_TO, replyTo: email, ...n });
    if (DRY_RUN) console.log(result.message.slice(0, 200));
    send(res, 200, { ok: true }, origin);
  } catch (e) {
    console.error('mail failed:', e.message);
    send(res, 502, { error: 'Could not send email' }, origin);
  }
}).listen(PORT, () => console.log(`mail server on :${PORT}${DRY_RUN ? ' (dry run)' : ''}`));
