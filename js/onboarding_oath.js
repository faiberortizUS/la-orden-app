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

      ${obProgressBar(4, 6)}

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
        <button id="oath-btn" class="btn-premium tappable" onclick="signOath()"
          style="margin-top:24px;width:100%;max-width:360px;height:56px;display:flex;align-items:center;justify-content:center;
            border:none;border-radius:var(--r-xl);cursor:pointer;
            font-family:var(--font-head);font-size:15px;font-weight:900;
            color:#0A0A0F;letter-spacing:0.04em;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));
            box-shadow:0 8px 24px rgba(212,168,67,0.3);
            opacity:0;transform:translateY(30px);
            transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1);">
          🖋️ FIRMO MI PACTO DE ACERO
        </button>

        <div id="oath-legal" style="margin-top:12px;font-size:10px;color:var(--text-3);
          max-width:300px;line-height:1.5;opacity:0;transition:opacity 0.4s ease;">
          Al confirmar, aceptas que tus compromisos serán registrados y medidos diariamente durante 30 días.
        </div>

      </div>
    </div>
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

    // Inyectar el style de animación una sola vez antes de empezar
    if (!document.getElementById('oath-style-dynamic')) {
      const style = document.createElement('style');
      style.id = 'oath-style-dynamic';
      style.textContent = `
        @keyframes fadeInLine {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    OATH_LINES.forEach((line, i) => {
      setTimeout(() => {
        const oathText = document.getElementById('oath-text');
        if (!oathText) return;
        
        if (line.text === '') {
          oathText.insertAdjacentHTML('beforeend', '<br>');
        } else {
          const t = line.text.replace('{nombre}', OB.nombre || 'Aspirante');
          oathText.insertAdjacentHTML('beforeend', 
            `<span style="animation:fadeInLine 0.4s ease forwards;opacity:0;display:block;">${t}</span>`
          );
        }

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

let isSigning = false;

async function signOath() {
  if (isSigning) return;

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  }

  isSigning = true;
  const btn = document.getElementById('oath-btn');
  if (btn) { 
    btn.disabled = true; 
    btn.innerHTML = 'Sellando infraestructura <span id="oath-dots">...</span>'; 
    
    // Animacion sutil de puntos
    let dotCount = 0;
    btn.dataset.dotIv = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      const dots = document.getElementById('oath-dots');
      if(dots) dots.textContent = '.'.repeat(dotCount).padEnd(3, ' ');
    }, 400);
  }

  // Vibración dramática
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }

  try {
    const tg     = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    const nombre = OB.nombre || (tgUser ? tgUser.first_name : 'Aspirante');

    // OPTIMIZACION: 3 llamadas agrupadas en 1 sola peticion al sistema (60% mas rapido)
    const result = await sealFullPact(nombre, OB.compromisos);
    if (!result || !result.ok) throw new Error(result?.error || 'Fallo el sellado del pacto');

    // Animación de éxito
    if(btn?.dataset?.dotIv) clearInterval(btn.dataset.dotIv);

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
    isSigning = false; // Permitir reintento
    if(btn?.dataset?.dotIv) clearInterval(btn.dataset.dotIv);
    if (btn) { btn.disabled = false; btn.innerHTML = '❌ ERROR: REINTENTAR FIRMA'; }
    if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert('No pudimos sellar el pacto en Google Sheets. Error: ' + e.message);
    else alert('Error: ' + e.message);

    // Salvavidas: si la caché está rota o base de datos en blanco y no tiene compromisos vivos, permitirle reiniciar todo
    if (!document.getElementById('oath-reset-btn')) {
      const resetBtn = document.createElement('button');
      resetBtn.id = 'oath-reset-btn';
      resetBtn.textContent = '🔄 Destrabar (Borrar caché y reiniciar)';
      resetBtn.style.cssText = 'margin-top:16px;width:100%;max-width:360px;padding:12px;background:transparent;border:1px solid var(--border);border-radius:var(--r-md);color:var(--text-3);font-size:12px;cursor:pointer;';
      resetBtn.onclick = () => {
         obClear();
         OB.step = 0;
         OB.compromisos = [];
         
         // En Telegram WebApp no podemos cambiar libremente la URL porque perdemos los datos de autenticación (hash tgWebAppData)
         // Así que pasamos la bandera a través de localStorage
         localStorage.setItem('laorden_force_reset', '1');
         window.location.reload();
      };
      btn.parentNode.appendChild(resetBtn);
    }
    console.error('[Oath] Error:', e.message);
  }
}
