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

  // Helpers de compatibilidad por si el backend sigue enviando números planos
  const getHeatData = (item) => typeof item === 'object' ? item : { nivel: item || 0, count:0, total:0, valor:0 };
  const getSemData  = (item) => typeof item === 'object' ? item : { pct: item || 0, count:0, total:0, valor:0 };

  const histList = historial ? (historial[currentStatsFilter] || historial.GLOBAL || []) : [];
  const heatArr  = histList.length === 28 ? histList : Array(28).fill(0);

  const semList   = semana ? (semana[currentStatsFilter] || semana.GLOBAL || []) : [];
  const semanaArr = semList.length === 7 ? semList : Array(7).fill(0);

  // Días dinámicos (termina hoy)
  const diasLabels = [];
  const nombresDias = ['D','L','M','M','J','V','S'];
  const diaHoy = new Date().getDay();
  for (let i = 6; i >= 0; i--) {
    diasLabels.push(nombresDias[(diaHoy - i + 7) % 7]);
  }

  const maxSem = Math.max(...semanaArr.map(v => getSemData(v).pct).filter(p => p > 0), 1);


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

  // ── Proyeccion ICD a 7 dias
  const diasSinReporte28 = heatArr.filter(v => getHeatData(v).nivel === 0).length;
  const diasConReporte28 = 28 - diasSinReporte28;
  const icdProyectado    = diasConReporte28 >= 7
    ? Math.min(100, Math.round(icd + (tendencia === '↑' ? 3 : tendencia === '↓' ? -3 : 0)))
    : null;

  // ── Cálculo de Volumen Semanal y Mensual (Nuevo Request)
  let volSemana = 0; let volMes = 0;
  const isGlobal = currentStatsFilter === 'GLOBAL';
  let unidadFiltro = 'Misiones';

  if (!isGlobal) {
    const compActivo = compromisosList.find(c => c.id === currentStatsFilter);
    if (compActivo) unidadFiltro = compActivo.unidad || 'reps';
  }

  heatArr.forEach((item, idx) => {
    const d = getHeatData(item);
    const val = isGlobal ? (d.count || 0) : (d.valor || 0);
    volMes += val;
    if (idx >= 21) volSemana += val; // Últimos 7 días
  });


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
  const promedioSem = semanaArr.length > 0 ? Math.round(semanaArr.reduce((a,b) => a + getSemData(b).pct, 0) / semanaArr.length) : 0;


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
          <div style="font-family:var(--font-head); font-size:32px; font-weight:900; color:var(--text-1); line-height:1; letter-spacing:-0.02em;">${icd}</div>
          <div style="font-size:11px; color:${icdZona.color}; margin-top:4px; font-weight:600;">${icdZona.label}</div>
          <div style="position:absolute; top:10px; right:12px; font-size:18px; opacity:0.6;">${tendencia === '↑' ? '📈' : tendencia === '↓' ? '📉' : '➡️'}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:6px;">Tendencia: <strong style="color:${tendencia==='↑'?'var(--success)':tendencia==='↓'?'#EF4444':'var(--text-2)'}">${tendencia}</strong></div>
        </div>

        <!-- RACHA -->
        <div class="tappable" onclick="showInteractiveModal('Linea Activa','Dias consecutivos cumpliendo al menos 1 compromiso. La racha es el arma mas poderosa de la disciplina. No la rompas.','🔥')"
          style="background:rgba(255,107,53,0.06); border:1px solid rgba(255,107,53,0.25);
            border-radius:var(--r-lg); padding:16px 14px; position:relative; overflow:hidden;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--fire); text-transform:uppercase; font-weight:700; margin-bottom:6px;">RACHA</div>
          <div style="font-family:var(--font-head); font-size:32px; font-weight:900; color:var(--text-1); line-height:1; letter-spacing:-0.02em;">${lineaActiva}<span style="font-size:16px;margin-left:4px;">🔥</span></div>
          <div style="font-size:11px; color:var(--fire); margin-top:4px; font-weight:600;">dias consecutivos</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:6px;">Proximo hito: <strong style="color:var(--text-1)">${nextHito}d</strong></div>
        </div>

        <!-- PC TOTALES -->
        <div class="tappable" onclick="showInteractiveModal('Puntos de Poder (PC)','Moneda del sistema. Se acumulan por cada victoria registrada. +20 PC bonus si superas el 150% de tu meta.','⚡')"
          style="background:rgba(212,168,67,0.06); border:1px solid rgba(212,168,67,0.25);
            border-radius:var(--r-lg); padding:16px 14px;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; font-weight:700; margin-bottom:6px;">PC TOTALES</div>
          <div style="font-family:var(--font-head); font-size:32px; font-weight:900; color:var(--gold); line-height:1; letter-spacing:-0.02em;">${pcTotal.toLocaleString('es-CO')}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:8px;">puntos de poder</div>
        </div>

        <!-- DIAS ACTIVOS -->
        <div class="tappable" onclick="showInteractiveModal('Dias Activos','Total historico de dias en los que has honrado el pacto. No se reinicia con la racha. Es tu huella permanente.','📅')"
          style="background:rgba(123,97,255,0.06); border:1px solid rgba(123,97,255,0.25);
            border-radius:var(--r-lg); padding:16px 14px;">
          <div style="font-size:10px; letter-spacing:0.15em; color:var(--electric); text-transform:uppercase; font-weight:700; margin-bottom:6px;">DIAS ACTIVOS</div>
          <div style="font-family:var(--font-head); font-size:32px; font-weight:900; color:var(--electric); line-height:1; letter-spacing:-0.02em;">${diasActivos}</div>
          <div style="font-size:10px; color:var(--text-3); margin-top:8px;">dias en total</div>
        </div>

      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- THE ORACLE: AUDITORIA OPERACIONAL SINCRONICA         -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-1 d-flex flex-col tappable" style="margin-bottom:10px; background:linear-gradient(145deg, rgba(18,18,26,0.9), rgba(10,10,15,0.95)); border: 1px solid rgba(123,97,255,0.4); position:relative; overflow:hidden;" onclick="showAuditModal()">
        
        <div style="position:absolute; top:-40px; right:-20px; font-size:140px; opacity:0.04; filter:blur(3px); pointer-events:none;">👁️</div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; position:relative; z-index:2;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <div style="width:8px; height:8px; border-radius:50%; background:var(--electric); box-shadow:0 0 10px var(--electric); animation: pulseDot 2s infinite;"></div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.15em; color:var(--electric); font-weight:800;">Auditoría Operacional Sincrónica</div>
            </div>
            <div style="font-family:var(--font-head); font-size:18px; font-weight:900; color:var(--text-1);">El Oráculo te vigila</div>
          </div>
          <div style="font-size:24px; color:var(--electric); filter:drop-shadow(0 0 8px rgba(123,97,255,0.5));">📜</div>
        </div>

        <p style="font-size:13px; color:var(--text-2); line-height:1.5; margin-bottom:18px; position:relative; z-index:2; max-width: 90%;">
          El sistema está evaluando tu arquitectura conductual en silencio. 
          Al romperse el sello, tu calificación semanal será definitiva.
        </p>

        <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); border-radius:var(--r-md); padding:12px; text-align:center; position:relative; z-index:2; box-shadow: inset 0 2px 15px rgba(0,0,0,0.6);">
          <div style="font-size:10px; color:var(--text-3); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px;">Apertura del Sello de Evaluación en</div>
          <div id="auditCountdownDisplay" style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:24px; font-weight:900; letter-spacing:0.05em; color:var(--text-1); text-shadow:0 0 12px rgba(255,255,255,0.3);">
            T-MINUS CALCULANDO...
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 2. HEATMAP 28 DIAS                                   -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-2" style="margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;" class="tappable" onclick="showInteractiveModal('Historial de 28 Días', 'El mapa de calor registra empíricamente tu patrón de acción.<br><br><b>Niveles de Energía:</b><br><span style=&quot;color:var(--text-3)&quot;>Vacío</span> — Día Perdido<br><span style=&quot;color:rgba(123,97,255,1)&quot;>Púrpura</span> — Esfuerzo Incompleto<br><span style=&quot;color:var(--success)&quot;>Esmeralda</span> — Día Fuerte<br><span style=&quot;color:var(--gold)&quot;>Dorado</span> — Victoria Absoluta<br><br>El sistema analiza solo 28 días porque ese es el periodo científico para cementar la neuroplasticidad. Lo que hagas hoy dictará quién serás mañana.', '🗺️')">
          <div class="section-title" style="margin:0;">Historial 28 dias</div>
          <div style="font-size:11px; color:var(--text-3);">${diasConReporte28} dias con reporte</div>
        </div>
        ${filterHtml}
        <div class="heatmap-labels">
          ${['D','L','M','M','J','V','S'].map(d => `<div class="heatmap-day-label">${d}</div>`).join('')}
        </div>
        <div class="heatmap">
          ${heatArr.map((item, i) => {
            const d = getHeatData(item);
            return `<div class="heatmap-day tappable" data-level="${d.nivel}" onclick="showHeatmapTooltip(this, ${d.nivel}, ${d.valor || 0}, ${d.count || 0}, ${d.total || 0}, ${isGlobal})"></div>`;
          }).join('')}
        </div>
        <div style="display:flex; gap:6px; margin-top:10px; align-items:center; justify-content:flex-end;">
          <span style="font-size:10px; color:var(--text-3);">Menos</span>
          ${[0,1,2,3,4].map(l => `<div style="width:11px;height:11px;border-radius:2px;" class="heatmap-day" data-level="${l}"></div>`).join('')}
          <span style="font-size:10px; color:var(--text-3);">Mas</span>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- NUEVO: TARJETA DE VOLUMEN OPERATIVO                  -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-2 tappable" style="margin-bottom:10px; padding:18px; border-color:var(--border-gold); background:linear-gradient(145deg, rgba(212,168,67,0.06), rgba(0,0,0,0.3));" onclick="showInteractiveModal('Volumen Operativo', 'Suma cuantitativa del esfuerzo invertido.<br><br>Mientras la gráfica evalúa si cumpliste o no, <b>el Volumen mide cuánto peso levantaste</b> (minutos, kms, repeticiones). Si ayer reportaste 10 mins y hoy 100 mins, tu promedio será estático pero tu volumen explotará.', '🧊')">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
           <span style="font-family:var(--font-head); font-weight:800; color:var(--gold); font-size:15px; letter-spacing:0.02em;">Carga Física de Datos</span>
           <span style="font-size:16px;">🧊</span>
        </div>
        <div style="display:flex; gap:12px;">
          <div style="flex:1; background:rgba(0,0,0,0.3); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.02);">
            <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Últimos 7 días</div>
            <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:26px; font-weight:900; color:var(--text-1); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${Number(volSemana.toFixed(1)).toLocaleString('es-CO')} <span style="font-size:11px; font-weight:700; color:var(--text-3);">${unidadFiltro}</span></div>
          </div>
          <div style="flex:1; background:rgba(0,0,0,0.3); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.02);">
            <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Últimos 28 días</div>
            <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:26px; font-weight:900; color:var(--text-1); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${Number(volMes.toFixed(1)).toLocaleString('es-CO')} <span style="font-size:11px; font-weight:700; color:var(--text-3);">${unidadFiltro}</span></div>
          </div>
        </div>
      </div>


      <!-- ════════════════════════════════════════════════════ -->
      <!-- 3. GRAFICA SEMANAL PREMIUM                           -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-3" style="margin-bottom:10px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;" class="tappable" onclick="showInteractiveModal('Rendimiento Semanal', 'Tu promedio de ejecución implacable en los últimos 7 días.<br><br>¿Tu gráfica tiene altibajos extremos? Eres inestable. Mantenerse consistentemente por encima de la línea del 75% separa a los aficionados de los guerreros élite.', '📊')">
          <div>
            <div class="section-title" style="margin:0;">Rendimiento Semanal</div>
            <div style="font-size:11px; color:var(--text-3); margin-top:3px;">Ejecucion de los ultimos 7 dias</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-head); font-size:32px; font-weight:900; color:${promedioSem>=85?'var(--success)':promedioSem>=50?'var(--gold)':'var(--text-2)'}; line-height:1; letter-spacing:-0.02em;">${promedioSem}%</div>
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
          ${semanaArr.map((item, i) => {
            const d      = getSemData(item);
            const pct    = d.pct;
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
        <div class="section-title tappable" style="margin-bottom:14px; width:max-content;" onclick="showInteractiveModal('Análisis de Fuego (Racha)', 'El sistema predictivo proyecta tu velocidad hacia el próximo Escudo Protector.<br><br>Llenar esta barra demanda presentarte todos los días sin falta, sin excepciones emocionales.', '🔥')">🔥 Analisis de Racha</div>

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

        <!-- Grid de hitos (Candados interactivos) -->
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:14px;">
          ${[7,14,30,90].map(hito => {
            const alcanzado = lineaActiva >= hito;
            const msgAlcanzado = alcanzado ? '¡Conquistado!' : `Faltan ${hito - lineaActiva} días.`;
            return `
              <div class="tappable" onclick="showInteractiveModal('Hito de ${hito} Días', 'Los hitos son puntos de anclaje de tu identidad. ${alcanzado ? '<b>Ya aseguraste este nivel</b>, el próximo gran reto te espera.' : '<br><br><b>'+msgAlcanzado+'</b> Para romper este candado debes reportar sin falta.'}', '${alcanzado?'🏆':'🔒'}')"
                style="text-align:center; padding:8px 4px; border-radius:var(--r-md);
                background:${alcanzado?'rgba(212,168,67,0.1)':'var(--bg-elevated)'};
                border:1px solid ${alcanzado?'var(--border-gold)':'var(--border)'};">
                <div style="font-size:14px;">${alcanzado?'🏆':'🔒'}</div>
                <div style="font-size:11px; font-weight:700; color:${alcanzado?'var(--gold)':'var(--text-3)'};">${hito}d</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Escudos disponibles interactivos -->
        <div class="tappable" onclick="showInteractiveModal('Escudos Protectores de Combate', 'Los escudos protegen tu racha. Se consumen automáticamente si un día olvidas reportar absolutamente TODO.<br><br>Recuerda: <b>Regla de los 2 Minutos.</b> Hacer una misión a medias es mejor que usar un escudo. Guárdalos para emergencias reales (enfermedad o viajes).', '🛡️')"
          style="display:flex; align-items:center; gap:8px; padding:10px 12px;
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

          <div style="flex:1;" class="tappable" onclick="showInteractiveModal('Tu Posición Operativa', 'El oráculo te ubica en una jerarquía exacta según tu ICD real.<br><br>La <b>Proyección 7d</b> predice matemáticamente dónde caerás o subirás en tan solo 1 semana si mantienes idéntico el mismo patrón de comportamiento de hoy.', '🧭')">
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
              <div style="font-family:var(--font-head); font-size:36px; font-weight:900; letter-spacing:-0.02em;
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

  // KEYFRAME para el widget del Oráculo
  if (!document.getElementById('oracle-pulse')) {
    const s = document.createElement('style');
    s.id = 'oracle-pulse';
    s.innerHTML = `@keyframes pulseDot { 0% { transform: scale(1); opacity:1; box-shadow:0 0 5px var(--electric);} 50% { transform: scale(1.6); opacity:0.3; box-shadow:0 0 15px var(--electric);} 100% { transform: scale(1); opacity:1; box-shadow:0 0 5px var(--electric);} }`;
    document.head.appendChild(s);
  }

  // Arrancar contador del Oraculo
  updateAuditCountdown();
  if (auditTimerInterval) clearInterval(auditTimerInterval);
  auditTimerInterval = setInterval(updateAuditCountdown, 1000);
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

// --- ORACLE TIMERS & MODAL ---
let auditTimerInterval = null;

function calculateNextSunday8PM() {
  const now = new Date();
  
  // Buscar próximo domingo en zona horaria local
  let target = new Date(now);
  let diaSemana = target.getDay(); // 0=Dom, 1=Lun...
  let diasFaltantes = (0 - diaSemana + 7) % 7; 
  
  // Si hoy es domingo pero ya pasaron las 8 PM, rotar 7 dias
  if (diasFaltantes === 0 && (now.getHours() > 20 || (now.getHours() === 20 && now.getMinutes() >= 0))) {
     diasFaltantes = 7; 
  }
  
  target.setDate(target.getDate() + diasFaltantes);
  target.setHours(20, 0, 0, 0); // 8:00 PM estricto
  
  const diffMs = target.getTime() - now.getTime();
  
  if (diffMs <= 0) return { d: 0, h: 0, m: 0, s: 0, ready: true };
  
  const totalS = Math.floor(diffMs / 1000);
  const d = Math.floor(totalS / 86400);
  const h = Math.floor((totalS % 86400) / 3600);
  const m = Math.floor((totalS % 3600) / 60);
  const s = totalS % 60;
  
  return { d, h, m, s, ready: false };
}

function updateAuditCountdown() {
  const el = document.getElementById('auditCountdownDisplay');
  if (!el) return;
  const time = calculateNextSunday8PM();
  
  if (time.ready) {
    el.innerHTML = '<span style="color:var(--gold); font-size:18px; letter-spacing:0.05em; border-bottom:1px solid var(--gold); padding-bottom:2px;">DISPONIBLE EN TELEGRAM</span>';
    return;
  }
  
  const pad = (n) => n.toString().padStart(2, '0');
  el.textContent = `-${pad(time.d)}d : ${pad(time.h)}h : ${pad(time.m)}m : ${pad(time.s)}s`;
}

function showAuditModal() {
  const time = calculateNextSunday8PM();
  if (time.ready) {
    showInteractiveModal('Auditoría Terminada', 'El Oráculo ha finalizado su veredicto semanal.<br><br><b>Sal de aquí. Ve a tu canal privado de Telegram para consultar tus sentencias y calificaciones.</b><br><br>El sello ha sido roto de forma permanente.', '📜');
  } else {
    showInteractiveModal('Acceso Restringido', 'El Oráculo está procesando tu patrón conductual en este exacto momento.<br><br>No puedes apresurar el veredicto. Tu única acción permitida es asegurar que tus métricas estén intactas y robustas antes de que el contador llegue a su doloroso cero.<br><br><b>¿Podrás sostener la línea?</b>', '👁️');
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

function showHeatmapTooltip(element, level, valor, count, total, isGlobal) {
  let extraInfo = '';
  if (isGlobal && total > 0) {
    extraInfo = `<br><span style="font-size:11px;color:var(--text-3); font-weight:600;">${count} de ${total} misiones</span>`;
  } else if (!isGlobal && valor > 0) {
    // Aquí podrías agregar la unidad si quieres pasarla, pero valor ya aporta la cifra real.
    extraInfo = `<br><span style="font-size:11px;color:rgba(212,168,67,1); font-weight:700;">Volumen: +${Number(valor).toLocaleString('es-CO')}</span>`;
  }

  const messages = [
    '<span style="color:var(--text-2);">0 Actividad</span>' + extraInfo,
    'Avance leve (Nivel 1)' + extraInfo,
    'Buen esfuerzo (Nivel 2)' + extraInfo,
    '<span style="color:var(--gold);">Día Fuerte (Nivel 3)</span>' + extraInfo,
    '<span style="color:var(--electric);font-weight:800;">Día de Poder (Nivel 4)⚡</span>' + extraInfo
  ];
  _createTooltip(element, messages[level]);
}


