/**
 * 🏛️ LA ORDEN — views/report.js
 * Registro de victorias con animación de triunfo
 */

let reportState = {
  selectedId: null,
  currentValue: 0,
  commitment: null,
};

function renderReport(data, params = {}) {
  const { compromisos } = data;
  const pendientes = compromisos.filter(c => !c.hecho);

  // Si viene seleccionado uno específico, mostrar entrada directamente
  if (params.selectedId) {
    const c = compromisos.find(x => x.id === params.selectedId);
    if (c && !c.hecho) return renderReportInput(c);
  }

  if (pendientes.length === 0) {
    return `
      <div class="view" id="view-report">
        <div class="empty-state" style="margin-top: 60px;">
          <div class="empty-icon">🌟</div>
          <div class="empty-title">¡Todo completado hoy!</div>
          <div class="empty-sub">Has registrado todas tus victorias. Eso te pone entre el 1% que cumple lo que promete.</div>
          <div style="margin-top: 20px;">
            <span class="badge-chip badge-chip--gold">Vuelve mañana</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="view" id="view-report">
      <div class="section-title" style="margin-bottom: 4px;">Selecciona tu misión</div>
      <p class="text-sm text-muted" style="margin-bottom: 8px;">Elige qué victoria vas a registrar ahora</p>
      <div class="commitment-selector">
        ${pendientes.map(c => `
          <div class="commitment-pick-item" onclick="openReportInput('${c.id}')">
            <span style="font-size:28px;">${c.emoji}</span>
            <div style="flex:1;">
              <div class="fw-600" style="font-size:15px;">${c.nombre}</div>
              <div class="text-sm text-muted">Meta: ${c.meta.toLocaleString('es-CO')} ${c.unidad}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
              <span class="badge-chip badge-chip--gold">+${c.pcBase} PC</span>
              <span style="font-size:18px; color:var(--text-3);">⟩</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReportInput(c) {
  reportState.commitment = c;
  reportState.currentValue = 0;

  return `
    <div class="view" id="view-report-input">

      <!-- Back -->
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:-4px; cursor:pointer;" onclick="navigateTo('report')">
        <span style="font-size:18px; color:var(--text-3);">←</span>
        <span class="text-sm text-muted">Volver</span>
      </div>

      <!-- Header -->
      <div class="report-header" style="padding:0; text-align:left;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
          <span style="font-size:36px;">${c.emoji}</span>
          <div>
            <div class="report-commitment-name">${c.nombre}</div>
            <div class="report-target text-muted">Meta diaria: <strong style="color:var(--text-1)">${c.meta.toLocaleString('es-CO')} ${c.unidad}</strong></div>
          </div>
        </div>
      </div>

      <!-- Input Ring -->
      <div class="input-ring">
        <div class="input-value-display" id="inputDisplay">0</div>
        <div class="input-unit">${c.unidad}</div>

        <!-- Live progress -->
        <div class="prog-bar-wrap w-full" style="margin-top:16px;">
          <div class="prog-bar-fill prog-bar-fill--gold" id="reportProgressBar" style="width:0%;"></div>
        </div>
        <div class="flex between w-full" style="margin-top:6px;">
          <span class="text-xs text-muted" id="reportPct">0% de la meta</span>
          <span class="text-xs text-fire fw-600" id="reportCritico"></span>
        </div>
      </div>

      <!-- Controls -->
      <div class="input-controls">
        <button class="ctrl-btn" onclick="adjustValue(-10)">−10</button>
        <button class="ctrl-btn" onclick="adjustValue(-1)">−1</button>
        <button class="ctrl-btn plus" onclick="adjustValue(1)">+1</button>
        <button class="ctrl-btn plus" onclick="adjustValue(10)">+10</button>
      </div>

      <!-- Custom input -->
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="number" id="customInput" min="0"
          placeholder="Valor exacto..."
          style="flex:1; background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--r-md);
                 color:var(--text-1); font-size:16px; padding:12px 16px; outline:none; font-family:var(--font-body);"
          oninput="setCustomValue(this.value)"
          inputmode="decimal" />
      </div>

      <!-- PC Preview -->
      <div class="report-preview" id="reportPreview">
        <span>⚡ Ganarás</span>
        <span class="pc-preview" id="pcPreview">~${c.pcBase} PC</span>
        <span>con esta victoria</span>
      </div>

      <!-- CTA -->
      <button class="report-commit-btn" id="reportBtn" onclick="submitReport()">
        ✍️ SELLAR MI VICTORIA
      </button>

    </div>
  `;
}

function openReportInput(id) {
  const data = window._appData;
  const c = data.compromisos.find(x => x.id === id);
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

function updateInputDisplay() {
  const c = reportState.commitment;
  if (!c) return;
  const val = reportState.currentValue;
  const meta = c.meta;
  const pct = meta > 0 ? (val / meta) * 100 : 100;
  const esCritico = pct > 100;

  // Display value
  const disp = document.getElementById('inputDisplay');
  if (disp) {
    disp.textContent = val.toLocaleString('es-CO');
    disp.classList.toggle('critical', esCritico);
  }

  // Progress bar
  const bar = document.getElementById('reportProgressBar');
  if (bar) {
    bar.style.width = Math.min(100, pct) + '%';
    bar.style.background = esCritico
      ? 'linear-gradient(90deg, var(--fire-dim), var(--fire))'
      : 'linear-gradient(90deg, var(--gold-dim), var(--gold))';
  }

  // Pct label
  const pctEl = document.getElementById('reportPct');
  if (pctEl) pctEl.textContent = `${pct.toFixed(0)}% de la meta`;

  // Crítico label
  const critico = document.getElementById('reportCritico');
  if (critico) critico.textContent = esCritico ? '🔥 ¡ATAQUE CRÍTICO!' : '';

  // PC preview
  const pcBase = c.pcBase || 30;
  let pcEst = Math.round((val / meta) * pcBase);
  if (pct > 150) pcEst = pcBase + 20;
  else if (pct > 120) pcEst = pcBase + 10;
  const pcPrev = document.getElementById('pcPreview');
  if (pcPrev) pcPrev.textContent = `~${Math.max(0, pcEst)} PC`;
}

async function submitReport() {
  const c = reportState.commitment;
  if (!c || reportState.currentValue <= 0) return;

  const btn = document.getElementById('reportBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Registrando...'; }

  const result = await postReport(c.id, reportState.currentValue);

  // Marcar como hecho en datos locales
  const commitment = window._appData.compromisos.find(x => x.id === c.id);
  if (commitment) {
    commitment.hecho = true;
    commitment.valorHoy = reportState.currentValue;
  }

  // Mostrar overlay de victoria
  showVictoryOverlay({
    nombre: c.nombre,
    emoji: c.emoji,
    valor: reportState.currentValue,
    unidad: c.unidad,
    pcGanados: result.pcGanados || 28,
    esCritico: result.esCritico || reportState.currentValue > c.meta,
  });

  // Haptic feedback
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
      <div style="margin: 8px 0;">
        <div class="victory-pc">+${pcGanados} PC</div>
        <div class="victory-pc-label">PUNTOS DE PODER GANADOS</div>
      </div>
      <div class="badge-chip badge-chip--gold" style="margin-top:4px;">${nombre}: ${valor} ${unidad}</div>
    </div>
  `;

  document.body.appendChild(overlay);
  startConfetti();

  // Auto-dismiss
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      overlay.remove();
      stopConfetti();
      navigateTo('home');
    }, 400);
  }, 3000);
}
