/**
 * 🏛️ LA ORDEN — views/stats.js
 * Estadísticas: Heatmap, gráfica semanal, ranking de compromisos
 */

function renderStats(data) {
  const { user, compromisos, historial, semana } = data;

  // Heatmap — últimos 28 días
  const days = ['D','L','M','M','J','V','S'];
  const today = new Date();
  const startDay = today.getDay(); // 0=dom

  // Ranking de compromisos (simulado)
  const rankData = [
    { emoji:'🏃', nombre:'Ejercicio', pct: 92, color: 'success' },
    { emoji:'📚', nombre:'Lectura',   pct: 88, color: 'electric' },
    { emoji:'💰', nombre:'Ahorro',    pct: 80, color: 'gold' },
    { emoji:'🧠', nombre:'Meditación',pct: 75, color: 'electric' },
    { emoji:'⚡', nombre:'Deep Work', pct: 95, color: 'fire' },
  ].sort((a,b) => b.pct - a.pct);

  // Días labels para el heatmap (últimas 4 semanas)
  const heatDays = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    heatDays.push({ date: d, level: historial[27 - i] || 0 });
  }

  // Barra semanal
  const diasLabels = ['L','M','M','J','V','S','D'];
  const maxPct = Math.max(...semana.filter(v => v > 0), 1);

  return `
    <div class="view" id="view-stats">

      <!-- KPIs -->
      <div class="stat-row">
        <div class="stat-chip">
          <div class="stat-val stat-val--electric fw-900" style="font-family:var(--font-head);">${user.icd}</div>
          <div class="stat-lbl">ICD Actual</div>
          <div class="stat-delta">↑ ${user.tendencia}</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val" style="color:var(--fire); font-family:var(--font-head);">${user.lineaActiva}🔥</div>
          <div class="stat-lbl">Línea Activa</div>
          <div class="stat-delta">Récord personal</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-chip">
          <div class="stat-val stat-val--gold" style="font-family:var(--font-head);">${user.pcTotal.toLocaleString('es-CO')}</div>
          <div class="stat-lbl">PC Totales</div>
        </div>
        <div class="stat-chip">
          <div class="stat-val" style="font-family:var(--font-head);">${user.diasActivos}</div>
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
          ${heatDays.map(d => `
            <div class="heatmap-day" data-level="${d.level}"
              title="${d.date.toLocaleDateString('es-CO', { day:'numeric', month:'short' })}">
            </div>
          `).join('')}
        </div>
        <div class="flex" style="gap:6px; margin-top:12px; align-items:center;">
          <span class="text-xs text-muted">Menos</span>
          ${[0,1,2,3,4].map(l => `<div style="width:12px;height:12px;border-radius:2px;" class="heatmap-day" data-level="${l}"></div>`).join('')}
          <span class="text-xs text-muted">Más</span>
        </div>
      </div>

      <!-- PROGRESO SEMANAL -->
      <div class="card">
        <div class="section-title" style="margin-bottom:var(--s4);">Últimos 7 días</div>
        <div class="bar-chart" id="barChart">
          ${semana.map((pct, i) => {
            const esHoy = i === semana.length - 1;
            const height = pct > 0 ? Math.max(8, (pct / maxPct) * 70) : 4;
            const cls = esHoy ? 'today' : pct >= 85 ? 'good' : '';
            return `
              <div class="bar-col">
                <div class="bar-fill ${cls}" id="bar-${i}" style="height:0px; transition:height 1s cubic-bezier(0.4,0,0.2,1) ${i*0.08}s;"
                  data-h="${height}px"></div>
                <div class="bar-lbl">${diasLabels[i]}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- RANKING POR COMPROMISO -->
      <div class="card">
        <div class="section-title" style="margin-bottom:var(--s3);">Tus compromisos</div>
        ${rankData.map(r => `
          <div class="rank-item">
            <span class="rank-emoji">${r.emoji}</span>
            <div class="rank-info">
              <div class="rank-name">${r.nombre}</div>
              <div class="rank-pct">${r.pct}% de cumplimiento</div>
            </div>
            <div class="rank-bar-wrap">
              <div class="prog-bar-wrap">
                <div class="prog-bar-fill prog-bar-fill--${r.color === 'gold' ? 'gold' : r.color === 'success' ? 'success' : ''}"
                  style="width:${r.pct}%; background: var(--${r.color});">
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- ZONA ICD EXPLICADA -->
      <div class="card" style="border-color:var(--border-gold);">
        <div class="section-title" style="margin-bottom:var(--s3);">Tu ICD: ${user.icd}</div>
        ${[
          { min:85, label:'Zona Élite', color:'var(--gold)',    desc:'Estás entre el 1% de consistencia.' },
          { min:70, label:'Zona Sólida', color:'var(--electric)', desc:'Sólido. Un empuje más hacia élite.' },
          { min:50, label:'En Progreso', color:'var(--text-2)',   desc:'Construyendo el hábito.' },
          { min:0,  label:'Zona Crítica', color:'var(--danger)',  desc:'Necesita atención urgente.' },
        ].map(z => {
          const active = user.icd >= z.min;
          return `
            <div style="display:flex; align-items:center; gap:10px; padding: 8px 0; border-bottom:1px solid var(--border); opacity:${active ? 1 : 0.35};">
              <div style="width:8px; height:8px; border-radius:50%; background:${z.color}; flex-shrink:0;"></div>
              <div style="flex:1;">
                <div style="font-size:13px; font-weight:600; color:${active ? 'var(--text-1)' : 'var(--text-3)'};">${z.label}</div>
                <div style="font-size:11px; color:var(--text-3);">${z.desc}</div>
              </div>
              ${user.icd >= z.min && (z.min === [85,70,50,0].find(m => user.icd >= m)) ? '<span style="font-size:12px; color:var(--gold);">← Tú</span>' : ''}
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

function initStatsAnimations() {
  // Animar barras del chart
  setTimeout(() => {
    document.querySelectorAll('[id^="bar-"]').forEach(el => {
      el.style.height = el.dataset.h;
    });
  }, 200);
}
