/**
 * 🏛️ LA ORDEN — views/stats.js
 * Estadísticas: Heatmap, gráfica semanal, ranking de compromisos REALES
 */

function renderStats(data) {
  const { user, compromisos, historial, semana } = data;

  const icd        = Number(user.icd)        || 0;
  const lineaActiva = Number(user.lineaActiva) || 0;
  const pcTotal    = Number(user.pcTotal)    || 0;
  const diasActivos = Number(user.diasActivos) || 0;

  // ── Heatmap labels (días de la semana)
  const days     = ['D','L','M','M','J','V','S'];
  const heatArr  = (historial && historial.length === 28) ? historial : Array(28).fill(0);

  // ── Barra semanal
  const semanaArr    = (semana && semana.length === 7) ? semana : Array(7).fill(0);
  const diasLabels   = ['L','M','M','J','V','S','D'];
  const maxPct       = Math.max(...semanaArr.filter(v => v > 0), 1);

  // ── Ranking real de compromisos (calculado desde compromisos del usuario)
  // Como el backend no devuelve % histórico por compromiso, usamos los datos disponibles
  // Si hecho=true hoy → 100%, si hecho=false → 0% (día de hoy como proxy)
  const rankData = (compromisos && compromisos.length > 0)
    ? compromisos.map(c => ({
        emoji:  c.emoji,
        nombre: c.nombre,
        pct:    c.hecho ? 100 : (c.valorHoy > 0 ? Math.round((c.valorHoy / c.meta) * 100) : 0),
      })).sort((a, b) => b.pct - a.pct)
    : [];

  // ── Zona ICD
  const zonaInfo = icd >= 85 ? { label: 'Zona Élite',    color:'var(--gold)',    min:85 }
                 : icd >= 70 ? { label: 'Zona Sólida',   color:'var(--electric)', min:70 }
                 : icd >= 50 ? { label: 'En Progreso',   color:'var(--text-2)',   min:50 }
                 :              { label: 'En Construcción', color:'var(--danger)',  min:0  };

  return `
    <div class="view" id="view-stats">

      <!-- KPIs -->
      <div class="stat-row">
        <div class="stat-chip">
          <div class="stat-val stat-val--electric fw-900" style="font-family:var(--font-head);">${icd}</div>
          <div class="stat-lbl">ICD Actual</div>
          <div class="stat-delta">${user.tendencia || '→'}</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val" style="color:var(--fire);font-family:var(--font-head);">${lineaActiva}🔥</div>
          <div class="stat-lbl">Línea Activa</div>
          <div class="stat-delta">${lineaActiva >= 7 ? '🏆 Hito alcanzado' : 'Sigue construyendo'}</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-chip">
          <div class="stat-val stat-val--gold" style="font-family:var(--font-head);">${pcTotal.toLocaleString('es-CO')}</div>
          <div class="stat-lbl">PC Totales</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val" style="font-family:var(--font-head);">${diasActivos}</div>
          <div class="stat-lbl">Días Activos</div>
        </div>
      </div>

      <!-- HEATMAP -->
      <div class="card">
        <div class="section-title" style="margin-bottom:var(--s4);">Mapa de Consistencia</div>
        <div class="heatmap-labels">
          ${days.map(d => `<div class="heatmap-day-label">${d}</div>`).join('')}
        </div>
        <div class="heatmap">
          ${heatArr.map((level, i) => `<div class="heatmap-day" data-level="${level}"></div>`).join('')}
        </div>
        <div class="flex" style="gap:6px;margin-top:12px;align-items:center;">
          <span class="text-xs text-muted">Menos</span>
          ${[0,1,2,3,4].map(l => `<div style="width:12px;height:12px;border-radius:2px;" class="heatmap-day" data-level="${l}"></div>`).join('')}
          <span class="text-xs text-muted">Más</span>
        </div>
      </div>

      <!-- PROGRESO SEMANAL -->
      <div class="card">
        <div class="section-title" style="margin-bottom:var(--s4);">Últimos 7 días</div>
        <div class="bar-chart">
          ${semanaArr.map((pct, i) => {
            const esHoy   = i === semanaArr.length - 1;
            const height  = pct > 0 ? Math.max(6, (pct / maxPct) * 70) : 4;
            const cls     = esHoy ? 'today' : pct >= 85 ? 'good' : '';
            return `
              <div class="bar-col">
                <div class="bar-fill ${cls}" id="bar-${i}"
                  style="height:0px; transition:height 1s cubic-bezier(0.4,0,0.2,1) ${i*0.08}s;"
                  data-h="${height}px"></div>
                <div class="bar-lbl">${diasLabels[i]}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- RANKING POR COMPROMISO (datos reales del usuario) -->
      ${rankData.length > 0 ? `
        <div class="card">
          <div class="section-title" style="margin-bottom:var(--s3);">Tus compromisos hoy</div>
          ${rankData.map(r => `
            <div class="rank-item">
              <span class="rank-emoji">${r.emoji}</span>
              <div class="rank-info">
                <div class="rank-name">${r.nombre}</div>
                <div class="rank-pct">${r.pct}% completado hoy</div>
              </div>
              <div class="rank-bar-wrap">
                <div class="prog-bar-wrap">
                  <div class="prog-bar-fill ${r.pct >= 100 ? 'prog-bar-fill--success' : r.pct > 0 ? '' : ''}"
                    style="width:${Math.min(100, r.pct)}%;
                    background: ${r.pct >= 100 ? 'var(--success)' : r.pct > 0 ? 'var(--gold)' : 'var(--bg-elevated)'}">
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="card">
          <div class="section-title" style="margin-bottom:var(--s3);">Tus compromisos</div>
          <div class="empty-state" style="padding:var(--s8) 0;">
            <div class="empty-icon">⚔️</div>
            <div class="empty-title">Sin compromisos aún</div>
            <div class="empty-sub">Completa el juramento en Telegram para ver tus stats</div>
          </div>
        </div>
      `}

      <!-- ZONA ICD -->
      <div class="card" style="border-color:var(--border-gold);">
        <div class="section-title" style="margin-bottom:var(--s3);">Tu ICD: ${icd}</div>
        ${[
          { min:85, label:'Zona Élite',      color:'var(--gold)',    desc:'Top 1% de consistencia.' },
          { min:70, label:'Zona Sólida',     color:'var(--electric)', desc:'Sólido. Un empuje más.' },
          { min:50, label:'En Progreso',     color:'var(--text-2)',   desc:'Construyendo el hábito.' },
          { min:0,  label:'En Construcción', color:'var(--danger)',   desc:'Necesita atención.' },
        ].map(z => {
          const es = icd >= z.min && (z.min === ([85,70,50,0].find(m => icd >= m)));
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);opacity:${icd >= z.min ? 1 : 0.35};">
              <div style="width:8px;height:8px;border-radius:50%;background:${z.color};flex-shrink:0;"></div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;color:${icd >= z.min ? 'var(--text-1)':'var(--text-3)'};">${z.label}</div>
                <div style="font-size:11px;color:var(--text-3);">${z.desc}</div>
              </div>
              ${es ? '<span style="font-size:12px;color:var(--gold);">← Tú</span>' : ''}
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function initStatsAnimations() {
  setTimeout(() => {
    document.querySelectorAll('[id^="bar-"]').forEach(el => {
      el.style.height = el.dataset.h;
    });
  }, 200);
}
