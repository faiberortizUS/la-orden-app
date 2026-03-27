/**
 * 🏛️ LA ORDEN — onboarding.js
 * Orquestador del flujo de onboarding en la TWA
 * Maneja el estado, la navegación entre pasos y la persistencia en localStorage
 */

const ONBOARDING_STEPS = [
  'welcome',       // Paso 1: Cinemática de bienvenida
  'areas',         // Paso 2: Selección de campos de batalla
  'commitments',   // Paso 3: Compromisos + meta + frecuencia
  'oath',          // Paso 4: Juramento — Pacto de Acero
  'payment',       // Paso 5: Activación Stripe
];

const STORAGE_KEY = 'laorden_onboarding';

// Estado global del onboarding
const OB = {
  step:         0,
  areas:        [],     // array de areaIds seleccionados
  areaIndex:    0,      // índice del área que estamos configurando ahora
  compromisos:  [],     // array de {areaId, compromisoId, nombre, meta, unidad, frecuencia, pcBase}
  nombre:       '',     // nombre del usuario (de Telegram)
};

/* ─── PERSISTENCIA ──────────────────────────────────────── */
function obSave() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step:        OB.step,
      areas:       OB.areas,
      areaIndex:   OB.areaIndex,
      compromisos: OB.compromisos,
    }));
  } catch(e) { /* localStorage puede no estar disponible en algunos contextos */ }
}

function obLoad() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      OB.step        = d.step        || 0;
      OB.areas       = d.areas       || [];
      OB.areaIndex   = d.areaIndex   || 0;
      OB.compromisos = d.compromisos || [];
      return true;
    }
  } catch(e) {}
  return false;
}

function obClear() {
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
}

/* ─── INICIAR ONBOARDING ────────────────────────────────── */
function startOnboarding(tgUser) {
  OB.nombre = tgUser ? (tgUser.first_name || 'Aspirante') : 'Aspirante';

  // Intentar restaurar progreso guardado en localStorage
  const hasSaved = obLoad();

  // Solo restaurar si hay datos REALES (el usuario configuró al menos un compromiso)
  // Si el paso es avanzado pero no hay compromisos, el localStorage está corrupto — reiniciar
  const estadoValido = hasSaved && (
    OB.compromisos.length > 0 ||
    OB.areas.length > 0 ||
    OB.step <= 1   // Steps 0-1 no necesitan datos previos
  );

  if (!estadoValido) {
    obClear();
    OB.step        = 0;
    OB.areas       = [];
    OB.areaIndex   = 0;
    OB.compromisos = [];
  }

  // Ocultar la app principal y mostrar el contenedor de onboarding
  const appEl = document.getElementById('app');
  if (appEl) appEl.classList.add('hidden');

  // Crear el contenedor de onboarding si no existe
  let obContainer = document.getElementById('onboardingContainer');
  if (!obContainer) {
    obContainer = document.createElement('div');
    obContainer.id = 'onboardingContainer';
    obContainer.style.cssText = 'position:fixed;inset:0;z-index:100;background:var(--bg-base);overflow-y:auto;';
    document.body.appendChild(obContainer);
  }
  obContainer.style.display = 'flex';
  obContainer.style.flexDirection = 'column';

  renderOnboardingStep();
}

/* ─── ROUTER DE PASOS ────────────────────────────────────── */
function renderOnboardingStep() {
  const container = document.getElementById('onboardingContainer');
  if (!container) return;

  const step = ONBOARDING_STEPS[OB.step];
  obSave();

  switch(step) {
    case 'welcome':
      container.innerHTML = renderObWelcome();
      setTimeout(initObWelcomeAnimations, 50);
      break;
    case 'areas':       container.innerHTML = renderObAreas();        break;
    case 'commitments': renderObCommitmentsAsync(container);          break;
    case 'oath':        container.innerHTML = renderObOath();
                        setTimeout(initOathAnimation, 50);             break;
    case 'payment':     container.innerHTML = renderObPayment();       break;
    default:            finishOnboarding(); return;
  }

  container.scrollTop = 0;
}

function obNext() {
  OB.step = Math.min(OB.step + 1, ONBOARDING_STEPS.length - 1);
  renderOnboardingStep();
}

function obPrev() {
  if (OB.step > 0) {
    OB.step--;
    renderOnboardingStep();
  }
}

/* ─── PROGRESS BAR ──────────────────────────────────────── */
function obProgressBar(currentStep, totalSteps) {
  const pct = Math.round(((currentStep) / totalSteps) * 100);
  return `
    <div style="position:sticky;top:0;z-index:999;background:var(--bg-base);padding:12px 20px 8px;
      border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:10px;">
        ${currentStep > 1 ? `<button onclick="obPrev()"
          style="background:none;border:none;color:var(--text-3);font-size:18px;cursor:pointer;padding:0;line-height:1;">←</button>` : ''}
        <div style="flex:1;background:var(--bg-elevated);border-radius:99px;height:4px;">
          <div style="height:4px;border-radius:99px;background:linear-gradient(90deg,var(--electric),var(--gold));
            width:${pct}%;transition:width 0.4s ease;"></div>
        </div>
        <span style="font-size:11px;color:var(--text-3);min-width:28px;">${currentStep}/${totalSteps}</span>
      </div>
    </div>
  `;
}

/* ─── RESUMEN HACIA EL PAGO ─────────────────────────────── */
window.resumePaymentOnboarding = function() {
  OB.step = 4; // Paso de los pagos
  obSave();
  
  const appEl = document.getElementById('app');
  if (appEl) appEl.classList.add('hidden');

  let obContainer = document.getElementById('onboardingContainer');
  if (!obContainer) {
    obContainer = document.createElement('div');
    obContainer.id = 'onboardingContainer';
    obContainer.style.cssText = 'position:fixed;inset:0;z-index:100;background:var(--bg-base);overflow-y:auto;';
    document.body.appendChild(obContainer);
  }
  obContainer.style.display = 'flex';
  obContainer.style.flexDirection = 'column';

  renderOnboardingStep();
};

/* --- FINALIZAR ONBOARDING -------------------------------- */
async function finishOnboarding() {
  obClear();

  // Ocultar onboarding
  const ob = document.getElementById('onboardingContainer');
  if (ob) ob.style.display = 'none';

  // Recargar datos frescos desde GAS
  appData = await fetchUserData();
  window._appData = appData;

  // RUTEO EXACTO (Misma logica que app.js)
  if (appData._onboardingIncompleto) {
    // Si asume las consecuencias y skipea el pago, choca contra el muro
    showLockedDashboard(appData);
  } else {
    updateHeader(appData);

    // Mostrar la app y el Centro de Comandos (primera vez)
    const appEl = document.getElementById('app');
    if (appEl) appEl.classList.remove('hidden');

    // Marcar que ya vio el onboarding -> ir al centro de comandos por primera vez
    localStorage.setItem('laorden_first_visit', '1');
    navigateTo('command_center');
  }
}
