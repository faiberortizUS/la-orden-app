/**
 * 🏛️ LA ORDEN — app.js
 * Bootstrap principal: Telegram WebApp API + router de vistas + confetti
 * ACTUALIZADO: detecta estado del usuario y lanza onboarding si es necesario
 */

// ─── Estado global ────────────────────────────────────────
let currentView = 'home';
let appData     = null;

// ─── ACTUALIZAR HEADER ─────────────────────────────────────
function updateHeader(data) {
  const rankEl = document.getElementById('headerRank');
  if (rankEl && data && data.user) {
    rankEl.textContent = data.user.rango || '🌱 Aspirante';
  }
}

// ─── INICIALIZACIÓN ────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0A0A0F');
    tg.setBackgroundColor('#0A0A0F');
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  }

  // Cargar datos del usuario
  appData = await fetchUserData();
  window._appData = appData;

  // Ocultar splash
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';

    // ── DECISIÓN DE FLUJO ───────────────────────────────────
    if (appData._noRegistrado || obLoad()) {
      // Usuario sin registro o con onboarding inconcluso → lanzar TWA modal
      const tgUser = tg?.initDataUnsafe?.user || null;
      startOnboarding(tgUser);
    } else {
      // Usuario registrado → mostrar app
      updateHeader(appData);
      const appEl = document.getElementById('app');
      if (appEl) appEl.classList.remove('hidden');

      // ¿Primera visita post-juramento? → Centro de Comandos
      if (localStorage.getItem('laorden_first_visit') === '1') {
        navigateTo('command_center');
      } else {
        navigateTo('home');
      }
    }
  }, 700);
});

// ─── ROUTER DE VISTAS ─────────────────────────────────────
function navigateTo(view, params) {
  params = params || {};
  if (!appData) return;
  currentView = view;

  // Actualizar nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });

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
    case 'command_center': {
      const isFirst = localStorage.getItem('laorden_first_visit') === '1';
      html = renderCommandCenter(appData, isFirst);
      if (isFirst) localStorage.removeItem('laorden_first_visit');
      break;
    }
    default:
      html = renderHome(appData);
  }

  container.innerHTML = html;
  container.scrollTop = 0;

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
    tiltAngle:      Math.random() * Math.PI,
    tiltAngleDelta: 0.05 + Math.random() * 0.07,
    speed:          2 + Math.random() * 4,
    shape:          Math.random() < 0.5 ? 'rect' : 'circle',
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
      p.tiltAngle += p.tiltAngleDelta;
      p.y += p.speed;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
    confettiAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnim) { cancelAnimationFrame(confettiAnim); confettiAnim = null; }
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = [];
}

// ─── BOTÓN BACK ───────────────────────────────────────────
window.Telegram?.WebApp?.BackButton?.onClick(() => {
  if (currentView !== 'home') navigateTo('home');
  else window.Telegram.WebApp.close();
});

// ─── REFRESCO AL VOLVER A LA APP ─────────────────────────
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && appData && !appData._noRegistrado) {
    const fresh = await fetchUserData();
    if (fresh && fresh.user && !fresh._noRegistrado) {
      appData         = fresh;
      window._appData = fresh;
      updateHeader(fresh);
      navigateTo(currentView);
    }
  }
});

// ─── RESIZE ───────────────────────────────────────────────
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas && confettiAnim) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
