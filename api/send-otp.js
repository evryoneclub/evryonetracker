// api/send-otp.js
// Envoie le code OTP par email via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email et code requis' });

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EVRYØNE COACH <coach@evryoneclub.com>',
        to: [email],
        subject: `${code} — Ton code de connexion EVRYØNE`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#0a0a0a;color:#f0f0f0;font-family:Arial,sans-serif;padding:40px 20px;margin:0">
  <div style="max-width:400px;margin:0 auto;text-align:center">
    <div style="font-size:13px;letter-spacing:0.25em;color:#ff3333;margin-bottom:32px">EVRYØNE TRACKER</div>
    <div style="font-size:18px;margin-bottom:24px;color:#aaa">Ton code de connexion</div>
    <div style="background:#161616;border:1px solid #222;border-radius:16px;padding:32px;margin-bottom:24px">
      <div style="font-size:52px;font-weight:900;letter-spacing:12px;color:#ff3333">${code}</div>
    </div>
    <div style="font-size:13px;color:#555;line-height:1.6">Ce code expire dans <strong style="color:#f0f0f0">10 minutes</strong>.<br>Ne le partage jamais avec personne.</div>
    <div style="margin-top:32px;font-size:12px;color:#333">EVRYØNE COACH — coach.evryoneclub.com</div>
  </div>
</body>
</html>`
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
