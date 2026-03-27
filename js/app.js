/**
 * LA ORDEN - app.js
 * Bootstrap principal: Telegram WebApp API + router de vistas + confetti
 * ACTUALIZADO: detecta estado del usuario y lanza onboarding si es necesario
 */

// --- Estado global ---------------------------------------
let currentView = 'home';
let appData     = null;

// --- ACTUALIZAR HEADER -----------------------------------
function updateHeader(data) {
  const rankEl = document.getElementById('headerRank');
  if (rankEl && data && data.user) {
    rankEl.textContent = data.user.rango || 'Aspirante';
  }
}

// --- INICIALIZACION --------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#0A0A0F');
    tg.setBackgroundColor('#0A0A0F');
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  }

  // Si la TWA fue abierta desde /start (reset=1), limpiar localStorage de onboarding
  if (new URLSearchParams(window.location.search).get('reset') === '1') {
    try { localStorage.removeItem('laorden_onboarding'); } catch(e) {}
  }

  // --- FETCH + SPLASH EN PARALELO ------------------------
  // No hay setTimeout: el splash desaparece en cuanto lleguen los datos
  const splashMinMs = 400; // mínimo visual para que no haga flash
  const [data] = await Promise.all([
    fetchUserData(),
    new Promise(r => setTimeout(r, splashMinMs)),
  ]);
  appData         = data;
  window._appData = data;

  // Ocultar splash
  const splash = document.getElementById('splash');
  if (splash) {
    splash.style.transition = 'opacity 0.25s ease';
    splash.style.opacity    = '0';
    setTimeout(() => { splash.style.display = 'none'; }, 260);
  }

    // --- DECISION DE FLUJO ---------------------------------
    if (appData._noRegistrado) {
      // Usuario sin registro en la BD -> onboarding desde cero
      const tgUser = tg?.initDataUnsafe?.user || null;
      startOnboarding(tgUser);

    } else if (appData._onboardingIncompleto) {
      // Usuario con onboarding completo pero sin pago.
      // Mostrar el dashboard BLOQUEADO con neuromarketing - no ir directo al pago.
      // Esto activa el Efecto de Dotación y el Zeigarnik antes de pedir la tarjeta.
      showLockedDashboard(appData);

    } else {
      // Usuario completamente registrado -> mostrar app
      updateHeader(appData);
      const appEl = document.getElementById('app');
      if (appEl) appEl.classList.remove('hidden');

      // ¿Primera visita post-juramento? -> Centro de Comandos
      if (localStorage.getItem('laorden_first_visit') === '1') {
        navigateTo('command_center');
      } else {
        navigateTo('home');
      }
    }
});

// --- ROUTER DE VISTAS ------------------------------------
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

// --- EFECTO MISTICO (CHISPAS DE LA ORDEN) ----------------------
let confettiAnim = null;
let confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Paleta de la Orden: Oro Brillante, Naranja Fuego, Violeta Electrón, Blanco Caliente
  const colors = ['#F0C060', '#FF6B35', '#D4A843', '#7B61FF', '#FFFFFF'];
  const count  = window.innerWidth < 400 ? 80 : 120; // Optimización móvil

  confettiParticles = Array.from({ length: count }, () => {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * window.innerHeight, // Empieza desde muy abajo
      r: Math.random() * 2.5 + 0.8, // Tamaños de chispa
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 1.5 + Math.random() * 4, // Velocidad de subida
      sway: Math.random() * Math.PI * 2, // Fase inicial de senoide
      swaySpeed: 0.01 + Math.random() * 0.05, // Velocidad de giro lateral
      swayAmp: 0.5 + Math.random() * 2 // Amplitud lateral
    };
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach(p => {
      // Fade in abajo, fade out arriba
      const heightPercent = p.y / canvas.height;
      let op = 1;
      if (heightPercent > 0.8) op = (1 - heightPercent) * 5; // entra suave
      if (heightPercent < 0.2) op = heightPercent * 5;     // sale suave
      if(op < 0) op = 0; if(op > 1) op = 1;

      // Resplandor (falso glow muy rápido en rendimiento)
      ctx.globalAlpha = op * 0.3;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Centro radiante (chispa core)
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.fillStyle = (Math.random() > 0.8) ? '#FFFFFF' : p.color; // parpadeo ocasional blanco
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Resetea alfa
      ctx.globalAlpha = 1;

      // Movimiento hacia arriba como humo/chispas
      p.y -= p.speedY;
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * p.swayAmp;

      // Reciclar la chispa si sale por arriba
      if (p.y < -50) {
        p.y = canvas.height + 50 + Math.random() * 100;
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
    // En lugar de borrar de tajo, hacemos fade out dramático al final
    let fadeOut = 1;
    function endAnim() {
      fadeOut -= 0.05;
      if (fadeOut <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles = [];
        return;
      }
      ctx.fillStyle = `rgba(10,10,15,0.1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(endAnim);
    }
    endAnim();
  } else {
    confettiParticles = [];
  }
}


// --- BOTON BACK ------------------------------------------
window.Telegram?.WebApp?.BackButton?.onClick(() => {
  if (currentView !== 'home') navigateTo('home');
  else window.Telegram.WebApp.close();
});

// --- REFRESCO AL VOLVER A LA APP -------------------------
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

// --- RESIZE ----------------------------------------------
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas && confettiAnim) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
