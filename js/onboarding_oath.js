/**
 * 🏛️ LA ORDEN — onboarding_oath.js
 * El Juramento — Pacto de Acero
 * Pantalla dramática: texto que aparece línea a línea, firma del compromiso
 */

const OATH_LINES = [
  { text: 'Yo, {nombre},', delay: 0 },
  { text: 'en este día declaro guerra contra mi yo ordinario.', delay: 600 },
  { text: '', delay: 1000 },
  { text: 'Me comprometo a ejecutar mis compromisos', delay: 1200 },
  { text: 'cada día, sin excusas, sin negociaciones.', delay: 1800 },
  { text: '', delay: 2200 },
  { text: 'Entiendo que el promedio es el enemigo.', delay: 2400 },
  { text: 'Entiendo que la consistencia derrota al talento.', delay: 3000 },
  { text: 'Entiendo que este sistema me verá y me medirá.', delay: 3600 },
  { text: '', delay: 4000 },
  { text: 'Hoy no firmo con tinta.', delay: 4200 },
  { text: 'Firmo con disciplina.', delay: 4800 },
  { text: 'Firmo con resultados.', delay: 5200 },
  { text: 'Firmo con mi legado.', delay: 5600 },
  { text: '', delay: 6000 },
  { text: '— Que La Orden sea testigo. ⚔️', delay: 6200 },
];

function renderObOath() {
  return `
    <div id="ob-oath" style="min-height:100vh;display:flex;flex-direction:column;
      background:radial-gradient(ellipse at center, #1a0a00 0%, #0A0A0F 70%);
      padding-bottom:120px;">

      ${obProgressBar(4, 5)}

      <div style="flex:1;display:flex;flex-direction:column;align-items:center;
        padding:24px 24px 0;text-align:center;">

        <!-- Sello -->
        <div id="oath-seal" style="font-size:64px;margin:20px 0;
          opacity:0;transform:scale(0.1);
          transition:all 1s cubic-bezier(0.34,1.56,0.64,1);">⚔️</div>

        <div id="oath-title" style="font-family:var(--font-head);font-size:24px;font-weight:900;
          letter-spacing:0.15em;text-transform:uppercase;
          color:var(--gold);margin-bottom:4px;
          opacity:0;transition:opacity 0.6s ease 0.8s;">
          PACTO DE ACERO
        </div>
        <div id="oath-sub" style="font-size:11px;letter-spacing:0.2em;color:rgba(212,168,67,0.5);
          text-transform:uppercase;margin-bottom:28px;
          opacity:0;transition:opacity 0.6s ease 1s;">
          Un compromiso real. Para siempre.
        </div>

        <!-- Texto del juramento -->
        <div id="oath-text"
          style="background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.15);
            border-radius:var(--r-lg);padding:24px;width:100%;max-width:360px;
            text-align:left;font-size:15px;line-height:2;color:var(--text-1);
            min-height:280px;font-style:italic;
            opacity:0;transition:opacity 0.4s ease 1.2s;">
        </div>

        <!-- Botón de firma -->
        <button id="oath-btn" onclick="signOath()"
          style="margin-top:24px;width:100%;max-width:360px;padding:20px 24px;
            border:none;border-radius:var(--r-lg);cursor:pointer;
            font-family:var(--font-head);font-size:17px;font-weight:900;
            color:#0A0A0F;letter-spacing:0.06em;
            background:linear-gradient(135deg,#FF6B35,#D4A843,#FF6B35);
            background-size:200% 200%;
            animation:fireGlow 2s ease-in-out infinite;
            box-shadow:0 0 40px rgba(255,107,53,0.5);
            opacity:0;transform:translateY(30px);
            transition:opacity 0.6s ease, transform 0.6s ease;">
          🔥 FIRMO MI PACTO DE ACERO
        </button>

        <div id="oath-legal" style="margin-top:12px;font-size:10px;color:var(--text-3);
          max-width:300px;line-height:1.5;opacity:0;transition:opacity 0.4s ease;">
          Al confirmar, aceptas que tus compromisos serán registrados y medidos diariamente durante 30 días.
        </div>

      </div>
    </div>
    <style>
      @keyframes fireGlow {
        0%,100% { background-position:0% 50%; box-shadow:0 0 40px rgba(255,107,53,0.5); }
        50%      { background-position:100% 50%; box-shadow:0 0 60px rgba(212,168,67,0.7); }
      }
    </style>
  `;
}

function initOathAnimation() {
  setTimeout(() => {
    const seal = document.getElementById('oath-seal');
    if (seal) { seal.style.opacity = '1'; seal.style.transform = 'scale(1)'; }
  }, 300);

  setTimeout(() => {
    const title = document.getElementById('oath-title');
    const sub   = document.getElementById('oath-sub');
    if (title) title.style.opacity = '1';
    if (sub)   sub.style.opacity   = '1';
  }, 800);

  setTimeout(() => {
    const textEl = document.getElementById('oath-text');
    if (textEl) textEl.style.opacity = '1';

    let html = '';
    OATH_LINES.forEach((line, i) => {
      setTimeout(() => {
        if (!document.getElementById('oath-text')) return;
        if (line.text === '') {
          html += '<br>';
        } else {
          const t = line.text.replace('{nombre}', OB.nombre || 'Aspirante');
          html += `<span style="animation:fadeInLine 0.4s ease forwards;opacity:0;display:block;">${t}</span>`;
        }
        document.getElementById('oath-text').innerHTML = html +
          `<style>
            @keyframes fadeInLine {
              from { opacity:0; transform:translateX(-10px); }
              to   { opacity:1; transform:translateX(0); }
            }
          </style>`;

        // Mostrar botón al final del juramento
        if (i === OATH_LINES.length - 1) {
          setTimeout(() => {
            const btn   = document.getElementById('oath-btn');
            const legal = document.getElementById('oath-legal');
            if (btn)   { btn.style.opacity   = '1'; btn.style.transform = 'translateY(0)'; }
            if (legal) { legal.style.opacity = '1'; }
          }, 800);
        }
      }, line.delay);
    });
  }, 1200);
}

async function signOath() {
  const btn = document.getElementById('oath-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Sellando tu pacto...'; }

  // Vibración dramática
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }

  try {
    // Primero creo el usuario en GAS
    const tg     = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    const nombre = OB.nombre || (tgUser ? tgUser.first_name : 'Aspirante');

    await createUser(nombre);
    await saveCompromisos(OB.compromisos);
    await signUserOath();

    // Animación de éxito
    const oathEl = document.getElementById('ob-oath');
    if (oathEl) {
      oathEl.style.transition = 'all 0.5s ease';
      oathEl.style.opacity    = '0';
      oathEl.style.transform  = 'scale(1.05)';
    }

    startConfetti();
    setTimeout(() => {
      stopConfetti();
      obNext(); // ir a payment
    }, 2500);

  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = '🔥 FIRMO MI PACTO DE ACERO'; }
    console.error('[Oath] Error:', e.message);
  }
}
