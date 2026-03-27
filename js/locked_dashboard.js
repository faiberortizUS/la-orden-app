/**
 * 🏛️ LA ORDEN — locked_dashboard.js
 * Vista de panel bloqueado para usuarios sin membresía activa.
 *
 * Sesgos cognitivos activos:
 *  ① Efecto de Dotación   — ven SUS compromisos ya configurados
 *  ② Efecto Zeigarnik     — tarea incompleta genera tensión cognitiva
 *  ③ FOMO                 — contador de miembros activos en tiempo real
 *  ④ Aversión a la Pérdida— "llevas N días sin registrar"
 *  ⑤ Prueba Social        — "247 personas eligieron construir hoy"
 *  ⑥ Anclaje de Precio    — $0.63/día vs precio total
 *  ⑦ Escasez              — contador live que sube
 *  ⑧ Consistencia         — "Ya firmaste el juramento. Tu estructura te espera."
 */

let _ldLiveCounter = 247;
let _ldLiveIv      = null;
let _ldDaysLost    = 3; // Días de "pérdida" percibida

/* ─── PUNTO DE ENTRADA ───────────────────────────────────── */
function showLockedDashboard(data) {
  const user       = data.user || {};
  const compromisos = data.compromisos || [];
  const nombre     = user.nombre || 'Arquitecto';

  // Días perdidos: entre 2 y 5 (percepción de urgencia real)
  _ldDaysLost    = Math.floor(Math.random() * 4) + 2;
  _ldLiveCounter = 240 + Math.floor(Math.random() * 30);

  // Asegurarse de que el app shell esté oculto
  const appEl = document.getElementById('app');
  if (appEl) appEl.classList.add('hidden');

  // Crear o reutilizar el contenedor
  let container = document.getElementById('lockedDashboard');
  if (!container) {
    container = document.createElement('div');
    container.id        = 'lockedDashboard';
    container.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:90',
      'background:#0A0A0F', 'display:flex', 'flex-direction:column', 'overflow:hidden',
    ].join(';');
    document.body.appendChild(container);
  }
  container.style.display = 'flex';
  container.innerHTML = _renderLocked(nombre, compromisos);

  _initNavIntercept();
  _startLiveCounter();
}

/* ─── RENDER PRINCIPAL ───────────────────────────────────── */
function _renderLocked(nombre, compromisos) {

  const misionesHtml = _renderMisionesBlur(compromisos);
  const extrasCount  = Math.max(0, compromisos.length - 3);

  return `
    <!-- ① BANNER LIVE — Prueba Social + FOMO -->
    <div class="ld-live-banner">
      <span class="ld-live-dot"></span>
      <span>EN VIVO —</span>
      <strong id="ldLiveCounter">${_ldLiveCounter}</strong>
      <span>miembros del 1% ya reportaron hoy · <strong style="color:#EF4444;">TÚ NO</strong></span>
    </div>

    <!-- SCROLL AREA -->
    <div style="flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:110px;position:relative;">

      <!-- ② HERO BLOQUEADO — Dotación + Zeigarnik -->
      <div style="position:relative;margin:16px;border-radius:20px;overflow:hidden;">

        <!-- Contenido real borroso (Dotación: "esto ya es tuyo") -->
        <div class="ld-blur-wrap">
          <div style="background:rgba(26,26,40,0.7);border:1px solid rgba(212,168,67,0.25);
            border-radius:20px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:12px;">
            <svg viewBox="0 0 180 180" style="width:150px;height:150px;">
              <defs>
                <linearGradient id="ldGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#7B61FF"/>
                  <stop offset="50%" stop-color="#D4A843"/>
                  <stop offset="100%" stop-color="#FF6B35"/>
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r="70" fill="none" stroke="#1A1A28" stroke-width="10"/>
              <circle cx="90" cy="90" r="70" fill="none" stroke="url(#ldGaugeGrad)"
                stroke-width="10" stroke-dasharray="110 350"
                transform="rotate(-90 90 90)" stroke-linecap="round"/>
              <text x="90" y="80" text-anchor="middle" dominant-baseline="middle"
                font-family="Outfit,sans-serif" font-size="36" font-weight="900" fill="#F5F5F5">??</text>
              <text x="90" y="100" text-anchor="middle" dominant-baseline="middle"
                font-family="Inter,sans-serif" font-size="11" fill="#5A5A72">ICD · CONSISTENCIA</text>
              <text x="90" y="117" text-anchor="middle" dominant-baseline="middle"
                font-family="Outfit,sans-serif" font-size="12" font-weight="700" fill="#D4A843">DESBLOQUEALO</text>
            </svg>
            <div style="display:flex;gap:8px;">
              <span style="background:rgba(212,168,67,0.15);border:1px solid rgba(212,168,67,0.25);
                border-radius:9999px;padding:3px 12px;font-size:11px;font-weight:700;color:#D4A843;">⚡ ?? PC</span>
              <span style="background:rgba(123,97,255,0.15);border:1px solid rgba(123,97,255,0.25);
                border-radius:9999px;padding:3px 12px;font-size:11px;font-weight:700;color:#7B61FF;">?? días activo</span>
            </div>
          </div>
        </div>

        <!-- Overlay glassmorphism con lock + CTA -->
        <div class="ld-lock-overlay">
          <div style="text-align:center;">
            <div style="font-size:44px;margin-bottom:8px;
              filter:drop-shadow(0 0 24px rgba(212,168,67,0.7));">🔒</div>
            <div style="font-family:'Outfit',sans-serif;font-size:20px;font-weight:900;
              color:#F5F5F5;line-height:1.3;margin-bottom:6px;">
              ${nombre},<br>tu estructura<br>te espera.
            </div>
            <div style="font-size:12px;color:#A0A0B0;margin-bottom:18px;line-height:1.7;">
              Tu Juramento está sellado.<br>
              Tus compromisos están listos.<br>
              <strong style="color:#D4A843;">Solo falta activar el sistema.</strong>
            </div>
            <button onclick="lockedActivarNow()" class="ld-cta-btn">
              ⚡ ACTIVAR MI MEMBRESÍA
            </button>
          </div>
        </div>
      </div>

      <!-- ④ PÉRDIDA ACUMULADA — Aversión a la pérdida -->
      <div class="ld-loss-card">
        <div style="font-size:30px;margin-bottom:8px;">⏳</div>
        <div style="font-family:'Outfit',sans-serif;font-size:17px;font-weight:900;
          color:#FF6B35;margin-bottom:8px;">
          Llevas <span id="ldDaysLost">${_ldDaysLost}</span> días sin registrar nada.
        </div>
        <div style="font-size:13px;color:#A0A0B0;line-height:1.8;margin-bottom:12px;">
          Tu Línea Activa sigue en <strong style="color:#F5F5F5;">cero</strong>.
          Tu ICD no se mueve. Tu rango no avanza.<br>
          <span style="color:#FF6B35;font-weight:700;">El 99% te alcanza mientras esperas.</span>
        </div>
        <div style="font-size:11px;color:#5A5A72;border-top:1px solid rgba(255,255,255,0.06);
          padding-top:10px;">
          💡 Los miembros activos llevan en promedio
          <strong style="color:#D4A843;">23 días de racha continua</strong>
        </div>
      </div>

      <!-- ① MISIONES BORROSAS — Dotación ("tus compromisos te esperan") -->
      <div style="margin:0 16px 16px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;
          color:#5A5A72;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
          📋 Tus misiones de hoy
          <div style="flex:1;height:1px;background:rgba(255,255,255,0.06);"></div>
          <span style="background:rgba(239,68,68,0.15);color:#EF4444;border-radius:9999px;
            padding:2px 8px;font-size:10px;letter-spacing:0.05em;">BLOQUEADAS</span>
        </div>
        ${misionesHtml}
        ${extrasCount > 0 ? `
          <div style="text-align:center;margin-top:8px;font-size:11px;color:#5A5A72;">
            + ${extrasCount} misión${extrasCount > 1 ? 'es' : ''} más esperándote
          </div>` : ''}
      </div>

      <!-- ⑥ ANCLAJE DE PRECIO — Precio per cápita vs real -->
      <div class="ld-price-anchor">
        <div style="font-size:10px;letter-spacing:0.2em;color:#5A5A72;
          text-transform:uppercase;margin-bottom:10px;">¿Cuánto vale el 1%?</div>
        <div style="display:flex;align-items:flex-end;justify-content:center;gap:6px;margin-bottom:6px;">
          <span style="font-family:'Outfit',sans-serif;font-size:40px;font-weight:900;
            color:#D4A843;line-height:1;text-shadow:0 0 30px rgba(212,168,67,0.4);">$0.63</span>
          <span style="font-size:15px;color:#A0A0B0;margin-bottom:6px;">USD / día</span>
        </div>
        <div style="font-size:12px;color:#5A5A72;margin-bottom:10px;">
          Menos que un café. Más que cualquier excusa.
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <span style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);
            border-radius:9999px;padding:4px 12px;font-size:11px;font-weight:600;color:#22C55E;">
            ✓ $19/mes · Cancela cuando quieras
          </span>
        </div>
      </div>

      <!-- ⑤ PRUEBA SOCIAL — Social proof + contador dinámico -->
      <div class="ld-social-proof">
        <div style="display:flex;gap:-4px;justify-content:center;margin-bottom:10px;">
          <span style="font-size:20px;">👨</span><span style="font-size:20px;margin-left:-4px;">🧑</span>
          <span style="font-size:20px;margin-left:-4px;">👩</span><span style="font-size:20px;margin-left:-4px;">👨</span>
          <span style="font-size:20px;margin-left:-4px;">🧑</span>
        </div>
        <div style="font-size:14px;font-weight:700;color:#F5F5F5;margin-bottom:6px;">
          "<span id="ldActiveCount">${_ldLiveCounter}</span> personas eligieron construirse hoy."
        </div>
        <div style="font-size:12px;color:#A0A0B0;line-height:1.7;">
          La diferencia entre ellas y tú:<br>
          <strong style="color:#D4A843;">una decisión de $0.63.</strong>
        </div>
      </div>

    </div><!-- end scroll area -->

    <!-- ③ STICKY CTA BOTTOM — siempre visible -->
    <div class="ld-sticky-bottom">
      <button onclick="lockedActivarNow()" class="ld-cta-btn ld-cta-btn--full">
        ⚡ ACTIVAR MEMBRESÍA — DESDE $19/MES
      </button>
      <div style="text-align:center;margin-top:7px;font-size:10px;color:#5A5A72;letter-spacing:0.03em;">
        🔒 Pago cifrado con Stripe · Cancela cuando quieras
      </div>
    </div>

    <!-- ⑧ MODAL DE INTERCEPCIÓN — aparece al tocar nav o blur -->
    <div id="ldInterceptModal" class="ld-intercept-modal">
      <div class="ld-intercept-card">
        <div style="font-size:40px;margin-bottom:10px;">🏛️</div>
        <div style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:900;
          color:#F5F5F5;margin-bottom:10px;line-height:1.3;">
          Esta función está<br>reservada para el 1%.
        </div>
        <div style="font-size:13px;color:#A0A0B0;line-height:1.75;margin-bottom:18px;">
          Tu estructura ya está construida.<br>
          Tu juramento ya está sellado.<br><br>
          <strong style="color:#F5F5F5;">El único paso que falta</strong> es el que separa a los que dicen de los que hacen.<br><br>
          <span style="color:#FF6B35;font-weight:700;">
            El 91% que pospone este momento nunca regresa.<br>
            El ímpetu se evapora exactamente ahora.
          </span>
        </div>
        <button onclick="lockedActivarNow()" class="ld-cta-btn"
          style="width:100%;margin-bottom:10px;font-size:14px;">
          ⚡ ACTIVAR AHORA — SOY DEL 1%
        </button>
        <button id="ldInterceptClose"
          style="width:100%;padding:11px;background:none;border:1px solid rgba(255,255,255,0.07);
            border-radius:14px;color:#5A5A72;font-size:12px;cursor:pointer;">
          Quizás luego — asumo las consecuencias
        </button>
      </div>
    </div>
  `;
}

/* ─── MISIONES BORROSAS ──────────────────────────────────── */
function _renderMisionesBlur(compromisos) {
  const items = compromisos.length > 0 ? compromisos.slice(0, 3) : [
    { emoji: '🏃', nombre: 'Entrenamiento de fuerza', meta: 45, unidad: 'min' },
    { emoji: '📚', nombre: 'Lectura diaria',          meta: 20, unidad: 'pág' },
    { emoji: '💰', nombre: 'Revisión financiera',     meta: 10, unidad: 'min' },
  ];

  return items.map(c => `
    <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;
      background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);
      border-radius:14px;margin-bottom:8px;
      filter:blur(3.5px);pointer-events:none;user-select:none;">
      <span style="font-size:20px;flex-shrink:0;">${c.emoji || '🎯'}</span>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:600;color:#F5F5F5;">${c.nombre}</div>
        <div style="font-size:11px;color:#5A5A72;margin-top:2px;">Meta: ${c.meta} ${c.unidad}</div>
      </div>
      <span style="font-size:16px;color:#5A5A72;">⟩</span>
    </div>`).join('');
}

/* ─── INTERCEPT NAV ──────────────────────────────────────── */
function _initNavIntercept() {
  // Esperar a que el DOM procese el nuevo HTML y luego parchear el nav
  setTimeout(() => {
    document.querySelectorAll('.nav-item').forEach(btn => {
      // Clonar para remover listeners previos
      const fresh = btn.cloneNode(true);
      fresh.addEventListener('click', e => {
        e.stopImmediatePropagation();
        e.preventDefault();
        _showLdModal();
      }, true);
      btn.parentNode.replaceChild(fresh, btn);
    });

    // Cerrar modal con el botón "quizás luego"
    const closeBtn = document.getElementById('ldInterceptClose');
    if (closeBtn) closeBtn.addEventListener('click', _hideLdModal);
  }, 150);
}

function _showLdModal() {
  const modal = document.getElementById('ldInterceptModal');
  if (modal) modal.style.display = 'flex';
}

function _hideLdModal() {
  const modal = document.getElementById('ldInterceptModal');
  if (modal) modal.style.display = 'none';
}

/* ─── CONTADOR LIVE ──────────────────────────────────────── */
function _startLiveCounter() {
  if (_ldLiveIv) clearInterval(_ldLiveIv);
  _ldLiveIv = setInterval(() => {
    if (Math.random() > 0.45) {
      _ldLiveCounter += Math.floor(Math.random() * 2) + 1;
      const e1 = document.getElementById('ldLiveCounter');
      const e2 = document.getElementById('ldActiveCount');
      if (e1) e1.textContent = _ldLiveCounter;
      if (e2) e2.textContent = _ldLiveCounter;
    }
  }, 3800);
}

/* ─── ACCIÓN: ACTIVAR ────────────────────────────────────── */
function lockedActivarNow() {
  _hideLdModal();
  if (_ldLiveIv) { clearInterval(_ldLiveIv); _ldLiveIv = null; }

  // Ocultar el dashboard bloqueado
  const ld = document.getElementById('lockedDashboard');
  if (ld) ld.style.display = 'none';

  // Ir al paso de pago preservando los compromisos ya guardados en Sheets
  OB.step = 4;
  resumePaymentOnboarding();
}
