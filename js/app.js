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

// --- MODAL SYSTEM ----------------------------------------
function showInteractiveModal(title, text, badge) {
  const existing = document.getElementById('interactiveModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'interactiveModal';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 1000;
    display: flex; flex-direction: column; justify-content: flex-end;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    animation: modalBgIn 0.3s ease forwards;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: #12121A; border-top: 1px solid var(--border-gold);
    border-radius: 24px 24px 0 0; padding: 32px 24px 40px;
    box-shadow: 0 -10px 40px rgba(212,168,67,0.15);
    transform: translateY(100%); animation: modalSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  `;

  content.innerHTML = `
    <div style="width: 40px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 24px;"></div>
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      ${badge ? `<div style="width:48px;height:48px;border-radius:50%;background:rgba(212,168,67,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid var(--border-gold);flex-shrink:0;">${badge}</div>` : ''}
      <div style="font-family:var(--font-head); font-size:22px; font-weight:800; color:var(--text-1); line-height:1.2;">${title}</div>
    </div>
    <div style="font-size:15px; color:var(--text-2); line-height:1.6; margin-bottom:32px;">
      ${text}
    </div>
    <button onclick="document.getElementById('interactiveModal').remove()" 
      style="width:100%; padding:16px; border-radius:14px; background:var(--bg-elevated); border:1px solid var(--border); color:var(--text-1); font-family:var(--font-head); font-weight:700; font-size:15px; cursor:pointer; -webkit-tap-highlight-color:transparent;">
      Entendido
    </button>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Close on outside click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  
  // Inject keyframes if not exists
  if (!document.getElementById('modalKeyframes')) {
    const style = document.createElement('style');
    style.id = 'modalKeyframes';
    style.innerHTML = `
      @keyframes modalBgIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes modalSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
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
    
    // Configurar trampa de historial para el botón físico de Atrás (Android)
    window.history.pushState({ page: 'main' }, '');
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


// --- BOTON BACK (Telegram Header) ------------------------
window.Telegram?.WebApp?.BackButton?.onClick(() => {
  if (currentView !== 'home') {
    navigateTo('home');
  } else {
    _mostrarPopupSalida();
  }
});

// --- BOTON FISICO DE ATRÁS (Android / Popstate) ----------
window.addEventListener('popstate', (e) => {
  // Volver a atrapar en el historial para no salir de la WebView
  window.history.pushState({ page: 'main' }, '');

  if (currentView === 'report' && document.getElementById('view-report-input')) {
    // Si estaba en el input de reporte, volver a la lista
    navigateTo('report');
  } else if (currentView !== 'home') {
    // Si está en cualquier otra vista, volver al inicio
    navigateTo('home');
  } else {
    // Si está en inicio, lanzar el popup de fricción
    _mostrarPopupSalida();
  }
});

function _mostrarPopupSalida() {
  window.Telegram.WebApp.showPopup({
    title: '¿Abandonar la base?',
    message: 'Tus objetivos no se cumplen solos. ¿Seguro que quieres retirarte?',
    buttons: [
      {id: 'close', type: 'destructive', text: 'Retirarme'},
      {id: 'stay', type: 'default', text: 'Continuar luchando'}
    ]
  }, (buttonId) => {
    if (buttonId === 'close') window.Telegram.WebApp.close();
  });
}

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
