/**
 * 🏛️ LA ORDEN — views/home.js
 * Dashboard principal: ICD Gauge, Streak, Misiones
 */

function renderHome(data) {
  const { user, compromisos } = data;
  const pendientes = compromisos.filter(c => !c.hecho);
  const completadas = compromisos.filter(c => c.hecho);
  const total = compromisos.length;
  const doneCount = completadas.length;

  // Calcular zona ICD
  const icd = user.icd;
  let zona = 'En Construcción', zonaClass = 'text-muted';
  if (icd >= 85) { zona = 'ZONA ÉLITE 🎯'; zonaClass = 'text-gold'; }
  else if (icd >= 70) { zona = 'ZONA SÓLIDA'; zonaClass = 'text-electric'; }
  else if (icd >= 50) { zona = 'EN PROGRESO'; zonaClass = ''; }

  // Calcular parámetros del gauge
  const R = 70, C = 2 * Math.PI * R;
  const filled = C * (icd / 100);
  const gap = C - filled;

  // Streak milestone
  const nextMilestone = [7, 14, 21, 30, 60, 90].find(m => m > user.lineaActiva) || 100;
  const streakPct = Math.min(100, (user.lineaActiva / nextMilestone) * 100);

  return `
    <div class="view" id="view-home">

      <!-- ICD HERO CARD -->
      <div class="card card--glass card--gold">
        <div class="gauge-wrap">
          <svg class="gauge-svg" viewBox="0 0 180 180" id="icdGaugeSvg">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#7B61FF"/>
                <stop offset="50%"  stop-color="#D4A843"/>
                <stop offset="100%" stop-color="#FF6B35"/>
              </linearGradient>
            </defs>
            <!-- Background track -->
            <circle class="gauge-circle gauge-bg" cx="90" cy="90" r="${R}"
              stroke-dasharray="${C}" stroke-dashoffset="0"
              transform="rotate(-90 90 90)" />
            <!-- Filled arc -->
            <circle class="gauge-circle gauge-fill" cx="90" cy="90" r="${R}"
              id="icdArc"
              stroke-dasharray="${filled} ${gap}"
              stroke-dashoffset="${C * 0.25}"
              transform="rotate(-90 90 90)"
              style="stroke-dasharray: 0 ${C}; transition: stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1);"
              data-filled="${filled}" data-gap="${gap}" />
            <!-- Text -->
            <text class="gauge-text-group">
              <tspan class="gauge-score" x="90" y="82">${icd}</tspan>
              <tspan class="gauge-label" x="90" y="100">ICD · CONSISTENCIA</tspan>
              <tspan class="gauge-zone ${zonaClass}" x="90" y="116">${zona}</tspan>
            </text>
          </svg>

          <div class="flex gap-3">
            <span class="badge-chip badge-chip--gold">⚡ ${user.pcTotal.toLocaleString('es-CO')} PC</span>
            <span class="badge-chip badge-chip--electric">${user.diasActivos} días activo</span>
          </div>
        </div>
      </div>

      <!-- STREAK CARD -->
      <div class="card card--fire" style="padding: var(--s4);">
        <div class="streak-card" style="padding:0;">
          <div class="streak-fire">🔥</div>
          <div class="streak-info">
            <div class="streak-count">${user.lineaActiva}</div>
            <div class="streak-label">días de Línea Activa</div>
          </div>
          <div class="streak-bar-wrap">
            <div class="flex between" style="margin-bottom:4px;">
              <span class="text-xs text-muted">Hito: ${nextMilestone}d</span>
              <span class="text-xs text-fire fw-600">${streakPct.toFixed(0)}%</span>
            </div>
            <div class="streak-bar-track">
              <div class="streak-bar-fill" id="streakBar" style="width:0%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATS ROW -->
      <div class="stat-row">
        <div class="stat-chip">
          <div class="stat-val stat-val--gold">${user.rango.split(' ')[0]}</div>
          <div class="stat-lbl">${user.rango.split(' ').slice(1).join(' ')}</div>
          <div class="stat-delta">↑ ${user.tendencia}</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val">🛡️ ${user.escudos}</div>
          <div class="stat-lbl">Escudos activos</div>
          <div class="stat-delta">Cada 14 días</div>
        </div>
      </div>

      <!-- MISIONES DEL DÍA -->
      <div>
        <div class="missions-header">
          <span class="section-title">Misiones de hoy</span>
          <span class="missions-count">${doneCount}/${total}</span>
        </div>
        <!-- Progress global del día -->
        <div class="prog-bar-wrap" style="margin-bottom: var(--s4);">
          <div class="prog-bar-fill prog-bar-fill--gold" id="dayProgressBar" style="width:${total > 0 ? (doneCount/total)*100 : 0}%"></div>
        </div>
        <div class="mission-list">
          ${compromisos.map(c => `
            <div class="mission-item ${c.hecho ? 'done' : ''}" onclick="selectMission('${c.id}')">
              <span class="mission-emoji">${c.emoji}</span>
              <div class="mission-info">
                <div class="mission-name">${c.nombre}</div>
                <div class="mission-meta">${c.hecho ? `✅ Completado: ${c.valorHoy} ${c.unidad}` : `Meta: ${c.meta.toLocaleString('es-CO')} ${c.unidad}`}</div>
              </div>
              <span class="mission-check">${c.hecho ? '✅' : '⟩'}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${doneCount === total && total > 0 ? `
        <div class="card" style="text-align:center; border-color: var(--border-gold); background: linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03));">
          <div style="font-size:32px; margin-bottom:8px;">🌟</div>
          <div class="fw-700 text-gold" style="font-size:16px; font-family:var(--font-head);">¡Hoy conquistaste todo!</div>
          <div class="text-sm text-muted" style="margin-top:6px; line-height:1.5;">Eso te pone entre las personas que realmente hacen lo que dicen. Eso es el 1%.</div>
        </div>
      ` : ''}

    </div>
  `;
}

function initHomeAnimations() {
  // Animate ICD gauge
  setTimeout(() => {
    const arc = document.getElementById('icdArc');
    if (arc) {
      const filled = parseFloat(arc.dataset.filled);
      const gap = parseFloat(arc.dataset.gap);
      arc.style.strokeDasharray = `${filled} ${gap}`;
    }
  }, 300);

  // Animate streak bar
  setTimeout(() => {
    const bar = document.getElementById('streakBar');
    if (bar) {
      const pct = parseFloat(bar.closest('.streak-bar-wrap')?.querySelector('.text-fire')?.textContent || 0);
      bar.style.width = Math.min(100, pct) + '%';
    }
  }, 400);
}

function selectMission(id) {
  // Navegar a reportar esa misión específica
  navigateTo('report', { selectedId: id });
}
