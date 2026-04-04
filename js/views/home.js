/**
 * 🏛️ LA ORDEN — views/home.js
 * Dashboard principal: ICD Gauge, Streak, Misiones
 */

function renderHome(data) {
  const { user, compromisos } = data;
  const total        = (compromisos || []).length;
  // activos = aplican hoy (aplicaHoy true ó undefined/null = por defecto sí aplica)
  // inactivos = explícitamente marcados como false (no aplica hoy)
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
        <div class="card stagger-up stagger-1" style="text-align:center; padding:var(--s6); border-color:var(--border-gold);">
          <div style="font-size:40px; margin-bottom:12px;">🏛️</div>
          <div class="fw-800 text-gold" style="font-size:18px; font-family:var(--font-head); margin-bottom:8px;">
            Bienvenido, ${user.nombre || 'Arquitecto'}
          </div>
          <div class="text-sm text-muted" style="line-height:1.6;">
            Aún no tienes compromisos activos para hoy.<br>
            Completa tu <strong>Juramento de Acero</strong> para activar el sistema.
          </div>
          <div style="margin-top:16px;">
            <button onclick="startOnboarding()" class="badge-chip badge-chip--gold tappable" style="border:none;background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;">🏛️ Iniciar Incorporación</button>
          </div>
        </div>
      ` : ''}

      <!-- ICD HERO CARD -->
      <div>
        <div class="card card--glass card--gold tappable ${icd >= 85 ? 'breathe-gold' : icd < 50 ? 'breathe-danger' : ''}" onclick="showInteractiveModal('Tu ICD: Lo que pierdes cada día que no reportas', '⚠️ <b>Aversión a la Pérdida:</b> Cada día sin reporte destruye puntos de tu ICD. Un ICD bajo no solo es un número — te <b>retrograda de rango</b> y te expulsa del ranking global.<br><br>📊 <b>Fórmula de La Orden:</b><br>50% Cumplimiento · 30% Regularidad · 20% Resiliencia<br><br>🎯 <b>Zonas de poder:</b><br>• 85+ = Zona Élite (Top 1%)<br>• 70–84 = Zona Sólida<br>• 50–69 = En Progreso<br>• &lt;50 = Zona de Riesgo<br><br>💡 Un ICD de 85 tarda 21 días en construirse y solo 3 días en caer a zona de riesgo si paras. <b>No lo pierdas.</b>', '🎯')">
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
                stroke="var(--bg-elevated)" stroke-width="10"
                stroke-dasharray="${C}" stroke-dashoffset="0"
                transform="rotate(-90 90 90)" />
              <circle class="gauge-circle gauge-fill" cx="90" cy="90" r="${R}"
                id="icdArc" stroke="url(#gaugeGrad)" stroke-width="10"
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
      </div>

      <!-- EXISTENTIAL PROTOCOL: MIDNIGHT CLOCK -->
      <div class="card stagger-up stagger-1 tappable" style="margin-top:10px; background:linear-gradient(145deg, #0A0A0F, #12121A); border:1px solid rgba(255,107,53,0.3); text-align:center; padding:16px; position:relative; overflow:hidden;" onclick="showInteractiveModal('El Tiempo no Retorna', 'En el universo del 1%, tu moneda más frágil no es el dinero ni los reportes, sino el tiempo en sí mismo.<br><br>Al filo estricto de la medianoche, se cerrará irrevocablemente la bóveda de este día. Si el contador llega a cero y no has interactuado, un día completo se borrará de tu línea de tiempo y afectará implacablemente tu estructura.<br><br><b>¿Qué estás haciendo con las horas restantes?</b>', '⏳')">
        <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.18em; color:var(--fire); margin-bottom:6px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:6px;">
           <span style="font-size:14px; animation: heartbeat 1.5s infinite;">⏳</span> CIERRE DE LÍNEA TEMPORAL
        </div>
        <div id="midnightClock" style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:36px; font-weight:900; color:var(--text-1); letter-spacing:0.05em; text-shadow:0 0 15px rgba(255,107,53,0.5);">
          --:--:--
        </div>
      </div>

      <!-- STREAK CARD -->
      <div class="card card--fire tappable" style="padding:var(--s4);" onclick="showInteractiveModal('Línea Activa (Racha)', 'Son los días ininterrumpidos en los que cumples <b>al menos 1</b> victoria.<br><br><b>🧠 Día Mínimo Viable (Regla 2 min):</b> ¿Tuviste un día terrible? Hacer 1 de tus 5 compromisos salva la racha y mantiene tu inercia. Eso es construir identidad.', '🔥')">
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
        <div class="stat-chip tappable" onclick="showInteractiveModal('Escalera de Rangos de La Orden', 'Tu rango define tu identidad dentro del círculo. <b>Cada día sin reportar deteriora tu ICD</b> y te aleja del siguiente nivel.<br><br><b>🌱 Aspirante</b> — Punto de partida.<br><b>⚔️ Iniciado</b> — Acceso al sistema.<br><b>🛡️ Comprometido</b> — ICD ≥60 · 7 días.<br><b>🔱 Disciplinado</b> — ICD ≥70 · 14 días.<br><b>💎 Consistente</b> — ICD ≥80 · 30 días · 1 contrato.<br><b>🏛️ Arquitecto</b> — ICD ≥85 · 60 días · 2 contratos.<br><b>👁️ Custodio</b> — ICD ≥90 · 90 días · 3 contratos.<br><br>⚠️ Solo el 1% alcanza Custodio. Sin acción diaria, el sistema te retrograda automáticamente.', '${rangoEmoji}')">
          <div class="stat-val stat-val--gold">${rangoEmoji}</div>
          <div class="stat-lbl">${rangoNombre}</div>
          <div class="stat-delta">${user.tendencia || '→'}</div>
        </div>
        <div class="stat-chip tappable" onclick="showInteractiveModal('Escudos de Protección', 'Al cumplir 14 días ininterrumpidos protegiendo la línea ganas 1 Escudo.<br><br>Si fallas un día por completo, el sistema consumirá un escudo automáticamente en lugar de destruir tu racha a cero. Es tu seguro de vida.<br><br>⚠️ <b>Sin escudos, 1 día fallado = racha a cero.</b> Acumúlalos antes de que los necesites.', '🛡️')">
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
              <div class="mission-item tappable ${c.hecho ? 'done' : ''}" onclick="selectMission('${c.id}')">
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
              <div class="mission-item tappable" onclick="selectMission('${c.id}')" style="opacity: 0.8; background: rgba(255,255,255,0.02); border: 1px dashed var(--border);">
                <span class="mission-emoji" style="filter: grayscale(0.5);">${c.emoji}</span>
                <div class="mission-info">
                  <div class="mission-name" style="color: var(--text-2);">${c.nombre}</div>
                  <div class="mission-meta" style="color: var(--gold);">
                    ⚡ Misión Extra (${c.frecuencia === 'FDS' ? 'Fines de semana' : 'Lunes a viernes'})
                  </div>
                </div>
                <span class="mission-check" style="color: var(--text-3);">⟩</span>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top:20px;">
            <button onclick="navigateTo('add_habit')" class="tappable" 
              style="width:100%; padding:14px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; background:rgba(212,168,67,0.08); border:1px solid rgba(212,168,67,0.3); color:var(--gold); font-family:var(--font-head); font-weight:800; text-transform:uppercase; letter-spacing:0.08em; transition:all 0.2sease;">
              <span>➕ Forjar Nuevo Pilar</span>
            </button>
          </div>
        </div>

        ${todoCompleto ? `
          <div class="card stagger-up stagger-5" style="text-align:center; border-color:var(--border-gold);
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

let midnightTimerInterval = null;
function updateMidnightClock() {
  const el = document.getElementById('midnightClock');
  if (!el) return;
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;

  function pad(n) { return n.toString().padStart(2, '0'); }
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  
  el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
  
  // Agregar keyframe si no existe
  if (!document.getElementById('heartbeat-css')) {
     const st = document.createElement('style');
     st.id = 'heartbeat-css';
     st.innerHTML = `@keyframes heartbeat { 0% { transform: scale(1); } 14% { transform: scale(1.2); } 28% { transform: scale(1); } 42% { transform: scale(1.2); } 70% { transform: scale(1); } }`;
     document.head.appendChild(st);
  }
}

function initHomeAnimations() {
  // Arrancar Midnight Clock
  updateMidnightClock();
  if (midnightTimerInterval) clearInterval(midnightTimerInterval);
  midnightTimerInterval = setInterval(updateMidnightClock, 1000);

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
