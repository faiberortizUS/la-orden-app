/**
 * 🏛️ LA ORDEN — app.js
 * Bootstrap principal: Telegram WebApp API + router de vistas + confetti
 */

// ─── Estado global ────────────────────────────────────────
let currentView = 'home';
let appData     = null;

// ─── INICIALIZACIÓN ────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Configurar Telegram WebApp
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0A0A0F');
    tg.setBackgroundColor('#0A0A0F');
    // Deshabilitar cierre con swipe down solo si está disponible
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  }

  // 2. Cargar datos
  appData = await fetchUserData();
  window._appData = appData;

  // 3. Actualizar header con rango
  const rankEl = document.getElementById('headerRank');
  if (rankEl && appData.user) rankEl.textContent = appData.user.rango;

  // 4. Esperar a que el splash termine y mostrar app
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    navigateTo('home');
  }, 2400);
});

// ─── ROUTER DE VISTAS ─────────────────────────────────────
function navigateTo(view, params = {}) {
  if (!appData) return;

  currentView = view;

  // Actualizar nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });

  // Render view
  const container = document.getElementById('viewContainer');
  let html = '';

  switch (view) {
    case 'home':
      html = renderHome(appData);
      break;
    case 'report':
      html = renderReport(appData, params);
      break;
    case 'stats':
      html = renderStats(appData);
      break;
    case 'oath':
      html = renderOath(appData);
      break;
    case 'celula':
      html = renderCelula(appData);
      break;
    default:
      html = renderHome(appData);
  }

  container.innerHTML = html;
  container.scrollTop = 0;

  // Post-render animations
  requestAnimationFrame(() => {
    switch (view) {
      case 'home':  initHomeAnimations();  break;
      case 'stats': initStatsAnimations(); break;
    }
  });
}

// ─── CONFETTI ─────────────────────────────────────────────
let confettiAnim = null;
let confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#D4A843','#FF6B35','#7B61FF','#22C55E','#F0C060','#FF6B8A'];
  const count  = 120;

  confettiParticles = Array.from({ length: count }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * -200,
    r:     Math.random() * 7 + 3,
    d:     Math.random() * count,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt:  Math.floor(Math.random() * 10) - 10,
    tiltAngle:       Math.random() * Math.PI,
    tiltAngleDelta:  0.05 + Math.random() * 0.07,
    speed:           2 + Math.random() * 4,
    shape:           Math.random() < 0.5 ? 'rect' : 'circle',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        ctx.restore();
      } else {
        ctx.ellipse(p.x, p.y, p.r * 0.6, p.r, p.tiltAngle, 0, 2 * Math.PI);
      }
      ctx.fill();

      // Update
      p.tiltAngle += p.tiltAngleDelta;
      p.y += p.speed;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });
    confettiAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) { cancelAnimationFrame(confettiAnim); confettiAnim = null; }
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  confettiParticles = [];
}

// ─── MANEJO DE BOTÓN BACK DE TELEGRAM ────────────────────
window.Telegram?.WebApp?.BackButton?.onClick(() => {
  if (currentView !== 'home') navigateTo('home');
  else window.Telegram.WebApp.close();
});

// ─── RESIZE ───────────────────────────────────────────────
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas && confettiAnim) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
