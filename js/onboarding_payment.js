/**
 * 🏛️ LA ORDEN — onboarding_payment.js
 * Activación de membresía via Stripe — USD Tiers · Elite Copy v2
 */

const STRIPE_LINKS = {
  MENSUAL:   window.STRIPE_MENSUAL   || '',
  SEMESTRAL: window.STRIPE_SEMESTRAL || '',
  ANUAL:     window.STRIPE_ANUAL     || ''
};

// Beneficios completos — todos los planes los incluyen. La diferencia es solo el ahorro.
const BENEFICIOS = [
  { icon: '📊', text: 'Índice de Consistencia Disciplinada (ICD) — tu espejo matemático diario' },
  { icon: '🔔', text: 'Activación matutina diaria: el sistema te recuerda tus compromisos al inicio del día' },
  { icon: '⚠️', text: 'Sistema Anti-Abandono: si el día termina sin reporte, La Orden aparece en tu chat antes de que se apague la luz' },
  { icon: '📝', text: 'Informe semanal personalizado según tu progreso real y patrones de comportamiento de la semana' },
  { icon: '🔥', text: 'Línea Activa y Escudos de Consistencia — protege tu racha o úsalos estratégicamente' },
  { icon: '👁️', text: 'Sistema de Rangos — de Aspirante a Custodio. No se piden. Se ganan con datos reales' },
  { icon: '⚔️', text: 'Célula de Rendimiento — un equipo que ve tu progreso. Tu disciplina los impulsa o los decepciona' },
  { icon: '📜', text: 'Contratos de 30 días renovables — estructura, fecha de cierre y consecuencias reales' },
];

function _renderBeneficios(accentColor) {
  return BENEFICIOS.map(b => `
    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;">
      <span style="font-size:15px;flex-shrink:0;margin-top:1px;">${b.icon}</span>
      <span style="font-size:12px;color:var(--text-2);line-height:1.55;">${b.text}</span>
    </div>`).join('');
}

function renderObPayment() {
  return `
    <div id="ob-payment" style="min-height:100vh;padding-bottom:120px;">

      <!-- Barra de progreso sticky sin interferencia -->
      <div style="position:sticky;top:0;z-index:20;background:var(--bg-base);padding:12px 20px 8px;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="flex:1;background:var(--bg-elevated);border-radius:99px;height:4px;">
            <div style="height:4px;border-radius:99px;background:linear-gradient(90deg,var(--electric),var(--gold));width:100%;transition:width 0.4s ease;"></div>
          </div>
          <span style="font-size:11px;color:var(--text-3);min-width:28px;">5/5</span>
        </div>
      </div>

      <!-- Header -->
      <div style="padding:24px 20px 16px;text-align:center;">
        <div style="font-size:42px;margin-bottom:10px;">👑</div>
        <div style="font-family:var(--font-head);font-size:22px;font-weight:900;color:var(--text-1);margin-bottom:8px;">
          El último paso
        </div>
        <div style="font-size:13px;color:var(--text-3);line-height:1.75;max-width:310px;margin:0 auto;">
          Tu estructura está lista. Tu Juramento está sellado.<br>
          Ahora elige el período de tu membresía — los <strong style="color:var(--text-1);">beneficios son idénticos en los tres</strong>. La diferencia es únicamente el ahorro que obtienes.
        </div>
      </div>

      <!-- Badge Stripe -->
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;
        margin:0 20px 20px;padding:10px 16px;
        background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);
        border-radius:var(--r-md);">
        <span style="font-size:16px;">🔒</span>
        <span style="font-size:12px;color:var(--success);font-weight:600;">
          Pago cifrado con Stripe · Cancela cuando quieras
        </span>
      </div>

      <!-- MENSUAL -->
      <div style="margin:0 20px 14px;background:var(--bg-elevated);
        border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;">
        <div style="padding:18px 18px 6px;">
          <div style="font-size:10px;letter-spacing:0.2em;color:var(--text-3);text-transform:uppercase;margin-bottom:4px;">💎 Mensual · Máxima flexibilidad</div>
          <div style="display:flex;align-items:baseline;gap:6px;">
            <div style="font-family:var(--font-head);font-size:30px;font-weight:900;color:var(--text-1);">$19</div>
            <div style="font-size:13px;color:var(--text-3);">USD / mes</div>
          </div>
          <div style="font-size:12px;color:var(--text-3);margin-top:1px;">Sin compromisos. Renueva o cancela cuando quieras.</div>
        </div>
        <details style="padding:0 18px 14px;">
          <summary style="font-size:12px;color:var(--gold);cursor:pointer;list-style:none;padding:8px 0;border-top:1px solid var(--border);margin-top:8px;">Ver qué incluye ▾</summary>
          <div style="margin-top:10px;">${_renderBeneficios('var(--gold)')}</div>
        </details>
        <div style="padding:0 18px 18px;">
          <button class="tappable" onclick="openStripePayment('MENSUAL')"
            style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:800;
              background:var(--bg-overlay);color:var(--text-1);">
            ACTIVAR MENSUAL → $19/mes
          </button>
        </div>
      </div>

      <!-- SEMESTRAL (FEATURED) -->
      <div style="margin:0 20px 14px;background:var(--bg-elevated);
        border:2px solid var(--border-gold);border-radius:var(--r-lg);
        overflow:hidden;box-shadow:0 0 32px rgba(212,168,67,0.12);">

        <div style="background:var(--gold);color:#0A0A0F;font-size:10px;font-weight:900;
          text-align:center;padding:5px;letter-spacing:0.2em;">★ LA ELECCIÓN MÁS INTELIGENTE</div>

        <div style="background:linear-gradient(135deg,rgba(212,168,67,0.12),rgba(212,168,67,0.03));padding:18px 18px 6px;">
          <div style="font-size:10px;letter-spacing:0.2em;color:var(--gold);text-transform:uppercase;margin-bottom:4px;">🏆 Semestral · 6 meses de momentum</div>
          <div style="display:flex;align-items:baseline;gap:6px;">
            <div style="font-family:var(--font-head);font-size:34px;font-weight:900;color:var(--text-1);">$89</div>
            <div style="font-size:13px;color:var(--text-3);">USD / 6 meses</div>
          </div>
          <div style="font-size:12px;color:var(--success);font-weight:700;margin-top:2px;">Ahorras $25 USD vs Mensual · ~$14.8/mes efectivo</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px;">El cerebro necesita mínimo 6 meses para instalar un hábito de forma permanente. Este plan cubre exactamente eso.</div>
        </div>
        <details style="padding:0 18px 14px;" open>
          <summary style="font-size:12px;color:var(--gold);cursor:pointer;list-style:none;padding:8px 0;border-top:1px solid rgba(212,168,67,0.3);margin-top:8px;">Ver qué incluye ▾</summary>
          <div style="margin-top:10px;">${_renderBeneficios('var(--gold)')}</div>
        </details>
        <div style="padding:0 18px 18px;">
          <button class="tappable" onclick="openStripePayment('SEMESTRAL')"
            style="width:100%;padding:16px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:15px;font-weight:800;
              background:linear-gradient(135deg,var(--gold-dim),var(--gold));
              color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.35);">
            ⚡ ACTIVAR SEMESTRAL → $89 total
          </button>
        </div>
      </div>

      <!-- ANUAL -->
      <div style="margin:0 20px 14px;background:var(--bg-elevated);
        border:1px solid rgba(123,97,255,0.35);border-radius:var(--r-lg);overflow:hidden;">
        <div style="padding:18px 18px 6px;">
          <div style="font-size:10px;letter-spacing:0.2em;color:var(--electric);text-transform:uppercase;margin-bottom:4px;">👑 Anual · El pacto definitivo</div>
          <div style="display:flex;align-items:baseline;gap:6px;">
            <div style="font-family:var(--font-head);font-size:30px;font-weight:900;color:var(--text-1);">$149</div>
            <div style="font-size:13px;color:var(--text-3);">USD / 12 meses</div>
          </div>
          <div style="font-size:12px;color:rgba(123,97,255,0.9);font-weight:700;margin-top:2px;">Ahorras $79 USD (40%) · ~$12.4/mes efectivo</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Menos de lo que cuesta una sola sesión de coaching. Te audita los 365 días del año.</div>
        </div>
        <details style="padding:0 18px 14px;">
          <summary style="font-size:12px;color:var(--electric);cursor:pointer;list-style:none;padding:8px 0;border-top:1px solid rgba(123,97,255,0.2);margin-top:8px;">Ver qué incluye ▾</summary>
          <div style="margin-top:10px;">${_renderBeneficios('var(--electric)')}</div>
        </details>
        <div style="padding:0 18px 18px;">
          <button class="tappable" onclick="openStripePayment('ANUAL')"
            style="width:100%;padding:13px;border:1px solid var(--electric);border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:800;
              background:rgba(123,97,255,0.12);color:var(--text-1);">
            ACTIVAR ANUAL → $149 total
          </button>
        </div>
      </div>

      <!-- Activar después o Continuar -->
      <div style="padding:4px 20px 8px;text-align:center;">
        <button id="skipPayBtn" onclick="finishOnboarding(false)"
          style="display:none;width:100%;padding:14px;border:none;border-radius:var(--r-lg);
            cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:900;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;margin-bottom:12px;">
          CONTINUAR →
        </button>
        <button onclick="_showPayLaterModal()"
          style="background:none;border:none;color:var(--text-3);
            font-size:12px;cursor:pointer;text-decoration:underline;padding:8px;">
          Activar más tarde
        </button>
      </div>

    </div>

    <!-- MODAL INVASIVO "PAY LATER" -->
    <div id="payLaterModal" style="display:none;position:fixed;inset:0;z-index:999;
      background:rgba(0,0,0,0.92);
      display:none;align-items:center;justify-content:center;padding:24px;">
      <div style="background:var(--bg-elevated);border:1px solid rgba(255,107,53,0.5);
        border-radius:var(--r-lg);padding:28px 24px;max-width:360px;width:100%;
        box-shadow:0 0 60px rgba(255,107,53,0.2);text-align:center;">
        <div style="font-size:42px;margin-bottom:12px;">🚨</div>
        <div style="font-family:var(--font-head);font-size:18px;font-weight:900;color:var(--fire);margin-bottom:12px;">
          Un momento. Esto es serio.
        </div>
        <div style="font-size:13px;color:var(--text-2);line-height:1.75;margin-bottom:16px;">
          Acabas de diseñar tu estructura. Firmaste un Juramento. Hiciste lo más difícil.<br><br>
          <strong style="color:var(--text-1);">Y tu cerebro está intentando sabotearte por el precio de tres cafés al mes.</strong><br><br>
          El 91% de los que posponen este paso nunca regresan. No porque no quieran. Porque el ímpetu inicial se evapora exactamente en este instante.<br><br>
          <span style="color:var(--fire);font-weight:700;">Posponer no es neutro. Es cancelar en silencio.</span>
        </div>
        <button onclick="_closePayLaterModal(false)"
          style="width:100%;padding:14px;border:none;border-radius:var(--r-lg);
            cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:900;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;margin-bottom:10px;">
          ↩ VOLVER Y ACTIVAR MI MEMBRESÍA
        </button>
        <button onclick="_closePayLaterModal(true)"
          style="width:100%;padding:10px;background:none;border:1px solid var(--border);
            border-radius:var(--r-lg);color:var(--text-3);font-size:12px;cursor:pointer;">
          Entendido, asumo las consecuencias
        </button>
      </div>
    </div>
  `;
}

function _showPayLaterModal() {
  const modal = document.getElementById('payLaterModal');
  if (modal) modal.style.display = 'flex';
}

function _closePayLaterModal(skip) {
  const modal = document.getElementById('payLaterModal');
  if (modal) modal.style.display = 'none';
  if (skip) skipPayment();
}

function openStripePayment(plan) {
  const url = STRIPE_LINKS[plan];
  if (!url) {
    const tg = window.Telegram?.WebApp;
    if (tg) tg.showAlert('⚙️ La pasarela de Stripe no está configurada aún. Usa "Activar más tarde" para continuar y activa tu membresía desde el chat del bot.');
    else alert('La pasarela no está configurada en este entorno.');
    return;
  }
  const tg  = window.Telegram?.WebApp;
  const tid = tg?.initDataUnsafe?.user?.id || '';
  const finalUrl = url + (url.includes('?') ? '&' : '?') + 'client_reference_id=' + tid;

  if (tg) window.Telegram.WebApp.openLink(finalUrl);
  else    window.open(finalUrl, '_blank');

  setTimeout(() => {
    const btn = document.getElementById('skipPayBtn');
    if (btn) { btn.style.display = 'block'; btn.textContent = 'Ya realicé el pago → Continuar'; }
  }, 4000);
}

function skipPayment() {
  finishOnboarding(true);
}
