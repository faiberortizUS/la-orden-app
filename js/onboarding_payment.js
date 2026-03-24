/**
 * 🏛️ LA ORDEN — onboarding_payment.js
 * Activación de membresía via Stripe — mínima fricción (USD Tiers)
 */

const STRIPE_LINKS = {
  MENSUAL:   window.STRIPE_MENSUAL   || '',
  SEMESTRAL: window.STRIPE_SEMESTRAL || '',
  ANUAL:     window.STRIPE_ANUAL     || ''
};

function renderObPayment() {
  return `
    <div id="ob-payment" style="min-height:100vh;padding-bottom:120px;">
      ${obProgressBar(5, 5)}

      <div style="padding:28px 20px 16px;text-align:center;">
        <div style="font-size:40px;margin-bottom:12px;">👑</div>
        <div style="font-family:var(--font-head);font-size:22px;font-weight:900;
          color:var(--text-1);margin-bottom:8px;">
          Activa tu membresía
        </div>
        <div style="font-size:13px;color:var(--text-3);line-height:1.7;max-width:300px;margin:0 auto;">
          Tu Juramento está firmado. El 91% pierde frente al último paso.<br>
          Gastar dinero en distracción es fácil; invertirlo en tu propio éxito requiere carácter.
        </div>
      </div>

      <!-- Badge Stripe -->
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;
        margin:0 20px 20px;padding:10px 16px;
        background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);
        border-radius:var(--r-md);">
        <span style="font-size:18px;">🔒</span>
        <span style="font-size:12px;color:var(--success);font-weight:600;">
          Pago cifrado con Stripe — Cancelación flexible
        </span>
      </div>

      <!-- MENSUAL -->
      <div style="margin:0 20px 16px;background:var(--bg-elevated);
        border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;">
        <div style="padding:20px;">
          <div style="font-size:11px;letter-spacing:0.2em;color:var(--text-2);
            text-transform:uppercase;margin-bottom:4px;">💎 Fricción Inicial</div>
          <div style="font-family:var(--font-head);font-size:26px;font-weight:900;
            color:var(--text-1);">$19 USD</div>
          <div style="font-size:12px;color:var(--text-3);">Pago mensual recurrente</div>
          <div style="height:12px;"></div>
          <button onclick="openStripePayment('MENSUAL')"
            style="width:100%;padding:12px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:800;
              background:var(--bg-overlay);color:var(--text-1);border:1px solid var(--border);">
            ACTIVAR MENSUAL
          </button>
        </div>
      </div>

      <!-- SEMESTRAL (RECOMENDADO) -->
      <div style="margin:0 20px 16px;background:var(--bg-elevated);
        border:2px solid var(--border-gold);border-radius:var(--r-lg);
        overflow:hidden;box-shadow:0 0 30px rgba(212,168,67,0.1);">
        
        <div style="background:var(--gold);color:#000;font-size:10px;font-weight:900;
          text-align:center;padding:4px;letter-spacing:0.2em;">OPCIÓN INTELIGENTE</div>

        <div style="background:linear-gradient(135deg,rgba(212,168,67,0.15),rgba(212,168,67,0.05));
          padding:20px 20px 12px;">
          <div style="font-size:11px;letter-spacing:0.2em;color:var(--gold);
            text-transform:uppercase;margin-bottom:4px;">🏆 Plan Semestral</div>
          <div style="font-family:var(--font-head);font-size:32px;font-weight:900;
            color:var(--text-1);">$89 USD</div>
          <div style="font-size:12px;color:var(--success);font-weight:700;">Ahorras $25 USD vs Mensual</div>
        </div>

        <div style="padding:12px 20px 20px;">
          ${['Acceso completo a todos los sistemas', 'Menos interrupciones cognitivas', 'Compromiso exacto para retular redes neuronales'].map(f =>
            `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
              <span style="color:var(--gold);font-size:14px;">✓</span>
              <span style="font-size:12px;color:var(--text-2);">${f}</span>
            </div>`).join('')}

          <button onclick="openStripePayment('SEMESTRAL')"
            style="width:100%;margin-top:12px;padding:16px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:15px;font-weight:800;
              background:linear-gradient(135deg,var(--gold-dim),var(--gold));
              color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.3);">
            ⚡ ACTIVAR SEMESTRAL — $89 USD
          </button>
        </div>
      </div>

      <!-- ANUAL -->
      <div style="margin:0 20px 16px;background:var(--bg-elevated);
        border:1px solid rgba(123,97,255,0.4);border-radius:var(--r-lg);overflow:hidden;">
        <div style="padding:20px;">
          <div style="font-size:11px;letter-spacing:0.2em;color:var(--electric);
            text-transform:uppercase;margin-bottom:4px;">👑 Plan Anual</div>
          <div style="font-family:var(--font-head);font-size:26px;font-weight:900;
            color:var(--text-1);">$149 USD</div>
          <div style="font-size:12px;color:rgba(123,97,255,0.9);font-weight:700;">Ahorras $79 USD (40%)</div>
          <div style="height:12px;"></div>
          <button onclick="openStripePayment('ANUAL')"
            style="width:100%;padding:12px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:800;
              background:rgba(123,97,255,0.15);color:var(--text-1);border:1px solid var(--electric);">
            ACTIVAR ANUAL
          </button>
        </div>
      </div>

      <!-- Activar después (persuasión) -->
      <div style="padding:0 20px;text-align:center;">
        <button onclick="payLater()"
          style="background:none;border:none;color:var(--text-3);
            font-size:12px;cursor:pointer;text-decoration:underline;padding:8px;">
          Activar más tarde
        </button>
        <div id="payLaterMsg" style="display:none;margin-top:10px;padding:12px;
          background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);
          border-radius:var(--r-md);font-size:12px;color:var(--fire);line-height:1.6;">
          ⚠️ *Disonancia detectada:* El 91% de los que posponen invertir en sí mismos para proteger el dinero equivalente a tres tazas de café, nunca logran cumplir su Juramento. El confort es gratis, la evolución no.<br><br>
          Tu acceso al cuartel virtual estará congelado hasta que proceses el pago.
        </div>
        <button id="skipPayBtn" style="display:none;margin-top:10px;width:100%;padding:12px;
          background:var(--bg-elevated);border:1px solid var(--border);
          border-radius:var(--r-lg);color:var(--text-2);cursor:pointer;font-size:13px;"
          onclick="skipPayment()">
          Ya entiendo la consecuencia → Salir al bot
        </button>
      </div>

    </div>
  `;
}

function openStripePayment(plan) {
  const url = STRIPE_LINKS[plan];
  if (!url) {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert('🔐 La integración con la pasarela de Stripe se inyectará al backend. Continúa con acceso limitado seleccionando "Activar más tarde".');
    } else {
      alert('La pasarela no está inyectada en el entorno de pruebas.');
    }
    payLater();
    return;
  }
  const tg = window.Telegram?.WebApp;
  const tid = tg?.initDataUnsafe?.user?.id || '';
  const finalUrl = url + (url.includes('?') ? '&' : '?') + 'client_reference_id=' + tid;
  
  if (tg) window.Telegram.WebApp.openLink(finalUrl);
  else    window.open(finalUrl, '_blank');

  setTimeout(() => {
    const btn = document.getElementById('skipPayBtn');
    if (btn) { btn.style.display = 'block'; btn.textContent = 'Ya realicé el pago (Verificando...) → Salir al bot'; }
  }, 4000);
}

function payLater() {
  const msg     = document.getElementById('payLaterMsg');
  const skipBtn = document.getElementById('skipPayBtn');
  if (msg)     msg.style.display     = 'block';
  if (skipBtn) skipBtn.style.display = 'block';
}

function skipPayment() {
  finishOnboarding(); // Este comando envía la señal "onboarding_completo" al bot
}

