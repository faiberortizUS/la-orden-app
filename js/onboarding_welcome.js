/**
 * 🏛️ LA ORDEN — onboarding_welcome.js
 * Pantalla cinemática de bienvenida con partículas y typewriter
 */

function renderObWelcome() {
  return `
    <div id="ob-welcome" style="min-height:100%;display:flex;flex-direction:column;
      align-items:center;padding:40px 24px 120px;position:relative;overflow:hidden;">

      <!-- Partículas de fondo -->
      <canvas id="particleCanvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></canvas>

      <!-- Contenido -->
      <div style="position:relative;z-index:1;text-align:center;max-width:340px;width:100%;">

        <!-- Logo animado -->
        <div id="ob-logo" style="font-size:72px;margin-bottom:24px;
          opacity:0;transform:scale(0.3);transition:all 0.8s cubic-bezier(0.34,1.56,0.64,1);">
          🏛️
        </div>

        <!-- Título -->
        <div id="ob-title" style="font-family:var(--font-head);font-size:28px;font-weight:900;
          color:var(--gold);letter-spacing:0.1em;margin-bottom:8px;
          opacity:0;transform:translateY(20px);transition:all 0.6s ease 0.6s;">
          LA ORDEN
        </div>

        <!-- Subtítulo -->
        <div id="ob-subtitle" style="font-size:12px;letter-spacing:0.3em;color:var(--text-3);
          text-transform:uppercase;margin-bottom:32px;
          opacity:0;transition:all 0.6s ease 0.9s;">
          El 1% te está esperando
        </div>

        <!-- Texto typewriter -->
        <div id="ob-text" style="font-size:15px;line-height:1.8;color:var(--text-2);
          margin-bottom:32px;min-height:180px;text-align:left;
          background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.1);
          border-radius:var(--r-lg);padding:20px;
          opacity:0;transition:opacity 0.4s ease 1.2s;">
        </div>

        <!-- Botón — visible por defecto, sin depender de animaciones -->
        <button id="ob-cta" onclick="obWelcomeProceed()"
          style="width:100%;padding:18px 24px;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));
            border:none;border-radius:var(--r-lg);cursor:pointer;
            font-family:var(--font-head);font-size:16px;font-weight:800;
            color:#0A0A0F;letter-spacing:0.08em;
            box-shadow:0 0 30px rgba(212,168,67,0.4);">
          ⚔️ ESTOY LISTO — SOY DEL 1%
        </button>

      </div>
    </div>
  `;
}


const OB_WELCOME_TEXT = [
  'Esto no es una aplicación.',
  'Es un pacto.',
  '',
  'Mientras el 99% planea, habla y pospone — el 1% actúa, mide y construye.',
  '',
  'La Orden es el sistema que separa a los que realmente lo hacen de los que solo dicen que lo van a hacer.',
  '',
  'Lo que vas a diseñar aquí en los próximos minutos definirá quién serás en 90 días.',
  '',
  '¿Estás listo para construir la versión más dura de ti mismo?',
];

function _showWelcomeButton() {
  const btn = document.getElementById('ob-cta');
  if (btn && btn.style.opacity !== '1') {
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0)';
  }
}

function initObWelcomeAnimations() {
  // Activar logo y título
  setTimeout(() => {
    const logo = document.getElementById('ob-logo');
    if (logo) { logo.style.opacity = '1'; logo.style.transform = 'scale(1)'; }
  }, 100);

  setTimeout(() => {
    const title = document.getElementById('ob-title');
    if (title) { title.style.opacity = '1'; title.style.transform = 'translateY(0)'; }
  }, 300);

  setTimeout(() => {
    const sub = document.getElementById('ob-subtitle');
    if (sub) { sub.style.opacity = '1'; }
  }, 450);

  // Activar texto con typewriter
  setTimeout(() => {
    const textEl = document.getElementById('ob-text');
    if (textEl) { textEl.style.opacity = '1'; }
    typewriterLines(textEl, OB_WELCOME_TEXT, 0, _showWelcomeButton);
  }, 600);

  // Fallback: si el typewriter no termina en 7s, el botón aparece igual
  setTimeout(_showWelcomeButton, 7000);

  // Partículas
  startParticles();
}


function typewriterLines(el, lines, index, onDone) {
  if (!el || index >= lines.length) { if (onDone) onDone(); return; }
  const line = lines[index];
  if (line === '') {
    el.innerHTML += '<br>';
    setTimeout(() => typewriterLines(el, lines, index + 1, onDone), 100);
    return;
  }
  let i = 0;
  const span = document.createElement('span');
  el.appendChild(span);
  const iv = setInterval(() => {
    if (i < line.length) {
      span.textContent += line[i++];
    } else {
      clearInterval(iv);
      el.appendChild(document.createElement('br'));
      setTimeout(() => typewriterLines(el, lines, index + 1, onDone), 150);
    }
  }, 10);
}

function startParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const parts = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: -Math.random() * 0.5 - 0.2,
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function drawP() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(212,168,67,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawP);
  }
  drawP();
}

function obWelcomeProceed() {
  // Guardar nombre del usuario
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  OB.nombre = tgUser ? (tgUser.first_name || 'Aspirante') : 'Aspirante';
  obNext();
}

// Inicializar animaciones después del render
setTimeout(() => {
  if (document.getElementById('ob-welcome')) initObWelcomeAnimations();
}, 100);
