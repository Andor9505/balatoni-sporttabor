export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    const {
      gyermekNev, szuletesiDatum, lakcim, tajSzam,
      szuloNev, telefon1, telefon2, email, szuloLakcim
    } = data;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a3d62; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin:0; font-size: 22px;">🏖️ Új jelentkezés – Balatoni Sport Tábor</h1>
          <p style="margin: 8px 0 0; opacity: 0.8;">Július 6–10. · Balatonboglár</p>
        </div>
        <div style="background: #f5f9ff; padding: 24px; border: 1px solid #d0e8f7;">
          <h2 style="color: #0a3d62; font-size: 16px; margin: 0 0 16px;">👦 Gyermek adatai</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #5a7a96; width: 40%;">Név</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${gyermekNev}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">Születési dátum</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${szuletesiDatum}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">Lakcím</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${lakcim}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">TAJ-szám</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${tajSzam}</td></tr>
          </table>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #d0e8f7; border-top: none;">
          <h2 style="color: #0a3d62; font-size: 16px; margin: 0 0 16px;">👨‍👧 Szülő / gondviselő adatai</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #5a7a96; width: 40%;">Név</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${szuloNev}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">Telefon 1</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${telefon1}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">Telefon 2</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${telefon2 || '–'}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">E-mail</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #5a7a96;">Lakcím</td><td style="padding: 8px 0; font-weight: bold; color: #0d1b2a;">${szuloLakcim || 'Megegyezik a gyermekével'}</td></tr>
          </table>
        </div>
        <div style="background: #e8f4fd; padding: 16px 24px; border-radius: 0 0 12px 12px; border: 1px solid #d0e8f7; border-top: none;">
          <p style="margin: 0; font-size: 13px; color: #5a7a96;">Ez az email automatikusan lett küldve a Balatoni Sport Tábor weboldaláról.</p>
        </div>
      </div>
    `;

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Balatoni Sport Tábor", email: "noreply@balatoni-sporttabor.pages.dev" },
        to: [{ email: env.RECIPIENT_EMAIL }],
        subject: `Új jelentkezés: ${gyermekNev}`,
        htmlContent,
      }),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.text();
      return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}