/**
 * 🏛️ LA ORDEN — views/stats.js  v8
 * Panel de Inteligencia Operacional — Rediseño Premium
 *
 * Orden de secciones:
 *  1. KPI Command Bar   — ICD, Racha, PC, Días
 *  2. Heatmap 28 días   — con filtro por compromiso
 *  3. Barras semanales  — PREMIUM con líneas de referencia
 *  4. Inteligencia de Racha — análisis científico
 *  5. Panel ICD — Zonas y Proyección
 *  6. Contrato Activo (si existe)
 *  7. Misiones de Hoy — al final como contexto operativo
 */

let currentStatsFilter = 'GLOBAL';

function renderStats(data) {
  const { user, compromisos, historial, semana } = data;

  const icd         = Number(user.icd)         || 0;
  const lineaActiva = Number(user.lineaActiva)  || 0;
  const pcTotal     = Number(user.pcTotal)      || 0;
  const diasActivos = Number(user.diasActivos)  || 0;
  const escudos     = Number(user.escudos)      || 0;
  const tendencia   = user.tendencia            || '→';

  if (currentStatsFilter !== 'GLOBAL' && !(compromisos || []).find(c => c.id === currentStatsFilter)) {
    currentStatsFilter = 'GLOBAL';
  }

  // ── Datos del heatmap
  const histList = historial ? (historial[currentStatsFilter] || historial.GLOBAL || []) : [];
  const heatArr  = histList.length === 28 ? histList : Array(28).fill(0);
  const days     = ['D','L','M','M','J','V','S'];

  // ── Datos semanales
  const semList   = semana ? (semana[currentStatsFilter] || semana.GLOBAL || []) : [];
  const semanaArr = semList.length === 7 ? semList : Array(7).fill(0);
  const diasLabels = ['L','M','M','J','V','S','D'];
  const maxSem    = Math.max(...semanaArr.filter(v => v > 0), 1);

  // ── Zona ICD
  const icdZona  = icd >= 85 ? { label:'Zona Elite 🎯',    color:'var(--gold)',     bg:'rgba(212,168,67,0.08)' }
                 : icd >= 70 ? { label:'Zona Solida ⚡',   color:'var(--electric)', bg:'rgba(123,97,255,0.08)' }
                 : icd >= 50 ? { label:'En Progreso 🛠',   color:'var(--text-2)',   bg:'rgba(255,255,255,0.04)' }
                 :              { label:'En Construccion',  color:'#EF4444',         bg:'rgba(239,68,68,0.06)'  };

  // ── Gauge SVG ICD
  const R = 60, C = 2 * Math.PI * R;
  const filled = C * (icd / 100);
  const gap    = C - filled;

  // ── Compromisos con datos de hoy (valor real vs meta)
  const compromisosList = compromisos || [];
  const activos   = compromisosList.filter(c => c.aplicaHoy !== false);
  const inactivos = compromisosList.filter(c => c.aplicaHoy === false);
  const hechos    = activos.filter(c => c.hecho);
  const pctDia    = activos.length > 0 ? Math.round((hechos.length / activos.length) * 100) : 0;

  // ── Proximo hito de racha
  const hitosRacha    = [7, 14, 21, 30, 60, 90, 180, 365];
  const nextHito      = hitosRacha.find(h => h > lineaActiva) || 365;
  const prevHito      = hitosRacha.filter(h => h <= lineaActiva).pop() || 0;
  const rachaPct      = prevHito === nextHito ? 100 : Math.round(((lineaActiva - prevHito) / (nextHito - prevHito)) * 100);

  // ── Dias restantes para cierre del contrato (si hay)
  const contrato = data.contrato;
  const diasRestantes = contrato ? (contrato.diasRestantes || 0) : null;

  // ── Proyeccion ICD a 7 dias — si el usuario mantiene su tendencia actual
  const diasSinReporte28 = heatArr.filter(v => v === 0).length;
  const diasConReporte28 = 28 - diasSinReporte28;
  const icdProyectado    = diasConReporte28 >= 7
    ? Math.min(100, Math.round(icd + (tendencia === '↑' ? 3 : tendencia === '↓' ? -3 : 0)))
    : null;

  // ── Filtro selector
  const filterHtml = `
    <select id="statsFilterSelect" onchange="changeStatsFilter(this.value)"
      style="width:100%; padding:11px 14px; background:var(--bg-overlay);
             border:1px solid var(--border); border-radius:var(--r-md);
             color:var(--text-1); font-family:var(--font-head); font-size:13px;
             font-weight:600; outline:none; cursor:pointer; margin-bottom:14px;">
      <option value="GLOBAL" ${currentStatsFilter === 'GLOBAL' ? 'selected' : ''}>🌍 Todas las misiones (Global)</option>
      ${compromisosList.map(c => `
        <option value="${c.id}" ${currentStatsFilter === c.id ? 'selected' : ''}>${c.emoji} ${c.nombre}</option>
      `).join('')}
    </select>
  `;

  // ── Promedio semanal calculado
  const promedioSem = semanaArr.length > 0 ? Math.round(semanaArr.reduce((a,b) => a+b, 0) / semanaArr.length) : 0;

  return `
    <div class="view" id="view-stats" style="padding-bottom: 32px;">

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 1. KPI COMMAND BAR                                   -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="stagger-up stagger-1" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">

        <!-- ICD -->
        <div class="tappable ${icd >= 85 ? 'breathe-gold' : icd < 50 ? 'breathe-danger' : ''}" 
          onclick="showInteractiveModal('Indice de Consistencia Disciplinada','El ICD mide tu confiabilidad matematica en los ultimos 28 dias. 100 es perfeccion absoluta. Cada dia sin reportar lo reduce exponencialmente.','🎯')"
          style="background:${icdZona.bg}; border:1px solid ${icdZona.color}40;
            border-radius:var(--r-lg); padding:16px 14px; position:relative; overflow:hidden;">
          <div style="font-size:10px; letter-spacing:0.15em; color:${icdZona.color}; text-transform:uppercase; font-weight:700; margin-bottom:6px;">ICD</div>
          <div style="font-family:var(--font-head); font-size:34px; font-weight:900; color:var(--text-1); line-height:1;">${icd}</div>
          <div style="font-size:11px; color:${icdZona.color}; margin-top:4px; font-weight:600;">${icdZona.label}</div>
          <div style="position:absolute; top:10px; right:12px; font-size:18px; opacity:0.6;">${tendencia === '↑' ? '📈' : tendencia === '↓' ? '📉' : '➡️'}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:6px;">Tendencia: <strong style="color:${tendencia==='↑'?'var(--success)':tendencia==='↓'?'#EF4444':'var(--text-2)'}">${tendencia}</strong></div>
        </div>

        <!-- RACHA -->
        <div class="tappable" onclick="showInteractiveModal('Linea Activa','Dias consecutivos cumpliendo al menos 1 compromiso. La racha es el arma mas poderosa de la disciplina. No la rompas.','🔥')"
          style="background:rgba(255,107,53,0.06); border:1px solid rgba(255,107,53,0.25);
            border-radius:var(--r-lg); padding:16px 14px; position:relative; overflow:hidden;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--fire); text-transform:uppercase; font-weight:700; margin-bottom:6px;">RACHA</div>
          <div style="font-family:var(--font-head); font-size:34px; font-weight:900; color:var(--text-1); line-height:1;">${lineaActiva}<span style="font-size:18px;margin-left:2px;">🔥</span></div>
          <div style="font-size:11px; color:var(--fire); margin-top:4px; font-weight:600;">dias consecutivos</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:6px;">Proximo hito: <strong style="color:var(--text-1)">${nextHito}d</strong></div>
        </div>

        <!-- PC TOTALES -->
        <div class="tappable" onclick="showInteractiveModal('Puntos de Poder (PC)','Moneda del sistema. Se acumulan por cada victoria registrada. +20 PC bonus si superas el 150% de tu meta.','⚡')"
          style="background:rgba(212,168,67,0.06); border:1px solid rgba(212,168,67,0.25);
            border-radius:var(--r-lg); padding:16px 14px;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; font-weight:700; margin-bottom:6px;">PC TOTALES</div>
          <div style="font-family:var(--font-head); font-size:28px; font-weight:900; color:var(--gold); line-height:1;">${pcTotal.toLocaleString('es-CO')}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:8px;">puntos de poder</div>
        </div>

        <!-- DIAS ACTIVOS -->
        <div class="tappable" onclick="showInteractiveModal('Dias Activos','Total historico de dias en los que has honrado el pacto. No se reinicia con la racha. Es tu huella permanente.','📅')"
          style="background:rgba(123,97,255,0.06); border:1px solid rgba(123,97,255,0.25);
            border-radius:var(--r-lg); padding:16px 14px;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--electric); text-transform:uppercase; font-weight:700; margin-bottom:6px;">DIAS ACTIVOS</div>
          <div style="font-family:var(--font-head); font-size:28px; font-weight:900; color:var(--electric); line-height:1;">${diasActivos}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:8px;">dias en total</div>
        </div>

      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 2. HEATMAP 28 DIAS                                   -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-2" style="margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div class="section-title" style="margin:0;">Historial 28 dias</div>
          <div style="font-size:11px; color:var(--text-3);">${diasConReporte28} dias con reporte</div>
        </div>
        ${filterHtml}
        <div class="heatmap-labels">
          ${days.map(d => `<div class="heatmap-day-label">${d}</div>`).join('')}
        </div>
        <div class="heatmap">
          ${heatArr.map((level, i) => `<div class="heatmap-day tappable" data-level="${level}" onclick="showHeatmapTooltip(this, ${level})"></div>`).join('')}
        </div>
        <div style="display:flex; gap:6px; margin-top:10px; align-items:center; justify-content:flex-end;">
          <span style="font-size:10px; color:var(--text-3);">Menos</span>
          ${[0,1,2,3,4].map(l => `<div style="width:11px;height:11px;border-radius:2px;" class="heatmap-day" data-level="${l}"></div>`).join('')}
          <span style="font-size:10px; color:var(--text-3);">Mas</span>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 3. GRAFICA SEMANAL PREMIUM                           -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-3" style="margin-bottom:10px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <div class="section-title" style="margin:0;">Rendimiento Semanal</div>
            <div style="font-size:11px; color:var(--text-3); margin-top:3px;">Ejecucion de los ultimos 7 dias</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-head); font-size:26px; font-weight:900; color:${promedioSem>=85?'var(--success)':promedioSem>=50?'var(--gold)':'var(--text-2)'}; line-height:1;">${promedioSem}%</div>
            <div style="font-size:10px; color:var(--text-3); margin-top:2px;">Promedio</div>
          </div>
        </div>
        <div style="display:flex; align-items:flex-end; gap:8px; height:150px; padding:0 2px; position:relative;">
          <!-- Lineas de referencia -->
          <div style="position:absolute; inset:0; pointer-events:none; padding-bottom:24px;">
            ${[25,50,75,100].map(ref => `
              <div style="position:absolute; left:0; right:0;
                bottom:${Math.round((ref/100)*120)+4}px;
                display:flex; align-items:center; justify-content:flex-end;">
                <span style="font-size:8px; color:rgba(255,255,255,0.15); padding-right:2px;">${ref}%</span>
                <div style="flex:1; height:1px; background:rgba(255,255,255,0.06);"></div>
              </div>
            `).join('')}
          </div>
          ${semanaArr.map((pct, i) => {
            const esHoy  = i === semanaArr.length - 1;
            const h      = pct > 0 ? Math.max(14, Math.round((pct / maxSem) * 120)) : 6;
            const color  = esHoy
              ? 'linear-gradient(180deg,#FFD700,#B8860B)'
              : pct >= 85 ? 'linear-gradient(180deg,#22C55E,rgba(34,197,94,0.5))'
              : pct >= 50 ? 'linear-gradient(180deg,#7B61FF,rgba(123,97,255,0.4))'
              : pct >  0  ? 'linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))'
              :              'rgba(255,255,255,0.04)';
            const shadow = esHoy
              ? '0 -6px 20px rgba(212,168,67,0.6)'
              : pct >= 85 ? '0 -4px 12px rgba(34,197,94,0.35)'
              : pct >= 50 ? '0 -4px 8px rgba(123,97,255,0.25)'
              : 'none';
            return `
              <div class="tappable" onclick="showChartTooltip(this, ${pct}, '${diasLabels[i]}')" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; z-index:1; padding-top:10px;">
                ${pct > 0
                  ? `<div style="font-size:10px; font-weight:800; color:${esHoy?'#FFD700':pct>=85?'var(--success)':'var(--text-3)'}; letter-spacing:-0.02em;">${pct}%</div>`
                  : `<div style="font-size:10px; color:var(--text-3);">-</div>`}
                <div style="width:100%; border-radius:7px 7px 3px 3px;
                  background:${color};
                  box-shadow:${shadow};
                  height:0px; transition:height 1.2s cubic-bezier(0.34,1.1,0.64,1) ${i*0.1}s;
                  position:relative;"
                  id="bar-${i}" data-h="${h}px">
                  ${esHoy ? `<div style="position:absolute;top:-5px;left:50%;transform:translateX(-50%);
                    width:7px;height:7px;border-radius:50%;background:#FFD700;
                    box-shadow:0 0 8px rgba(212,168,67,0.9);"></div>` : ''}
                </div>
                <div style="font-size:10px; color:${esHoy?'#FFD700':'var(--text-3)'}; font-weight:${esHoy?'800':'400'};">${diasLabels[i]}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 4. INTELIGENCIA DE RACHA + ICD                       -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-4" style="margin-bottom:10px;">
        <div class="section-title" style="margin-bottom:14px;">🔥 Analisis de Racha</div>

        <!-- Barra de progreso hacia proximo hito -->
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-3); margin-bottom:6px;">
          <span>Racha actual: <strong style="color:var(--fire);">${lineaActiva}d</strong></span>
          <span>Hito: <strong style="color:var(--text-1);">${nextHito}d</strong></span>
        </div>
        <div style="background:var(--bg-elevated); border-radius:99px; height:6px; overflow:hidden; margin-bottom:14px;">
          <div style="height:6px; border-radius:99px; width:${rachaPct}%;
            background:linear-gradient(90deg,rgba(255,107,53,0.5),var(--fire));
            transition:width 1s ease; box-shadow:0 0 8px rgba(255,107,53,0.3);"></div>
        </div>

        <!-- Grid de hitos -->
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:14px;">
          ${[7,14,30,90].map(hito => {
            const alcanzado = lineaActiva >= hito;
            return `
              <div style="text-align:center; padding:8px 4px; border-radius:var(--r-md);
                background:${alcanzado?'rgba(212,168,67,0.1)':'var(--bg-elevated)'};
                border:1px solid ${alcanzado?'var(--border-gold)':'var(--border)'};">
                <div style="font-size:14px;">${alcanzado?'🏆':'🔒'}</div>
                <div style="font-size:11px; font-weight:700; color:${alcanzado?'var(--gold)':'var(--text-3)'};">${hito}d</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Escudos disponibles -->
        <div style="display:flex; align-items:center; gap:8px; padding:10px 12px;
          background:rgba(123,97,255,0.06); border:1px solid rgba(123,97,255,0.2);
          border-radius:var(--r-md);">
          <span style="font-size:20px;">🛡️</span>
          <div style="flex:1;">
            <div style="font-size:12px; font-weight:700; color:var(--electric);">${escudos} Escudo${escudos !== 1 ? 's' : ''} disponible${escudos !== 1 ? 's' : ''}</div>
            <div style="font-size:10px; color:var(--text-3); margin-top:2px;">Protegen tu racha si fallas 1 dia completo. Se ganan cada 14 dias.</div>
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 5. PANEL ICD — Zonas y Proyeccion                    -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-4" style="border-color:${icdZona.color}40; background:${icdZona.bg}; margin-bottom:10px;">
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">

          <!-- Mini Gauge ICD -->
          <svg viewBox="0 0 140 140" style="width:80px; height:80px; flex-shrink:0;">
            <defs>
              <linearGradient id="statsGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#7B61FF"/>
                <stop offset="50%"  stop-color="#D4A843"/>
                <stop offset="100%" stop-color="#FF6B35"/>
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r="${R}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
            <circle cx="70" cy="70" r="${R}" fill="none"
              stroke="url(#statsGaugeGrad)" stroke-width="8"
              stroke-linecap="round"
              stroke-dasharray="${filled} ${gap}"
              transform="rotate(-90 70 70)"
              id="statsIcdArc"
              style="stroke-dasharray:0 ${C}; transition:stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1);"
              data-filled="${filled}" data-gap="${gap}"/>
            <text x="70" y="66" text-anchor="middle" dominant-baseline="middle"
              font-family="Outfit,sans-serif" font-size="22" font-weight="900" fill="#F5F5F5">${icd}</text>
            <text x="70" y="82" text-anchor="middle" dominant-baseline="middle"
              font-family="Inter,sans-serif" font-size="9" fill="#5A5A72">ICD</text>
          </svg>

          <div style="flex:1;">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-3); margin-bottom:4px;">Tu posicion</div>
            <div style="font-family:var(--font-head); font-size:17px; font-weight:800; color:${icdZona.color}; margin-bottom:6px;">${icdZona.label}</div>
            ${icdProyectado !== null ? `
              <div style="font-size:11px; color:var(--text-3);">
                Proyeccion 7d: <strong style="color:${icdProyectado>icd?'var(--success)':icdProyectado<icd?'#EF4444':'var(--text-1)'}">${icdProyectado} ICD</strong>
                ${icdProyectado > icd ? ' ↑' : icdProyectado < icd ? ' ↓' : ' →'}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Escala de zonas -->
        ${[
          { min:85, label:'Zona Elite 🎯',      color:'var(--gold)',     desc:'Top 1% global. Consistencia extrema.' },
          { min:70, label:'Zona Solida ⚡',      color:'var(--electric)', desc:'Base solida. Un empuje mas.' },
          { min:50, label:'En Progreso 🛠',      color:'var(--text-2)',   desc:'Construyendo el habito.' },
          { min:0,  label:'En Construccion 🧱',  color:'#EF4444',         desc:'Requiere atencion urgente.' },
        ].map(z => {
          const esActual = icd >= z.min && (z.min === ([85,70,50,0].find(m => icd >= m)));
          return `
            <div style="display:flex; align-items:center; gap:10px; padding:8px 10px;
              border-radius:var(--r-md); margin-bottom:4px;
              background:${esActual ? z.color + '15' : 'transparent'};
              border:1px solid ${esActual ? z.color + '40' : 'transparent'};
              opacity:${icd >= z.min ? 1 : 0.35};">
              <div style="width:8px; height:8px; border-radius:50%; background:${z.color}; flex-shrink:0;"></div>
              <div style="flex:1;">
                <div style="font-size:12px; font-weight:700; color:${esActual ? z.color : 'var(--text-2)'};">${z.label}</div>
                <div style="font-size:10px; color:var(--text-3);">${z.desc}</div>
              </div>
              ${esActual ? `<span style="font-size:11px; color:${z.color}; font-weight:700;">← Tu</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 6. CONTRATO ACTIVO (si existe)                       -->
      <!-- ════════════════════════════════════════════════════ -->
      ${contrato ? (() => {
        const globalHist = historial ? (historial.GLOBAL || []) : [];
        const diasConReporteContrato = globalHist.filter(n => n > 0).length;
        const progresoReal = diasConReporteContrato > 0
          ? Math.min(100, Math.round((diasConReporteContrato / contrato.diasTotales) * 100))
          : 0;
        return `
        <div class="card stagger-up stagger-5" style="margin-bottom:10px;">
          <div class="section-title" style="margin-bottom:12px;">📜 Contrato Activo</div>
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="text-align:center; flex-shrink:0;">
              <div style="font-family:var(--font-head); font-size:32px; font-weight:900;
                color:${diasRestantes <= 5 ? 'var(--fire)' : 'var(--text-1)'};">${diasRestantes}</div>
              <div style="font-size:10px; color:var(--text-3);">${diasRestantes <= 5 ? '⚠️ dias para cierre' : 'dias restantes'}</div>
            </div>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-3); margin-bottom:4px;">
                <span>Contrato #${contrato.numero}</span>
                <span>${contrato.diasTotales} dias totales</span>
              </div>
              <div style="background:var(--bg-elevated); border-radius:99px; height:5px; overflow:hidden;">
                <div style="height:5px; border-radius:99px; width:${progresoReal}%;
                  background:${diasRestantes <= 5 ? 'var(--fire)' : 'linear-gradient(90deg,var(--gold-dim),var(--gold))'};
                  transition:width 1s ease;"></div>
              </div>
              <div style="font-size:10px; color:var(--text-3); margin-top:4px; text-align:right;">
                ${diasConReporteContrato > 0 ? progresoReal + '% · ' + diasConReporteContrato + ' dias con reporte' : 'Sin reportes aun — progreso en 0%'}
              </div>
            </div>
          </div>
        </div>
        `;
      })() : ''}

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 7. MISIONES DE HOY — al final como contexto          -->
      <!-- ════════════════════════════════════════════════════ -->
      ${compromisosList.length > 0 ? `
        <div class="card stagger-up stagger-5" style="margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <div class="section-title" style="margin:0;">Misiones de Hoy</div>
              <div style="font-size:10px; color:var(--text-3); margin-top:2px;">Progreso real del dia</div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <div style="font-size:11px; color:var(--text-3);">${hechos.length}/${activos.length}</div>
              <div style="padding:4px 12px; border-radius:99px; font-size:12px; font-weight:800;
                background:${pctDia>=100?'rgba(34,197,94,0.15)':pctDia>0?'rgba(212,168,67,0.15)':'rgba(255,255,255,0.05)'};
                color:${pctDia>=100?'var(--success)':pctDia>0?'var(--gold)':'var(--text-3)'};">
                ${pctDia}%
              </div>
            </div>
          </div>
          <div style="background:var(--bg-elevated); border-radius:99px; height:5px; margin-bottom:16px; overflow:hidden;">
            <div style="height:5px; border-radius:99px; width:${pctDia}%;
              background:${pctDia>=100?'linear-gradient(90deg,var(--success),#4ADE80)':'linear-gradient(90deg,var(--gold-dim),var(--gold))'};
              transition:width 1s ease;"></div>
          </div>
          ${activos.map(c => {
            const pctC = c.meta > 0 ? Math.min(200, Math.round((c.valorHoy / c.meta) * 100)) : 0;
            const critico = pctC > 100;
            const valorFmt = Number(c.valorHoy || 0).toLocaleString('es-CO');
            const metaFmt  = Number(c.meta || 0).toLocaleString('es-CO');
            return `
              <div class="tappable" style="display:flex; align-items:center; gap:10px; padding:12px 0;
                border-bottom:1px solid var(--border);" onclick="selectMission('${c.id}')">
                <div style="font-size:26px; flex-shrink:0;">${c.emoji}</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13px; font-weight:700; color:var(--text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.nombre}</div>
                  <div style="font-size:11px; color:var(--text-3); margin-top:2px;">
                    ${c.hecho
                      ? `<span style="color:${critico?'var(--fire)':'var(--success)'}; font-weight:700;">${valorFmt} ${c.unidad}</span> de ${metaFmt} ${c.unidad} — <strong style="color:${critico?'var(--fire)':'var(--success)'};">${pctC}%${critico?' 🔥':''}</strong>`
                      : `Meta: <strong>${metaFmt} ${c.unidad}</strong>`
                    }
                  </div>
                  ${c.hecho ? `
                    <div style="margin-top:6px; background:var(--bg-elevated); border-radius:99px; height:4px; overflow:hidden;">
                      <div style="height:4px; border-radius:99px; width:${Math.min(100,pctC)}%;
                        background:${critico?'linear-gradient(90deg,var(--fire-dim),var(--fire))':'linear-gradient(90deg,var(--gold-dim),var(--gold))'};">
                      </div>
                    </div>` : ''}
                </div>
                <div style="text-align:right; flex-shrink:0;">
                  ${c.hecho
                    ? `<div style="font-size:18px;">✅</div>`
                    : `<div style="font-size:14px; color:var(--text-3);">⟩</div>`
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

    </div>
  `;
}

function initStatsAnimations() {
  // Animar barras semanales
  setTimeout(() => {
    document.querySelectorAll('[id^="bar-"]').forEach(el => {
      el.style.height = el.dataset.h;
    });
  }, 50);

  // Animar gauge ICD
  setTimeout(() => {
    const arc = document.getElementById('statsIcdArc');
    if (arc) {
      arc.style.strokeDasharray = `${arc.dataset.filled} ${arc.dataset.gap}`;
    }
  }, 200);
}

function changeStatsFilter(val) {
  currentStatsFilter = val;
  const data = window._appData;
  if (data) {
    appData = data;
    // Transición suave: fade out, render, fade in
    const container = document.getElementById('viewContainer');
    container.style.opacity = '0.5';
    container.style.transition = 'opacity 0.2s';
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
    setTimeout(() => {
      container.innerHTML = renderStats(data);
      container.style.opacity = '1';
      initStatsAnimations();
    }, 150);
  }
}

// Interacciones flotantes (tooltips)
function _createTooltip(element, text) {
  const existing = document.getElementById('stats-tooltip');
  if (existing) existing.remove();

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }

  const rect = element.getBoundingClientRect();
  const tooltip = document.createElement('div');
  tooltip.id = 'stats-tooltip';
  tooltip.className = 'interactive-tooltip';
  tooltip.innerHTML = text;
  
  document.body.appendChild(tooltip);

  // Posicionar arriba del elemento
  const tRect = tooltip.getBoundingClientRect();
  let top = rect.top - tRect.height - 10;
  let left = rect.left + (rect.width / 2) - (tRect.width / 2);

  // Bounds check
  if (left < 10) left = 10;
  if (left + tRect.width > window.innerWidth - 10) left = window.innerWidth - tRect.width - 10;

  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';

  // Desaparecer después de 2.5s
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 0.3s ease';
      setTimeout(() => tooltip.remove(), 300);
    }
  }, 2500);
}

function showChartTooltip(element, pct, label) {
  let text = '';
  if (pct === 0) text = `<span style="color:var(--text-2);font-weight:600;">Día ${label}: <br/>Inactivo (0%)</span>`;
  else if (pct >= 100) text = `<span style="color:var(--success);font-weight:800;">Día ${label}: <br/>Cumplimiento ${pct}% 🌟</span>`;
  else if (pct >= 85) text = `<span style="color:var(--gold);font-weight:700;">Día ${label}: <br/>Excelente ${pct}%</span>`;
  else text = `<span style="font-weight:600;">Día ${label}: <br/>Progreso ${pct}%</span>`;
  
  _createTooltip(element, text);
}

function showHeatmapTooltip(element, level) {
  const messages = [
    '<span style="color:var(--text-2);">0 Misiones</span>',
    'Avance leve (Nivel 1)',
    'Buen esfuerzo (Nivel 2)',
    '<span style="color:var(--gold);">Día Fuerte (Nivel 3)</span>',
    '<span style="color:var(--electric);font-weight:800;">Día de Poder (Nivel 4)⚡</span>'
  ];
  _createTooltip(element, messages[level]);
}

