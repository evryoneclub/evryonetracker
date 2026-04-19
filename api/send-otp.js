export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { email, code } = await req.json();
  if (!email || !code) {
    return new Response(JSON.stringify({ error: 'Manquant' }), { status: 400 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EVRYØNE COACH <coach@evryoneclub.com>',
        to: [email],
        subject: `${code} — Ton code EVRYØNE`,
        html: `<div style="background:#0a0a0a;color:#f0f0f0;font-family:Arial;padding:40px;text-align:center"><div style="color:#ff3333;letter-spacing:0.2em;margin-bottom:20px">EVRYØNE TRACKER</div><div style="font-size:18px;margin-bottom:16px">Ton code de connexion</div><div style="background:#161616;border-radius:16px;padding:28px;margin-bottom:16px"><div style="font-size:48px;font-weight:900;letter-spacing:10px;color:#ff3333">${code}</div></div><div style="color:#555;font-size:13px">Expire dans 10 minutes</div></div>`
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
