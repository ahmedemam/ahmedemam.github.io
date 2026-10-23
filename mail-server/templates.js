const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ACCENT = '#E0ED34';
const INK = '#0A0A0A';

function shell(preheader, inner) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"></head>
<body style="margin:0;padding:0;background:#f2f2ee;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2ee;padding:32px 12px;"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${INK};border-radius:8px;overflow:hidden;">
    <tr><td style="padding:28px 32px 0;">
      <span style="font-size:20px;font-weight:700;letter-spacing:-0.03em;color:#fafafa;">Ahmed<span style="color:${ACCENT};">.</span>Emam</span>
    </td></tr>
    ${inner}
    <tr><td style="padding:24px 32px 28px;border-top:1px solid #222;font-size:12px;color:#8f8f8f;">
      Founder &amp; Staff Software Engineer · Cairo<br>
      <a href="https://ahmedemam.github.io" style="color:#8f8f8f;">ahmedemam.github.io</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function row(label, value) {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #222;width:110px;font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6b6b6b;vertical-align:top;">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid #222;font-size:15px;color:#fafafa;">${value}</td>
  </tr>`;
}

function notification({ email, role, company, when }) {
  const subject = `Résumé request: ${role}${company ? ' at ' + company : ''} (${email})`;
  const html = shell(`${email} requested your résumé`, `
    <tr><td style="padding:28px 32px 8px;">
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;color:${ACCENT};">NEW RÉSUMÉ REQUEST</div>
      <h1 style="margin:8px 0 0;font-size:26px;line-height:1.2;font-weight:500;letter-spacing:-0.03em;color:#fafafa;">Someone wants your résumé.</h1>
    </td></tr>
    <tr><td style="padding:16px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('Email', `<a href="mailto:${esc(email)}" style="color:${ACCENT};text-decoration:none;">${esc(email)}</a>`)}
        ${row('Role', esc(role))}
        ${row('Company', company ? esc(company) : '<span style="color:#6b6b6b;">Not provided</span>')}
        ${row('Received', esc(when))}
      </table>
    </td></tr>
    <tr><td style="padding:20px 32px 28px;">
      <a href="mailto:${esc(email)}?subject=${encodeURIComponent('Following up on my résumé')}" style="display:inline-block;padding:13px 22px;border-radius:3px;background:${ACCENT};color:${INK};font-size:14px;font-weight:600;text-decoration:none;">Reply to ${esc(email)}</a>
      <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#8f8f8f;">They already received the résumé link automatically.</p>
    </td></tr>`);
  const text = `New résumé request\n\nEmail: ${email}\nRole: ${role}\nCompany: ${company || 'Not provided'}\nReceived: ${when}\n`;
  return { subject, html, text };
}

function confirmation({ resumeUrl, calendlyUrl }) {
  const subject = 'My résumé, as requested';
  const html = shell('Here is my résumé. Thanks for reaching out.', `
    <tr><td style="padding:28px 32px 8px;">
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;color:${ACCENT};">RÉSUMÉ</div>
      <h1 style="margin:8px 0 0;font-size:26px;line-height:1.2;font-weight:500;letter-spacing:-0.03em;color:#fafafa;">Thanks for reaching out.</h1>
      <p style="margin:14px 0 0;font-size:15px;line-height:1.6;color:#b5b5b5;">Here is my résumé. If anything stands out, or you would like to talk, I would be glad to hear from you.</p>
    </td></tr>
    <tr><td style="padding:20px 32px 28px;">
      <a href="${esc(resumeUrl)}" style="display:inline-block;padding:13px 22px;border-radius:3px;background:${ACCENT};color:${INK};font-size:14px;font-weight:600;text-decoration:none;">Download résumé (PDF)</a>
      <a href="${esc(calendlyUrl)}" style="display:inline-block;margin-left:8px;padding:12px 22px;border-radius:3px;border:1px solid #3a3a3a;color:#fafafa;font-size:14px;font-weight:500;text-decoration:none;">Book a 30-min call</a>
    </td></tr>`);
  const text = `Thanks for reaching out.\n\nHere is my résumé: ${resumeUrl}\n\nBook a call: ${calendlyUrl}\n\nAhmed Emam\n`;
  return { subject, html, text };
}

module.exports = { notification, confirmation };
