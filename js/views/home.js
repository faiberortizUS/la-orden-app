/**
 * 🏛️ LA ORDEN — views/home.js
 * Dashboard principal: ICD Gauge, Streak, Misiones
 */

function renderHome(data) {
  const { user, compromisos } = data;
  const total        = (compromisos || []).length;
  const activos      = (compromisos || []).filter(c => c.aplicaHoy !== false);
  const inactivos    = (compromisos || []).filter(c => c.aplicaHoy === false);
  const doneCount    = activos.filter(c => c.hecho).length;

  // Calcular zona ICD
  const icd = Number(user.icd) || 0;
  let zona = 'Iniciando', zonaClass = 'text-muted';
  if (icd >= 85)      { zona = 'ZONA ÉLITE 🎯';  zonaClass = 'text-gold'; }
  else if (icd >= 70) { zona = 'ZONA SÓLIDA';     zonaClass = 'text-electric'; }
  else if (icd >= 50) { zona = 'EN PROGRESO';     zonaClass = ''; }
  else if (icd > 0)   { zona = 'EN CONSTRUCCIÓN'; zonaClass = 'text-muted'; }

  // Gauge SVG
  const R = 70, C = 2 * Math.PI * R;
  const filled = C * (icd / 100);
  const gap    = C - filled;

  // Streak
  const lineaActiva  = Number(user.lineaActiva) || 0;
  const nextMilestone = [7, 14, 21, 30, 60, 90].find(m => m > lineaActiva) || 100;
  const streakPct     = Math.min(100, (lineaActiva / nextMilestone) * 100);

  // Rango partes
  const rangoParts  = (user.rango || '🌱 Aspirante').split(' ');
  const rangoEmoji  = rangoParts[0];
  const rangoNombre = rangoParts.slice(1).join(' ');

  // Estado de compromisos del día
  const sinCompromisos = total === 0;
  const todoCompleto   = activos.length > 0 && doneCount === activos.length;

  return `
    <div class="view" id="view-home">

      <!-- BIENVENIDA si es nuevo sin compromisos -->
      ${sinCompromisos ? `
        <div class="card" style="text-align:center; padding:var(--s6); border-color:var(--border-gold);">
          <div style="font-size:40px; margin-bottom:12px;">🏛️</div>
          <div class="fw-800 text-gold" style="font-size:18px; font-family:var(--font-head); margin-bottom:8px;">
            Bienvenido, ${user.nombre || 'Arquitecto'}
          </div>
          <div class="text-sm text-muted" style="line-height:1.6;">
            Aún no tienes compromisos activos para hoy.<br>
            Completa tu <strong>Juramento de Acero</strong> para activar el sistema.
          </div>
          <div style="margin-top:16px;">
            <button onclick="startOnboarding()" class="badge-chip badge-chip--gold" style="border:none;cursor:pointer;background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;">🏛️ Iniciar Incorporación</button>
          </div>
        </div>
      ` : ''}

      <!-- ICD HERO CARD -->
      <div class="card card--glass card--gold">
        <div class="gauge-wrap">
          <svg class="gauge-svg" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#7B61FF"/>
                <stop offset="50%"  stop-color="#D4A843"/>
                <stop offset="100%" stop-color="#FF6B35"/>
              </linearGradient>
            </defs>
            <circle class="gauge-circle gauge-bg" cx="90" cy="90" r="${R}"
              stroke-dasharray="${C}" stroke-dashoffset="0"
              transform="rotate(-90 90 90)" />
            <circle class="gauge-circle gauge-fill" cx="90" cy="90" r="${R}"
              id="icdArc"
              style="stroke-dasharray: 0 ${C}; transition: stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1);"
              data-filled="${filled}" data-gap="${gap}"
              transform="rotate(-90 90 90)" />
            <text class="gauge-text-group">
              <tspan class="gauge-score" x="90" y="82">${icd}</tspan>
              <tspan class="gauge-label" x="90" y="100">ICD · CONSISTENCIA</tspan>
              <tspan class="gauge-zone ${zonaClass}" x="90" y="116">${zona}</tspan>
            </text>
          </svg>

          <div class="flex gap-3" style="flex-direction:column;align-items:center;gap:8px;">
            <div style="font-size:14px;font-weight:700;color:var(--text-1);font-family:var(--font-head);letter-spacing:0.05em;">
              ${user.nombre || 'Aspirante'}
            </div>
            <div class="flex gap-3">
              <span class="badge-chip badge-chip--gold">⚡ ${Number(user.pcTotal || 0).toLocaleString('es-CO')} PC</span>
              <span class="badge-chip badge-chip--electric">${user.diasActivos || 0} días activo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- STREAK CARD -->
      <div class="card card--fire" style="padding:var(--s4);">
        <div class="streak-card" style="padding:0;">
          <div class="streak-fire">🔥</div>
          <div class="streak-info">
            <div class="streak-count">${lineaActiva}</div>
            <div class="streak-label">días de Línea Activa</div>
          </div>
          <div class="streak-bar-wrap">
            <div class="flex between" style="margin-bottom:4px;">
              <span class="text-xs text-muted">Hito: ${nextMilestone}d</span>
              <span class="text-xs text-fire fw-600" id="streakPctLabel">${streakPct.toFixed(0)}%</span>
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
          <div class="stat-val stat-val--gold">${rangoEmoji}</div>
          <div class="stat-lbl">${rangoNombre}</div>
          <div class="stat-delta">${user.tendencia || '→'}</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val">🛡️ ${user.escudos || 0}</div>
          <div class="stat-lbl">Escudos activos</div>
          <div class="stat-delta">Cada 14 días</div>
        </div>
      </div>

      <!-- MISIONES DEL DÍA (solo si hay compromisos) -->
      ${!sinCompromisos ? `
        <div>
          <div class="missions-header">
            <span class="section-title">Misiones de hoy</span>
            <span class="missions-count">${doneCount}/${activos.length}</span>
          </div>
          <div class="prog-bar-wrap" style="margin-bottom:var(--s4);">
            <div class="prog-bar-fill prog-bar-fill--gold"
              style="width:${activos.length > 0 ? Math.round((doneCount/activos.length)*100) : 0}%"></div>
          </div>
          <div class="mission-list">
            ${activos.map(c => `
              <div class="mission-item ${c.hecho ? 'done' : ''}" onclick="selectMission('${c.id}')">
                <span class="mission-emoji">${c.emoji}</span>
                <div class="mission-info">
                  <div class="mission-name">${c.nombre}</div>
                  <div class="mission-meta">${c.hecho
                    ? `✅ Completado: ${Number(c.valorHoy).toLocaleString('es-CO')} ${c.unidad}`
                    : `Meta: ${Number(c.meta).toLocaleString('es-CO')} ${c.unidad}`}
                  </div>
                </div>
                <span class="mission-check">${c.hecho ? '✅' : '⟩'}</span>
              </div>
            `).join('')}
            
            ${inactivos.map(c => `
              <div class="mission-item" style="opacity: 0.5; cursor: not-allowed;">
                <span class="mission-emoji" style="filter: grayscale(1);">${c.emoji}</span>
                <div class="mission-info">
                  <div class="mission-name" style="color: var(--text-3); text-decoration: line-through;">${c.nombre}</div>
                  <div class="mission-meta" style="color: var(--text-3);">
                    ⏸️ Pausado hoy (${c.frecuencia === 'FDS' ? 'Fines de semana' : 'Lunes a viernes'})
                  </div>
                </div>
                <span class="mission-check" style="color: var(--text-3);">🔒</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${todoCompleto ? `
          <div class="card" style="text-align:center; border-color:var(--border-gold);
            background:linear-gradient(135deg,rgba(212,168,67,0.08),rgba(212,168,67,0.03));">
            <div style="font-size:32px; margin-bottom:8px;">🌟</div>
            <div class="fw-700 text-gold" style="font-size:16px;font-family:var(--font-head);">¡Hoy conquistaste todo!</div>
            <div class="text-sm text-muted" style="margin-top:6px;line-height:1.5;">
              Eso te pone entre las personas que realmente hacen lo que dicen. Eso es el 1%.
            </div>
          </div>
        ` : ''}
      ` : ''}

    </div>
  `;
}

function initHomeAnimations() {
  setTimeout(() => {
    const arc = document.getElementById('icdArc');
    if (arc) {
      arc.style.strokeDasharray = `${arc.dataset.filled} ${arc.dataset.gap}`;
    }
  }, 300);

  setTimeout(() => {
    const bar     = document.getElementById('streakBar');
    const pctLabel = document.getElementById('streakPctLabel');
    if (bar && pctLabel) {
      bar.style.width = parseFloat(pctLabel.textContent) + '%';
    }
  }, 400);
}

function selectMission(id) {
  navigateTo('report', { selectedId: id });
}
