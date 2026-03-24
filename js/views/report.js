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
          <div class="empty-icon">🔐</div>
          <div class="empty-title">Membresía requerida</div>
          <div class="empty-sub" style="line-height:1.7;">
            Registrar victorias es una función exclusiva para miembros activos de La Orden.<br><br>
            Activa tu membresía en Telegram y desbloquea todo el poder del sistema.
          </div>
          <div style="margin-top:20px;">
            <span class="badge-chip badge-chip--gold">🏛️ Activar en Telegram</span>
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
    <div class="view" id="view-report">
      <div class="section-title" style="margin-bottom:4px;">Selecciona tu misión</div>
      <p class="text-sm text-muted" style="margin-bottom:8px;">Elige qué victoria vas a registrar ahora</p>
      <div class="commitment-selector">
        ${pendientes.map(c => `
          <div class="commitment-pick-item" onclick="openReportInput('${c.id}')">
            <span style="font-size:28px;">${c.emoji}</span>
            <div style="flex:1;">
              <div class="fw-600" style="font-size:15px;">${c.nombre}</div>
              <div class="text-sm text-muted">Meta: ${Number(c.meta).toLocaleString('es-CO')} ${c.unidad}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <span class="badge-chip badge-chip--gold">+${c.pcBase} PC base</span>
              <span style="font-size:18px;color:var(--text-3);">⟩</span>
            </div>
          </div>
        `).join('')}
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

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:-4px;cursor:pointer;" onclick="navigateTo('report')">
        <span style="font-size:18px;color:var(--text-3);">←</span>
        <span class="text-sm text-muted">Volver</span>
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
        <button class="ctrl-btn" onclick="adjustValue(-10)">−10</button>
        <button class="ctrl-btn" onclick="adjustValue(-1)">−1</button>
        <button class="ctrl-btn plus" onclick="adjustValue(1)">+1</button>
        <button class="ctrl-btn plus" onclick="adjustValue(10)">+10</button>
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

      <button class="report-commit-btn" id="reportBtn" onclick="submitReport()">
        ✍️ SELLAR MI VICTORIA
      </button>

    </div>
  `;
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
  const c = reportState.commitment;
  if (!c || reportState.currentValue <= 0) return;

  // Gate de pago: verificar antes de procesar
  const estadoPago = (window._appData && window._appData.user) ? window._appData.user.estadoPago : 'PENDIENTE';
  if (estadoPago !== 'ACTIVO') {
    const btn = document.getElementById('reportBtn');
    if (btn) btn.textContent = '🔐 Requiere membresía activa';
    return;
  }

  const btn = document.getElementById('reportBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Registrando…'; }

  const result = await postReport(c.id, reportState.currentValue);

  // PC ganados: usar el calculado localmente si el backend no lo devuelve
  const pcGanados = result.pcGanados
    || _calcularPC(reportState.currentValue, Number(c.meta), Number(c.pcBase) || 25);
  const esCritico = result.esCritico
    || (reportState.currentValue > Number(c.meta));

  // Actualizar datos locales para que el home refleje el cambio
  const commitment = (window._appData.compromisos || []).find(x => x.id === c.id);
  if (commitment) {
    commitment.hecho    = true;
    commitment.valorHoy = reportState.currentValue;
  }
  // Sumar PC al total local (estimación optimista hasta próximo refresh)
  if (window._appData.user) {
    window._appData.user.pcTotal = (Number(window._appData.user.pcTotal) || 0) + pcGanados;
  }

  showVictoryOverlay({
    nombre:     c.nombre,
    emoji:      c.emoji,
    valor:      reportState.currentValue,
    unidad:     c.unidad,
    pcGanados:  pcGanados,
    esCritico:  esCritico,
  });

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
}

function showVictoryOverlay({ nombre, emoji, valor, unidad, pcGanados, esCritico }) {
  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.id = 'victoryOverlay';

  const titles = [
    'Un paso más que el 99%.',
    'Consignado en tu legado.',
    'La disciplina tiene nombre.',
    'Tu yo futuro lo agradece.',
  ];

  overlay.innerHTML = `
    <div class="victory-content">
      <div class="victory-badge">${esCritico ? '💥' : emoji}</div>
      <div class="victory-title">${esCritico ? '¡ATAQUE CRÍTICO!' : '¡VICTORIA SELLADA!'}</div>
      <div class="victory-sub">${titles[Math.floor(Math.random() * titles.length)]}</div>
      <div style="margin:8px 0;">
        <div class="victory-pc">+${pcGanados} PC</div>
        <div class="victory-pc-label">PUNTOS DE PODER GANADOS</div>
      </div>
      <div class="badge-chip badge-chip--gold" style="margin-top:4px;">
        ${nombre}: ${Number(valor).toLocaleString('es-CO')} ${unidad}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  startConfetti();

  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      overlay.remove();
      stopConfetti();
      // Volver al home con datos actualizados localmente
      navigateTo('home');
    }, 400);
  }, 3000);
}
