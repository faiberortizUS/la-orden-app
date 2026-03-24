/**
 * 🏛️ LA ORDEN — onboarding_payment.js
 * Activación de membresía via Stripe — mínima fricción
 */

// Links de Stripe (se actualizan desde Config.gs si el backend los sirve)
const STRIPE_LINKS = {
  ACTIVO:       window.STRIPE_ACTIVO       || '',
  CUSTODIO_PRO: window.STRIPE_CUSTODIO_PRO || '',
};

function renderObPayment() {
  return `
    <div id="ob-payment" style="min-height:100vh;padding-bottom:120px;">
      ${obProgressBar(5, 5)}

      <div style="padding:28px 20px 16px;text-align:center;">
        <div style="font-size:40px;margin-bottom:12px;">💎</div>
        <div style="font-family:var(--font-head);font-size:22px;font-weight:900;
          color:var(--text-1);margin-bottom:8px;">
          Activa tu acceso al Círculo
        </div>
        <div style="font-size:13px;color:var(--text-3);line-height:1.7;max-width:300px;margin:0 auto;">
          Tu estructura está diseñada. Tu Juramento está sellado.<br>
          Un paso separa tu intención de tu transformación real.
        </div>
      </div>

      <!-- Badge de seguridad Stripe -->
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;
        margin:0 20px 20px;padding:10px 16px;
        background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);
        border-radius:var(--r-md);">
        <span style="font-size:18px;">🔒</span>
        <span style="font-size:12px;color:var(--success);font-weight:600;">
          Pago cifrado con Stripe — 256-bit SSL
        </span>
      </div>

      <!-- Card ACTIVO -->
      <div style="margin:0 20px 16px;background:var(--bg-elevated);
        border:2px solid var(--border-gold);border-radius:var(--r-lg);
        overflow:hidden;box-shadow:0 0 30px rgba(212,168,67,0.1);">

        <div style="background:linear-gradient(135deg,rgba(212,168,67,0.15),rgba(212,168,67,0.05));
          padding:20px 20px 12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div style="font-size:11px;letter-spacing:0.2em;color:var(--gold);
                text-transform:uppercase;margin-bottom:4px;">Miembro Activo</div>
              <div style="font-family:var(--font-head);font-size:28px;font-weight:900;
                color:var(--text-1);">$35.000</div>
              <div style="font-size:12px;color:var(--text-3);">COP / mes · $1.167/día</div>
            </div>
            <div style="background:var(--gold);color:#000;font-size:10px;font-weight:800;
              padding:4px 10px;border-radius:99px;letter-spacing:0.1em;">POPULAR</div>
          </div>
        </div>

        <div style="padding:12px 20px 20px;">
          ${['Sistema de rangos y ICD', 'Células de Rendimiento', 'Registro diario de victorias',
            'Historial y estadísticas', 'Mentoría IA integrada'].map(f =>
            `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
              <span style="color:var(--gold);font-size:14px;">✓</span>
              <span style="font-size:13px;color:var(--text-2);">${f}</span>
            </div>`).join('')}

          <button onclick="openStripePayment('ACTIVO')"
            style="width:100%;margin-top:12px;padding:16px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:15px;font-weight:800;
              background:linear-gradient(135deg,var(--gold-dim),var(--gold));
              color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.3);">
            ⚡ ACTIVAR AHORA — $35.000/mes
          </button>
        </div>
      </div>

      <!-- Card CUSTODIO PRO -->
      <div style="margin:0 20px 16px;background:var(--bg-elevated);
        border:2px solid rgba(123,97,255,0.4);border-radius:var(--r-lg);overflow:hidden;">

        <div style="background:linear-gradient(135deg,rgba(123,97,255,0.1),transparent);
          padding:20px 20px 12px;">
          <div>
            <div style="font-size:11px;letter-spacing:0.2em;color:var(--electric);
              text-transform:uppercase;margin-bottom:4px;">👁️ Custodio Pro</div>
            <div style="font-family:var(--font-head);font-size:28px;font-weight:900;
              color:var(--text-1);">$80.000</div>
            <div style="font-size:12px;color:var(--text-3);">COP / mes · $2.667/día</div>
          </div>
        </div>

        <div style="padding:12px 20px 20px;">
          ${['Todo lo del Miembro Activo', 'Análisis de Profundidad Semanal',
            'Círculo de Élite exclusivo', 'Acceso prioritario a nuevas funciones'].map(f =>
            `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
              <span style="color:var(--electric);font-size:14px;">✓</span>
              <span style="font-size:13px;color:var(--text-2);">${f}</span>
            </div>`).join('')}

          <button onclick="openStripePayment('CUSTODIO_PRO')"
            style="width:100%;margin-top:12px;padding:16px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:15px;font-weight:800;
              background:linear-gradient(135deg,rgba(123,97,255,0.3),rgba(123,97,255,0.6));
              border:1px solid var(--electric);color:var(--text-1);">
            👁️ CUSTODIO PRO — $80.000/mes
          </button>
        </div>
      </div>

      <!-- Activar después (persuasión) -->
      <div style="padding:0 20px;text-align:center;">
        <button onclick="payLater()"
          style="background:none;border:none;color:var(--text-3);
            font-size:12px;cursor:pointer;text-decoration:underline;padding:8px;">
          Lo haré más tarde
        </button>
        <div id="payLaterMsg" style="display:none;margin-top:10px;padding:12px;
          background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);
          border-radius:var(--r-md);font-size:12px;color:var(--fire);line-height:1.6;">
          ⚠️ El 91% de quienes no activan en las primeras 24h nunca regresan.<br>
          Tu juramento ya está sellado. Solo falta honrarlo con acción.
        </div>
        <button id="skipPayBtn" style="display:none;margin-top:10px;width:100%;padding:12px;
          background:var(--bg-elevated);border:1px solid var(--border);
          border-radius:var(--r-lg);color:var(--text-3);cursor:pointer;font-size:13px;"
          onclick="skipPayment()">
          Continuar sin activar (acceso limitado)
        </button>
      </div>

    </div>
  `;
}

function openStripePayment(plan) {
  const url = STRIPE_LINKS[plan];
  if (!url) {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('🔐 La integración con la pasarela de pagos aún no ha sido configurada por el administrador. Continúa con acceso limitado seleccionando "Lo haré más tarde".');
    } else {
      alert('La pasarela de pagos no está configurada. Usa "Lo haré más tarde" por ahora.');
    }
    // Mostramos la opción manual de "lo haré más tarde" de inmediato para que pueda seguir
    payLater();
    return;
  }
  const tg = window.Telegram?.WebApp;
  if (tg) tg.openLink(url);
  else    window.open(url, '_blank');

  // Después de 3 segundos, mostrar botón para continuar
  setTimeout(() => {
    const btn = document.getElementById('skipPayBtn');
    if (btn) { btn.style.display = 'block'; btn.textContent = 'Ya realicé el pago → Continuar'; }
  }, 3000);
}

function payLater() {
  const msg     = document.getElementById('payLaterMsg');
  const skipBtn = document.getElementById('skipPayBtn');
  if (msg)     msg.style.display     = 'block';
  if (skipBtn) skipBtn.style.display = 'block';
}

function skipPayment() {
  finishOnboarding();
}
