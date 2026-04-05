/**
 * 🏛️ LA ORDEN — views/report.js
 * Registro de victorias con animación de triunfo
 *
 * CORRECCIÓN PC: la fórmula de preview ahora coincide exactamente
 * con la que usa WebApp.gs en _procesarReporteTWA:
 *   pcGanados = round((valor/meta) * pcBase)
 *   + 20 si cumpl > 150%
 *   + 10 si cumpl > 120%
 */

let reportState = {
  selectedId:  null,
  currentValue: 0,
  commitment:  null,
};

function renderReport(data, params) {
  params = params || {};
  const compromisos = data.compromisos || [];
  const pendientes  = compromisos.filter(c => !c.hecho);
  const estadoPago  = (data.user || {}).estadoPago || 'PENDIENTE';
  const pagado      = estadoPago === 'ACTIVO';

  // ── Sin acceso si no ha pagado
  if (!pagado) {
    return `
      <div class="view" id="view-report">
        <div class="empty-state" style="margin-top:60px;">
          <div class="empty-icon">&#128272;</div>
          <div class="empty-title">Membres&#237;a requerida</div>
          <div class="empty-sub" style="line-height:1.7;">
            Registrar victorias es exclusivo para miembros activos de La Orden.<br><br>
            Tu estructura est&#225; lista. Activa tu membres&#237;a para desbloquear el sistema completo.
          </div>
          <div style="margin-top:20px;">
            <button onclick="resumePaymentOnboarding()"
              style="width:100%;padding:14px 20px;border:none;border-radius:var(--r-lg);
                cursor:pointer;font-family:var(--font-head);font-size:14px;font-weight:800;
                background:linear-gradient(135deg,var(--gold-dim),var(--gold));
                color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.3);">
              &#9889; ACTIVAR MEMBRESIA AHORA
            </button>
          </div>
        </div>
      </div>
    `;
  }


  // Si viene seleccionado directamente, ir al input
  if (params.selectedId) {
    const c = compromisos.find(x => x.id === params.selectedId);
    if (c && !c.hecho) return renderReportInput(c);
  }

  // Sin compromisos registrados
  if (compromisos.length === 0) {
    return `
      <div class="view" id="view-report">
        <div class="empty-state" style="margin-top:60px;">
          <div class="empty-icon">⚔️</div>
          <div class="empty-title">Sin compromisos activos</div>
          <div class="empty-sub">Completa el juramento en Telegram para comenzar a registrar victorias.</div>
        </div>
      </div>
    `;
  }

  // Todos completados hoy
  if (pendientes.length === 0) {
    return `
      <div class="view" id="view-report">
        <div class="empty-state" style="margin-top:60px;">
          <div class="empty-icon">🌟</div>
          <div class="empty-title">¡Todo completado hoy!</div>
          <div class="empty-sub">Has registrado todas tus victorias. Eso te pone entre el 1% que cumple lo que promete.</div>
          <div style="margin-top:20px;">
            <span class="badge-chip badge-chip--gold">Vuelve mañana</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="view" id="view-report" style="padding-bottom: 32px;">
      
      <!-- HERO TITLE -->
      <div style="text-align:center; padding: 30px 20px 20px;">
        <div style="font-size:48px; margin-bottom:12px; filter:drop-shadow(0 0 10px rgba(212,168,67,0.3));">⚔️</div>
        <div style="font-family:var(--font-head); font-size:24px; font-weight:900; color:var(--gold); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em;">
          SELECCIONA TU MISIÓN
        </div>
        <div style="font-size:13px; color:var(--text-3); line-height:1.5; max-width:280px; margin:0 auto;">
          ¿Qué victoria vas a sellar hoy frente al sistema?
        </div>
      </div>

      <div style="font-size:10px; color:var(--text-3); text-transform:uppercase; letter-spacing:0.18em; font-weight:800; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px;">
        MISIONES PENDIENTES (${pendientes.length})
      </div>

      <div class="commitment-selector" style="display:flex; flex-direction:column; gap:8px;">
        ${pendientes.map(c => `
          <div class="tappable" onclick="openReportInput('${c.id}')"
               style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:12px 14px; display:flex; align-items:center; gap:12px; transition:all 0.2s;">
            <span style="font-size:24px; filter:drop-shadow(0 0 4px rgba(0,0,0,0.5));">${c.emoji}</span>
            <div style="flex:1; min-width:0;">
              <div style="font-size:14px; font-weight:800; color:var(--text-1); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.nombre}</div>
              <div style="font-size:11px; color:var(--text-3); display:flex; align-items:center; gap:6px;">
                <span style="color:var(--text-2); font-weight:600;">Meta:</span> ${Number(c.meta).toLocaleString('es-CO')} ${c.unidad}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:10px; font-weight:800; color:var(--electric); background:rgba(123,97,255,0.1); padding:4px 8px; border-radius:8px; border:1px solid rgba(123,97,255,0.2);">+${c.pcBase} PC</span>
              <span style="font-size:16px; color:var(--gold); opacity:0.6;">⟩</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- LETRA PEQUEÑA / DOCTRINA -->
      <div style="margin-top: 32px; padding: 16px; background: rgba(0,0,0,0.4); border: 1px dashed rgba(255,255,255,0.06); border-radius: var(--r-md); text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
          ⚖️ El Peso de tu Palabra
        </div>
        <div style="font-size: 11px; color: var(--text-3); line-height: 1.6; padding:0 10px;">
          En La Orden, hemos destruido intencionalmente la opción de 'Eliminar Misiones' para blindarte de tus propias excusas y debilidades.
          <br><br>
          <span style="opacity: 0.7;">Si cometiste un error matemático real durante la calibración, deberás tramitar la eliminación manualmente contactando a Soporte vía Telegram y asumiendo la responsabilidad.</span>
        </div>
      </div>

    </div>
  `;
}

function renderReportInput(c) {
  reportState.commitment    = c;
  reportState.currentValue  = 0;
  reportState.selectedId    = c.id;

  return `
    <div class="view" id="view-report-input">

      <!-- ENCABEZADO STICKY PARA VOLVER -->
      <div style="position: sticky; top: -20px; background: rgba(10,10,15,0.95); 
           padding: 16px 0; margin: -20px -20px 16px -20px; z-index: 50; display: flex; align-items: center; 
           gap: 8px; cursor: pointer; border-bottom: 1px solid var(--border);" 
           onclick="showCancelReportFriction()">
        <div style="padding: 0 20px; display: flex; align-items: center; gap: 8px; width: 100%;">
          <span style="font-size:20px;color:var(--gold);">←</span>
          <span style="font-size:14px; font-weight:700; color:var(--text-1); letter-spacing:0.04em;">Atrás / Cancelar Reporte</span>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <span style="font-size:36px;">${c.emoji}</span>
        <div>
          <div class="report-commitment-name">${c.nombre}</div>
          <div class="report-target text-muted">Meta diaria: <strong style="color:var(--text-1)">${Number(c.meta).toLocaleString('es-CO')} ${c.unidad}</strong></div>
        </div>
      </div>

      <div class="input-ring">
        <div class="input-value-display" id="inputDisplay">0</div>
        <div class="input-unit">${c.unidad}</div>
        <div class="prog-bar-wrap w-full" style="margin-top:16px;">
          <div class="prog-bar-fill prog-bar-fill--gold" id="reportProgressBar" style="width:0%;"></div>
        </div>
        <div class="flex between w-full" style="margin-top:6px;">
          <span class="text-xs text-muted" id="reportPct">0% de la meta</span>
          <span class="text-xs text-fire fw-600" id="reportCritico"></span>
        </div>
      </div>

      <div class="input-controls">
        <button class="ctrl-btn tappable" onclick="adjustValue(-10)">−10</button>
        <button class="ctrl-btn tappable" onclick="adjustValue(-1)">−1</button>
        <button class="ctrl-btn plus tappable" onclick="adjustValue(1)">+1</button>
        <button class="ctrl-btn plus tappable" onclick="adjustValue(10)">+10</button>
      </div>

      <input type="number" id="customInput" min="0"
        placeholder="Valor exacto..."
        style="width:100%;background:var(--bg-elevated);border:1px solid var(--border);
               border-radius:var(--r-md);color:var(--text-1);font-size:16px;
               padding:12px 16px;outline:none;font-family:var(--font-body);"
        oninput="setCustomValue(this.value)"
        inputmode="decimal" />

      <div class="report-preview" id="reportPreview">
        <span>⚡ Ganarás</span>
        <span class="pc-preview" id="pcPreview">~${c.pcBase} PC</span>
        <span>con esta victoria</span>
      </div>

      <div style="position:relative; width:100%; height:60px; margin-top:20px; border-radius:var(--r-md); overflow:hidden;">
        <div id="holdBgEmpty" style="position:absolute; inset:0; background:rgba(212,168,67,0.05); border:1px solid rgba(212,168,67,0.3); border-radius:var(--r-md); z-index:0;"></div>
        <div id="holdProgressBar" style="position:absolute; top:0; left:0; height:100%; width:0%; background:linear-gradient(135deg, var(--gold-dim), var(--gold)); opacity:0.9; z-index:1;"></div>
        
        <button class="report-commit-btn" id="reportBtn" 
          style="position:absolute; inset:0; width:100%; height:100%; z-index:2; background:transparent; border:none; font-family:var(--font-head); font-weight:900; font-size:15px; letter-spacing:0.05em; color:var(--text-1); display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;" 
          onmousedown="startHoldConfirm()" onmouseup="endHoldConfirm()" onmouseleave="cancelHoldConfirm()" 
          ontouchstart="startHoldConfirm()" ontouchend="endHoldConfirm()" ontouchcancel="cancelHoldConfirm()">
           <span style="filter:drop-shadow(0 0 5px rgba(0,0,0,0.8));">🩸 MANTÉN PRESIONADO PARA SELLAR</span>
        </button>
      </div>

    </div>
  `;
}

// ── LÓGICA DE FIRMA MULTI-SENSORIAL (Hold-To-Confirm) ──
let holdTimer = null;
let holdStart = 0;
let holdDuration = 1200; // 1.2s de friccion exigida

function startHoldConfirm() {
  if (reportState.currentValue <= 0) {
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    return;
  }
  holdStart = Date.now();
  holdTimer = setInterval(updateHoldProgress, 30);
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

function updateHoldProgress() {
  const bar = document.getElementById('holdProgressBar');
  const btn = document.getElementById('reportBtn');
  if (!bar || !holdStart) return;
  
  const diff = Date.now() - holdStart;
  const pct = Math.min(100, (diff / holdDuration) * 100);
  bar.style.width = pct + '%';
  
  // Tensión táctil creciente
  if (diff > 0 && diff % 300 < 30) {
     if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  }

  if (pct >= 100) {
    clearInterval(holdTimer);
    holdStart = 0;
    btn.onmousedown = null;
    btn.ontouchstart = null;
    submitReport();
  }
}

function endHoldConfirm() { cancelHoldConfirm(); }
function cancelHoldConfirm() {
  if (holdTimer) clearInterval(holdTimer);
  holdTimer = null;
  holdStart = 0;
  const bar = document.getElementById('holdProgressBar');
  if (bar) {
    bar.style.transition = 'width 0.3s ease-out';
    bar.style.width = '0%';
    setTimeout(() => { if(!holdStart) bar.style.transition = 'none'; }, 300);
  }
}

function openReportInput(id) {
  const data = window._appData;
  const c    = (data.compromisos || []).find(x => x.id === id);
  if (!c) return;
  document.getElementById('viewContainer').innerHTML = renderReportInput(c);
  document.getElementById('viewContainer').scrollTop = 0;
}

function adjustValue(delta) {
  const c = reportState.commitment;
  if (!c) return;
  reportState.currentValue = Math.max(0, reportState.currentValue + delta);
  updateInputDisplay();
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    if (delta > 0) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    else window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid');
  }
}

function setCustomValue(v) {
  reportState.currentValue = Math.max(0, parseFloat(v) || 0);
  updateInputDisplay();
}

/**
 * Calcula PC exactamente igual que WebApp.gs._procesarReporteTWA
 */
function _calcularPC(valor, meta, pcBase) {
  const cumpl   = meta > 0 ? Math.round((valor / meta) * 100) : 0;
  let pcGanados = Math.round((valor / meta) * pcBase);
  if (cumpl > 150) pcGanados += 20;
  else if (cumpl > 120) pcGanados += 10;
  return Math.max(0, pcGanados);
}

function updateInputDisplay() {
  const c    = reportState.commitment;
  if (!c) return;
  const val  = reportState.currentValue;
  const meta = Number(c.meta) || 1;
  const pct  = meta > 0 ? (val / meta) * 100 : 0;
  const esCritico = pct > 100;

  const disp = document.getElementById('inputDisplay');
  if (disp) {
    disp.textContent = val.toLocaleString('es-CO');
    disp.classList.toggle('critical', esCritico);
  }

  const bar = document.getElementById('reportProgressBar');
  if (bar) {
    bar.style.width = Math.min(100, pct) + '%';
    bar.style.background = esCritico
      ? 'linear-gradient(90deg,var(--fire-dim),var(--fire))'
      : 'linear-gradient(90deg,var(--gold-dim),var(--gold))';
  }

  const pctEl = document.getElementById('reportPct');
  if (pctEl) pctEl.textContent = pct.toFixed(0) + '% de la meta';

  const critico = document.getElementById('reportCritico');
  if (critico) critico.textContent = esCritico ? '🔥 ¡ATAQUE CRÍTICO!' : '';

  // PC preview con misma fórmula que el backend
  const pcEst   = val > 0 ? _calcularPC(val, meta, Number(c.pcBase) || 25) : 0;
  const pcPrev  = document.getElementById('pcPreview');
  if (pcPrev) pcPrev.textContent = '~' + pcEst + ' PC';
}

async function submitReport() {
  const c = reportState.currentValue > 0 ? reportState.commitment : null;
  if (!c) return;

  const btn = document.getElementById('reportBtn');
  if (btn) { 
    btn.disabled = true; 
    btn.style.color = '#0A0A0F';
    btn.style.textShadow = 'none';
    if (!document.getElementById('loading-dots-style')) {
      const style = document.createElement('style');
      style.id = 'loading-dots-style';
      style.innerHTML = `@keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } } .loading-dots span { animation-name: blink; animation-duration: 1.4s; animation-iteration-count: infinite; animation-fill-mode: both; } .loading-dots span:nth-child(2) { animation-delay: .2s; } .loading-dots span:nth-child(3) { animation-delay: .4s; }`;
      document.head.appendChild(style);
    }
    btn.innerHTML = '<b>SELLANDO</b> <span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
  }

  const result = await postReport(c.id, reportState.currentValue);

  if (!result || !result.ok) {
    if (btn) {
       btn.disabled = false;
       btn.innerHTML = '🔄 Error de red — Toca para reintentar';
       btn.style.background = 'rgba(239,68,68,0.15)';
       btn.style.border     = '1px solid rgba(239,68,68,0.4)';
       btn.style.color      = '#EF4444';
       // Restaurar botón original tras 3 segundos para no bloquear al usuario
       setTimeout(() => {
         btn.innerHTML        = '<span style="filter:drop-shadow(0 0 5px rgba(0,0,0,0.8));">🩸 MANTÉN PRESIONADO PARA SELLAR</span>';
         btn.style.background = '';
         btn.style.border     = '';
         btn.style.color      = '';
         btn.style.textShadow = '';
         btn.onmousedown      = startHoldConfirm;
         btn.ontouchstart     = startHoldConfirm;
       }, 3000);
    }
    return;
  }

  // PC ganados devueltos por backend o calculados localmente fallback
  const pcGanados = result.pcGanados || _calcularPC(reportState.currentValue, Number(c.meta), Number(c.pcBase) || 25);
  const esCritico = result.esCritico || (reportState.currentValue > Number(c.meta));

  // Actualizar datos locales optimistas
  if (window._appData) {
    const commitment = (window._appData.compromisos || []).find(x => x.id === c.id);
    if (commitment) {
      commitment.hecho    = true;
      commitment.valorHoy = reportState.currentValue;
    }
    if (window._appData.user) {
      window._appData.user.pcTotal     = (Number(window._appData.user.pcTotal) || 0) + pcGanados;
          
      if (result.icd !== undefined)         window._appData.user.icd         = result.icd;
      if (result.tendencia !== undefined)   window._appData.user.tendencia   = result.tendencia;
      if (result.lineaActiva !== undefined) window._appData.user.lineaActiva = result.lineaActiva;
      if (result.diasActivos !== undefined) window._appData.user.diasActivos = result.diasActivos;
    }
    // Sincronizar variable global usada en la navegación
    // eslint-disable-next-line no-undef
    if (typeof appData !== 'undefined') appData = window._appData;
  }

  // ── Pedir silenciosamente una actualización al servidor mientras la animación se muestra
  // para asegurar consistencia perfecta (Rango, Historial Semanal, etc) si vuelven al inicio.
  if (typeof fetchUserData === 'function') {
    fetchUserData().then(fresh => {
       if (fresh && fresh.user) {
         window._appData = fresh;
         // eslint-disable-next-line no-undef
         if (typeof appData !== 'undefined') appData = fresh;
       }
    });
  }

  // ── Detectar si era la ÚLTIMA misión pendiente del día ──────────
  const data = window._appData;
  const compromisosTotales = (data && data.compromisos) ? data.compromisos.filter(x => x.aplicaHoy !== false) : [];
  // Marcar el compromiso actual como hecho antes de contar
  const compromisoActualizado = compromisosTotales.find(x => x.id === c.id);
  if (compromisoActualizado) compromisoActualizado.hecho = true;

  const pendientesRestantes = compromisosTotales.filter(x => !x.hecho);
  const esDiaCompleto       = pendientesRestantes.length === 0 && compromisosTotales.length > 0;

  if (esDiaCompleto) {
    // Sellar el día en background — fire-and-forget, no bloquea la UI
    closeDay().catch(() => {}); // silencioso en caso de error
    // Vibración especial de logro
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }

  showVictoryOverlay({
    nombre:        c.nombre,
    emoji:         c.emoji,
    area:          c.area,
    valor:         reportState.currentValue,
    unidad:        c.unidad,
    pcGanados:     pcGanados,
    esCritico:     esCritico,
    esDiaCompleto: esDiaCompleto,
    totalMisiones: compromisosTotales.length,
  });
}

function showVictoryOverlay({ nombre, emoji, area, valor, unidad, pcGanados, esCritico, esDiaCompleto, totalMisiones }) {
  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.id = 'victoryOverlay';

  // Colección inmersiva psicológica + copywriting de alto octanaje
  const TITULOS_AREA = {
    'SALUD_FISICA':  ['Sangre al músculo. El hierro no miente.', 'Tu cuerpo es tu templo y esta es tu ofrenda.', 'Endorfinas inyectadas. Tu avatar más fuerte.'],
    'SALUD_MENTAL':  ['Higiene cognitiva alcanzada.', 'Sistema nervioso regulado y listo para el caos.', 'Ruido destruido. Tu mente pertenece al 1%.'],
    'FINANZAS':      ['Interés compuesto activado.', 'Las excusas cuestan dinero, la disciplina lo atrae.', 'Patrimonio ascendiendo, ego controlado.'],
    'PRODUCTIVIDAD': ['La fricción fue destrozada.', 'Eficiencia letal. Tensión cognitiva resuelta.', 'Tu output acaba de devorar a la competencia.'],
    'CRECIMIENTO':   ['La ignorancia es el impuesto de los débiles.', 'Red neuronal expandida. Nuevo firmware.', 'El dolor de aprender es mucho menor que el de fallar.'],
    'RELACIONES':    ['Solo los fuertes saben sostener conexiones.', 'Tu tribu lo siente. Estás totalmente presente.', 'La moneda más cara es tu atención. Invertida.'],
    'ENTORNO':       ['Como es adentro, es afuera.', 'Caos dominado a la fuerza. Territorio asegurado.', 'Fricción de arranque reducida exactamente a cero.'],
    'ESPIRITUALIDAD':['Silencio poderoso. Propósito cromo-anclado.', 'Más allá del ego. Conexión inquebrantable.', 'Software base defragmentado con éxito.'],
    'CARRERA':       ['Tu nombre comienza a sonar donde importa.', 'Avanzando en la jerarquía a sangre fría.', 'La suerte no se exige, el respeto infinito se arranca.'],
    'ANTI_ADICCION': ['El demonio pierde poder exacto en este segundo.', 'Un día más gobernando celosamente tu propia sangre.', 'Destrozando el bucle. Soberanía química recuperada.'],
    'PERSONALIZADO': ['Victoria absoluta sellada a fuego.', 'Acaba de quedar grabado duro en la eternidad.', 'Tu identidad se alimenta insaciablemente de lo que haces hoy.']
  };

  const genericos = ['La disciplina se documenta implacablemente.', 'El 1% acciona. Tú lo estás haciendo real.', 'Forjando el pacto interior.'];
  const arrayBase = TITULOS_AREA[area] || genericos;
  const textoElegido = arrayBase[Math.floor(Math.random() * arrayBase.length)];

  const fraseSubt = esCritico ? 'Recompensa de dopamina maximizada. Has sobrecumplido.' : textoElegido;

  if (esDiaCompleto) {
    // ── OVERLAY ESPECIAL: DÍA COMPLETO ─────────────────────────────
    overlay.innerHTML = `
      <div class="victory-content">
        <div class="victory-badge" style="font-size:52px;">🌟</div>
        <div class="victory-title" style="font-size:22px;">¡DÍA COMPLETO!</div>
        <div class="victory-sub" style="color:var(--gold);font-weight:700;">Sellaste todas tus ${totalMisiones} misiones.</div>
        <div style="margin:12px 0;">
          <div class="victory-pc">+${pcGanados} PC</div>
          <div class="victory-pc-label">PUNTOS DE PODER GANADOS</div>
        </div>
        <div class="badge-chip badge-chip--gold" style="margin-top:4px;">
          ${nombre}: ${Number(valor).toLocaleString('es-CO')} ${unidad}
        </div>
        <div style="margin-top:16px;font-size:12px;color:rgba(255,255,255,0.5);">
          ✅ Día sellado automáticamente
        </div>
      </div>
    `;
  } else {
    // ── OVERLAY NORMAL: VICTORIA INDIVIDUAL ────────────────────────
    overlay.innerHTML = `
      <div class="victory-content">
        <div class="victory-badge" style="filter:drop-shadow(0 0 40px rgba(212,168,67,0.8)); font-size: 85px; margin-bottom: 24px; animation: popScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">${esCritico ? '💥' : emoji}</div>
        <div class="victory-title" style="letter-spacing: 0.15em; color: ${esCritico ? 'var(--fire)' : 'var(--gold)'}; text-shadow: 0 0 25px ${esCritico ? 'rgba(255,107,53,0.7)' : 'rgba(212,168,67,0.7)'}; font-size: 28px;">${esCritico ? '¡ATAQUE CRÍTICO!' : '¡VICTORIA SELLADA!'}</div>
        <div class="victory-sub" style="font-size: 15px; color: var(--text-2); margin-top: 14px; font-style: italic; max-width: 280px; margin-left:auto; margin-right:auto;">"${fraseSubt}"</div>
        <div style="margin:20px 0 16px;">
          <div class="victory-pc" style="font-size:32px; filter:drop-shadow(0 0 10px rgba(123,97,255,0.6)); color:var(--electric);">+${pcGanados} PC</div>
          <div class="victory-pc-label" style="letter-spacing:0.1em; color:var(--text-3); font-size:11px;">PUNTOS DE PODER GANADOS</div>
        </div>
        <div class="badge-chip badge-chip--gold" style="margin-top:10px; font-size:15px; padding:10px 20px; font-family:var(--font-head); font-weight:700;">
          ${nombre}: ${Number(valor).toLocaleString('es-CO')} ${unidad}
        </div>
      </div>
    `;
  }

  document.body.appendChild(overlay);
  startConfetti();

  // 💥 EFECTO DESTRUCTOR NEUROSENSORIAL (Explosión Domapínica)
  if (!document.getElementById('flash-style-victory')) {
    const s = document.createElement('style');
    s.id = 'flash-style-victory';
    s.innerHTML = `
      @keyframes megaFlash { 0%{opacity:1;background:#fff;} 15%{opacity:0.9;background:var(--gold);} 100%{opacity:0;background:rgba(0,0,0,0.8);} }
      @keyframes popScale { 0%{transform:scale(0); opacity:0;} 50%{transform:scale(1.2); opacity:1; filter:brightness(2);} 100%{transform:scale(1); opacity:1; filter:brightness(1);} }
      .screen-mega-flash { position:fixed;inset:0;z-index:99999;pointer-events:none;animation:megaFlash 0.9s cubic-bezier(0,1.2,.2,1) forwards; mix-blend-mode:color-dodge; }
    `;
    document.head.appendChild(s);
  }
  const flashEl = document.createElement('div');
  flashEl.className = 'screen-mega-flash';
  document.body.appendChild(flashEl);
  setTimeout(() => flashEl.remove(), 1000);

  // 📳 HAPTICS SECUENCIALES ("Batería sensorial")
  if (window.Telegram?.WebApp?.HapticFeedback) {
    const haptic = window.Telegram.WebApp.HapticFeedback;
    haptic.impactOccurred('heavy');
    setTimeout(() => haptic.impactOccurred('heavy'), 80);
    setTimeout(() => haptic.notificationOccurred('success'), 300);
    
    // Extra boost para crítico o día completo
    if (esCritico || esDiaCompleto) {
        setTimeout(() => haptic.impactOccurred('heavy'), 500);
        setTimeout(() => haptic.impactOccurred('heavy'), 650);
        setTimeout(() => haptic.notificationOccurred('warning'), 850);
    }
  }

  const duracion = esDiaCompleto ? 3500 : 3300;

  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      overlay.remove();
      stopConfetti();
      navigateTo('home');
    }, 400);
  }, duracion);
}
