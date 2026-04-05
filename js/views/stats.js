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

let currentStatsTab = 'EXEC'; // 'EXEC' | 'COMPARE'
let currentStatsFilter = 'GLOBAL';

// ── KPI Premium helpers ──────────────────────────────────────────────
function _kpiCob(sa, g) { const cs = sa.filter(d => g(d).total > 0).map(d => g(d).count / g(d).total * 100); return cs.length ? Math.round(cs.reduce((a, b) => a + b, 0) / cs.length) : 0; }
function _kpiCumpl(sa, g) { const ps = sa.map(d => g(d).pct).filter(p => p > 0); return ps.length ? Math.round(ps.reduce((a, b) => a + Math.min(b, 100), 0) / ps.length) : 0; }
function _kpiSobre(sa, g) { const es = sa.map(d => g(d).pct).filter(p => p > 100).map(p => p - 100); return es.length ? Math.round(es.reduce((a, b) => a + b, 0) / es.length) : 0; }
function _kpiTend(sa, g) { const ps = sa.map(d => g(d).pct), a1 = ps.slice(0, 4).filter(p => p > 0), a2 = ps.slice(4).filter(p => p > 0); if (!a1.length || !a2.length) return 0; return Math.round(a2.reduce((x, b) => x + b, 0) / a2.length - a1.reduce((x, b) => x + b, 0) / a1.length); }
function _kpiReg(ha, g) { return Math.round(ha.filter(d => g(d).nivel > 0).length / 28 * 100); }
function _kpiVolat(sa, g) { const ps = sa.map(d => g(d).pct).filter(p => p > 0); if (ps.length < 2) return 0; const avg = ps.reduce((a, b) => a + b, 0) / ps.length; return Math.round(Math.sqrt(ps.reduce((a, p) => a + Math.pow(p - avg, 2), 0) / ps.length)); }
function _kpiRecup(ha, g) { let n = 0; for (let i = ha.length - 1; i >= 0; i--) { if (g(ha[i]).nivel === 0) break; n++; } return n; }
// ─────────────────────────────────────────────────────────────────────

// Wrapper global (usado por compare.js) para forzar repintado sin reload
window.renderStatsWrapper = function() {
  if (!window.appData) return '';
  return renderStats(window.appData);
};

function changeStatsTab(tab) {
  currentStatsTab = tab;
  if (window.appData) {
    document.getElementById('viewContainer').innerHTML = renderStatsWrapper();
    if (tab === 'EXEC' && typeof initStatsAnimations === 'function') {
      setTimeout(initStatsAnimations, 50);
    }
  }
}

function renderStats(data) {
  // Common Top Segmented Control Tab
  const tabsHtml = `
    <div style="display:flex; justify-content:center; align-items:center; background:rgba(0,0,0,0.6); padding:4px; border-radius:12px; margin-bottom:16px; border:1px solid rgba(255,255,255,0.05); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); width:100%; max-width:400px; margin-left:auto; margin-right:auto;">
      <div class="tappable" onclick="changeStatsTab('EXEC')" style="flex:1; text-align:center; padding:10px 14px; border-radius:8px; font-size:12px; font-family:var(--font-head); font-weight:800; transition:all 0.2s; ${currentStatsTab === 'EXEC' ? 'background:rgba(212,168,67,0.15); color:var(--text-1); box-shadow:0 0 10px rgba(212,168,67,0.2);' : 'color:var(--text-3);'}">Resumen Ejecutivo</div>
      <div class="tappable" onclick="changeStatsTab('COMPARE')" style="flex:1; text-align:center; padding:10px 14px; border-radius:8px; font-size:12px; font-family:var(--font-head); font-weight:800; transition:all 0.2s; ${currentStatsTab === 'COMPARE' ? 'background:rgba(212,168,67,0.15); color:var(--text-1); box-shadow:0 0 10px rgba(212,168,67,0.2);' : 'color:var(--text-3);'}">Modo Comparativa ⚖️</div>
    </div>
  `;

  if (currentStatsTab === 'COMPARE' && typeof renderCompare === 'function') {
    return `<div style="padding:16px 16px 0;">${tabsHtml}</div>` + renderCompare(data);
  }

  return `<div style="padding:16px 16px 0;">${tabsHtml}</div>` + _renderStatsDashboard(data);
}

function _renderStatsDashboard(data) {
  const { user, compromisos, historial, semana } = data;

  const icd = Number(user.icd) || 0;
  const lineaActiva = Number(user.lineaActiva) || 0;
  const pcTotal = Number(user.pcTotal) || 0;
  const diasActivos = Number(user.diasActivos) || 0;
  const escudos = Number(user.escudos) || 0;
  const tendencia = user.tendencia || '→';

  if (currentStatsFilter !== 'GLOBAL' && !(compromisos || []).find(c => c.id === currentStatsFilter)) {
    currentStatsFilter = 'GLOBAL';
  }

  // Helpers de compatibilidad por si el backend sigue enviando números planos
  const getHeatData = (item) => typeof item === 'object' ? item : { nivel: item || 0, count: 0, total: 0, valor: 0 };
  const getSemData = (item) => typeof item === 'object' ? item : { pct: item || 0, count: 0, total: 0, valor: 0 };

  const histList = historial ? (historial[currentStatsFilter] || historial.GLOBAL || []) : [];
  const heatArr = histList.length === 28 ? histList : Array(28).fill(0);

  const semList = semana ? (semana[currentStatsFilter] || semana.GLOBAL || []) : [];
  const semanaArr = semList.length === 7 ? semList : Array(7).fill(0);

  // Días dinámicos (termina hoy)
  const diasLabels = [];
  const nombresDias = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const diaHoy = new Date().getDay();
  for (let i = 6; i >= 0; i--) {
    diasLabels.push(nombresDias[(diaHoy - i + 7) % 7]);
  }

  const maxSem = Math.max(...semanaArr.map(v => getSemData(v).pct).filter(p => p > 0), 1);


  // ── Zona ICD
  const icdZona = icd >= 85 ? { label: 'Zona Elite 🎯', color: 'var(--gold)', bg: 'rgba(212,168,67,0.08)' }
    : icd >= 70 ? { label: 'Zona Solida ⚡', color: 'var(--electric)', bg: 'rgba(123,97,255,0.08)' }
      : icd >= 50 ? { label: 'En Progreso 🛠', color: 'var(--text-2)', bg: 'rgba(255,255,255,0.04)' }
        : { label: 'En Construccion', color: '#EF4444', bg: 'rgba(239,68,68,0.06)' };

  // ── Gauge SVG ICD
  const R = 60, C = 2 * Math.PI * R;
  const filled = C * (icd / 100);
  const gap = C - filled;

  // ── Compromisos con datos de hoy (valor real vs meta)
  const compromisosList = compromisos || [];
  const activos = compromisosList.filter(c => c.aplicaHoy !== false);
  const inactivos = compromisosList.filter(c => c.aplicaHoy === false);
  const hechos = activos.filter(c => c.hecho);
  const pctDia = activos.length > 0 ? Math.round((hechos.length / activos.length) * 100) : 0;

  // ── Proximo hito de racha
  const hitosRacha = [7, 14, 21, 30, 60, 90, 180, 365];
  const nextHito = hitosRacha.find(h => h > lineaActiva) || 365;
  const prevHito = hitosRacha.filter(h => h <= lineaActiva).pop() || 0;
  const rachaPct = prevHito === nextHito ? 100 : Math.round(((lineaActiva - prevHito) / (nextHito - prevHito)) * 100);

  // ── Dias restantes para cierre del contrato (si hay)
  const contrato = data.contrato;
  const diasRestantes = contrato ? (contrato.diasRestantes || 0) : null;

  // ── Proyeccion ICD a 7 dias
  const diasSinReporte28 = heatArr.filter(v => getHeatData(v).nivel === 0).length;
  const diasConReporte28 = 28 - diasSinReporte28;
  const icdProyectado = diasConReporte28 >= 7
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
    if (idx >= 21) volSemana += val;
  });

  // Si es global calculamos promedios 7D
  let globalCumpl7d = 0; let globalCobert7d = 0;
  if(isGlobal) {
    const semPts = semanaArr.map(s => getSemData(s).pct);
    globalCumpl7d = Math.round(semPts.reduce((a, b) => a + b, 0) / (semPts.length||1));
    const cobPts = semanaArr.map(s => getSemData(s).cobertura || 0);
    globalCobert7d = Math.round(cobPts.reduce((a, b) => a + b, 0) / (cobPts.length||1));
  }

  // ── 10 KPIs Premium ─────────────────────────────────────────
  const kpiCob = _kpiCob(semanaArr, getSemData);
  const kpiCumpl = _kpiCumpl(semanaArr, getSemData);
  const kpiSob = _kpiSobre(semanaArr, getSemData);
  const kpiTend = _kpiTend(semanaArr, getSemData);
  const kpiReg = _kpiReg(heatArr, getHeatData);
  const kpiVol = _kpiVolat(semanaArr, getSemData);
  const kpiRec = _kpiRecup(heatArr, getHeatData);
  const volLbl = kpiVol <= 15 ? 'Estable' : kpiVol <= 35 ? 'Variable' : 'Caótico';
  const tIcon = kpiTend > 5 ? '↑' : kpiTend < -5 ? '↓' : '→';
  const tColor = kpiTend > 5 ? 'var(--success)' : kpiTend < -5 ? '#EF4444' : 'var(--text-2)';
  const areasD = data.areasResumen || [];
  // ─────────────────────────────────────────────────────────────

  // ── Filtro selector
  const filterHtml = `
    <select id="statsFilterSelect" onchange="changeStatsFilter(this.value)"
      style="width:100%; padding:8px 10px; background:var(--bg-overlay);
             border:1px solid rgba(212,168,67,0.4); border-radius:var(--r-md);
             color:var(--gold); font-family:var(--font-head); font-size:13px;
             font-weight:800; outline:none; cursor:pointer;">
      <option value="GLOBAL" ${currentStatsFilter === 'GLOBAL' ? 'selected' : ''}>🌍 Todas las misiones (Global)</option>
      ${compromisosList.map(c => `
        <option value="${c.id}" ${currentStatsFilter === c.id ? 'selected' : ''}>${c.emoji} ${c.nombre}</option>
      `).join('')}
    </select>
  `;

  // ── Promedio semanal calculado
  const promedioSem = semanaArr.length > 0 ? Math.round(semanaArr.reduce((a, b) => a + getSemData(b).pct, 0) / semanaArr.length) : 0;


  return `
    <div class="view" id="view-stats" style="padding-bottom: 32px; padding-top:0;">

      <!-- ══ 1. KPI COMMAND BAR — 6 métricas en 2 filas ══ -->
      <div class="kpi-exec-bar stagger-up stagger-1">

        <!-- Fila 1: ICD · Racha · Cobertura Hoy -->
        <div class="kpi-exec-chip kpi-exec-chip--gold tappable" onclick="showInteractiveModal('ICD','Índice de Consistencia en 28 días. 100 = perfección absoluta. Cada día sin reportar lo reduce.','🎯')">
          <div class="kpi-exec-label">ICD</div>
          <div class="kpi-exec-value" style="color:${icdZona.color};">${icd}</div>
          <div class="kpi-exec-sub">${tendencia} ${icdZona.label.split(' ')[0]}</div>
        </div>
        <div class="kpi-exec-chip kpi-exec-chip--fire tappable" onclick="showInteractiveModal('Línea Activa','Días consecutivos sin romper el pacto. La racha es el arma más poderosa.','🔥')">
          <div class="kpi-exec-label">Racha</div>
          <div class="kpi-exec-value" style="color:var(--fire);">${lineaActiva}<span style="font-size:13px;">🔥</span></div>
          <div class="kpi-exec-sub">hito: ${nextHito}d</div>
        </div>
        <div class="kpi-exec-chip ${pctDia >= 80 ? 'kpi-exec-chip--green' : pctDia >= 50 ? 'kpi-exec-chip--gold' : 'kpi-exec-chip--red'} tappable" onclick="showInteractiveModal('Cobertura de Hoy','% de misiones activas ya reportadas hoy. No confundir con cumplimiento: puedes reportar pocas y superar la meta en las que sí reportaste.','📋')">
          <div class="kpi-exec-label">Hoy</div>
          <div class="kpi-exec-value" style="color:${pctDia >= 80 ? 'var(--success)' : pctDia >= 50 ? 'var(--gold)' : '#EF4444'};">${pctDia}%</div>
          <div class="kpi-exec-sub">${hechos.length}/${activos.length} mis.</div>
        </div>
      </div>

      <!-- Fila 2: Volatilidad · Regularidad · Recuperación -->
      <div class="kpi-exec-bar stagger-up stagger-1" style="margin-bottom:10px;">
        <div class="kpi-exec-chip kpi-exec-chip--purple tappable" onclick="showInteractiveModal('Estabilidad de Esfuerzo','Mide qué tanto varía tu rendimiento día tras día.<br><br>• <b>Estable:</b> Eres una roca. Mantienes el mismo nivel siempre.<br>• <b>Variable:</b> Tu energía sube y baja según el día.<br>• <b>Caótico:</b> Eres impredecible. Un día das el 100% y al siguiente desapareces.<br><br>💡 El 1% busca Estabilidad.','📊')">
          <div class="kpi-exec-label">Volatilidad</div>
          <div class="kpi-exec-value" style="font-size:14px;color:var(--electric);">${volLbl}</div>
          <div class="kpi-exec-sub">σ=${kpiVol}%</div>
        </div>
        <div class="kpi-exec-chip kpi-exec-chip--gold tappable" onclick="showInteractiveModal('Regularidad 28d','% de los últimos 28 días con al menos 1 misión reportada. La ciencia del hábito exige contexto estable y repetición consistente.','📅')">
          <div class="kpi-exec-label">Regularidad</div>
          <div class="kpi-exec-value" style="color:${kpiReg >= 80 ? 'var(--success)' : kpiReg >= 50 ? 'var(--gold)' : '#EF4444'};">${kpiReg}%</div>
          <div class="kpi-exec-sub">${diasConReporte28}/28d</div>
        </div>
        <div class="kpi-exec-chip tappable" onclick="showInteractiveModal('Recuperación','Días activos consecutivos desde tu última caída. Es tu momentum real, no el acumulado histórico.','⚡')">
          <div class="kpi-exec-label">Recuperac.</div>
          <div class="kpi-exec-value" style="color:${kpiRec >= 7 ? 'var(--success)' : kpiRec >= 3 ? 'var(--gold)' : 'var(--text-2)'};">${kpiRec}d</div>
          <div class="kpi-exec-sub">sin caída</div>
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
      <!-- NUEVO: TARJETA DE CARGA (AHORA COMO FILTRO MAESTRO)  -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-2" style="margin-bottom:10px; padding:16px; border-color:var(--border-gold); background:linear-gradient(145deg, rgba(212,168,67,0.08), rgba(0,0,0,0.4));">
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:12px;">
           <div style="display:flex; align-items:center; justify-content:space-between;">
             <div style="display:flex; align-items:center; gap:8px;">
               <span style="font-family:var(--font-head); font-weight:800; color:var(--text-1); font-size:14px; letter-spacing:0.02em;">Filtrar Carga Operativa</span>
               <div onclick="showInteractiveModal('Volumen Operativo', 'Suma cuantitativa del esfuerzo invertido.\\n\\nSelecciona una misión específica en el menú superior para aislar tu gráfica semanal y mapa de calor exclusivamente hacia esa métrica.\\n\\nMientras la gráfica evalúa si cumpliste o no, <b>el Volumen mide cuánto peso levantaste</b> (minutos, kms, repeticiones).', '🧊')" style="background:rgba(212,168,67,0.2); border-radius:50%; width:18px;height:18px;display:flex;justify-content:center;align-items:center;color:var(--gold);font-size:10px;font-weight:800;cursor:pointer;">?</div>
             </div>
             <span style="font-size:14px; opacity:0.8;">🧊</span>
           </div>
           
           ${filterHtml}
        </div>

         <div style="display:flex; gap:10px;">
          ${isGlobal ? `
            <div style="flex:1; background:rgba(0,0,0,0.4); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.03);">
              <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Cumplimiento Prom. (7D)</div>
              <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:20px; font-weight:900; color:var(--gold); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${globalCumpl7d}<span style="font-size:12px;">%</span> <span style="font-size:10px; font-weight:700; color:var(--text-3);">sobre meta</span></div>
            </div>
            <div style="flex:1; background:rgba(0,0,0,0.4); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.03);">
              <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Cobertura Prom. (7D)</div>
              <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:20px; font-weight:900; color:var(--gold); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${globalCobert7d}<span style="font-size:12px;">%</span> <span style="font-size:10px; font-weight:700; color:var(--text-3);">misiones activas</span></div>
            </div>
          ` : `
            <div style="flex:1; background:rgba(0,0,0,0.4); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.03);">
              <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Volumen Semanal</div>
              <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:20px; font-weight:900; color:var(--gold); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${Number(volSemana.toFixed(1)).toLocaleString('es-CO')} <span style="font-size:10px; font-weight:700; color:var(--text-3);">${unidadFiltro}</span></div>
            </div>
            <div style="flex:1; background:rgba(0,0,0,0.4); border-radius:var(--r-md); padding:10px; border:1px solid rgba(255,255,255,0.03);">
              <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700;">Volumen Mensual</div>
              <div style="font-family:var(--font-head); font-variant-numeric:tabular-nums; font-size:20px; font-weight:900; color:var(--gold); line-height:1.2; letter-spacing:-0.02em; margin-top:2px;">${Number(volMes.toFixed(1)).toLocaleString('es-CO')} <span style="font-size:10px; font-weight:700; color:var(--text-3);">${unidadFiltro}</span></div>
            </div>
          `}
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════ -->
      <!-- 2. HEATMAP 28 DIAS                                   -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-2" style="margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;" class="tappable" onclick="showInteractiveModal('Historial de 28 Días', 'El mapa de calor registra empíricamente tu patrón de acción en la misión seleccionada.<br><br><b>Niveles de Energía:</b><br><span style=&quot;color:var(--text-3)&quot;>Vacío</span> — Día Perdido<br><span style=&quot;color:rgba(123,97,255,1)&quot;>Púrpura</span> — Esfuerzo Incompleto<br><span style=&quot;color:var(--success)&quot;>Esmeralda</span> — Día Fuerte<br><span style=&quot;color:var(--gold)&quot;>Dorado</span> — Victoria Absoluta<br><br>El sistema analiza solo 28 días porque ese es el periodo científico para cementar la neuroplasticidad.', '🗺️')">
          <div class="section-title" style="margin:0;">Historial 28 dias</div>
          <div style="font-size:11px; color:var(--text-3);">${diasConReporte28} dias con reporte</div>
        </div>
        
        <div class="heatmap-labels">
          ${['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => `<div class="heatmap-day-label">${d}</div>`).join('')}
        </div>
        <div class="heatmap">
          ${heatArr.map((item, i) => {
    const d = getHeatData(item);
    const fechaStr = d.fecha || '';
    return `<div class="heatmap-day tappable" data-level="${d.nivel}" data-idx="${i}" onclick="showDayDrilldown(${i}, window._appData, '${currentStatsFilter}')"></div>`;
  }).join('')}
        </div>
        <div style="display:flex; gap:6px; margin-top:10px; align-items:center; justify-content:flex-end;">
          <span style="font-size:10px; color:var(--text-3);">Menos</span>
          ${[0, 1, 2, 3, 4].map(l => `<div style="width:11px;height:11px;border-radius:2px;" class="heatmap-day" data-level="${l}"></div>`).join('')}
          <span style="font-size:10px; color:var(--text-3);">Mas</span>
        </div>
      </div>


      <!-- ════════════════════════════════════════════════════ -->
      <!-- 3. GRAFICA SEMANAL PREMIUM                           -->
      <!-- ════════════════════════════════════════════════════ -->
      <div class="card stagger-up stagger-3" style="margin-bottom:10px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;" class="tappable" onclick="showInteractiveModal('Rendimiento Semanal — 3 Dimensiones','<b>Cobertura</b> = misiones reportadas / activas.<br><b>Cumplimiento</b> = promedio ponderado de qué tanto alcanzaste la meta.<br><b>Sobrecumplimiento</b> = exceso promedio sobre el 100%.<br><br>Un panel honesto no mezcla estas métricas. Cada una habla de algo distinto.','📊')">
          <div>
            <div class="section-title" style="margin:0;">Rendimiento Semanal</div>
            <div style="font-size:11px; color:var(--text-3); margin-top:3px;">3 dimensiones · últimos 7 días</div>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="font-size:13px;font-weight:700;color:${tColor};">${tIcon} ${kpiTend > 0 ? '+' + kpiTend : kpiTend}%</span>
            <span style="font-size:10px;color:var(--text-3);">vs sem.</span>
          </div>
        </div>
        <div class="sem-metrics-row">
          <div class="sem-metric-block" style="border-color:rgba(123,97,255,0.2);">
            <div class="sem-metric-val" style="font-size:18px;color:var(--electric);">${kpiCob}%</div>
            <div class="sem-metric-lbl">Cobertura</div>
          </div>
          <div class="sem-metric-block" style="border-color:${kpiCumpl >= 80 ? 'rgba(34,197,94,0.3)' : kpiCumpl >= 50 ? 'rgba(212,168,67,0.3)' : 'rgba(239,68,68,0.3)'}; padding:12px 8px;">
            <div class="sem-metric-val" style="font-size:26px;color:${kpiCumpl >= 80 ? 'var(--success)' : kpiCumpl >= 50 ? 'var(--gold)' : '#EF4444'};">${kpiCumpl}%</div>
            <div class="sem-metric-lbl">Cumplimiento</div>
          </div>
          <div class="sem-metric-block" style="border-color:${kpiSob > 0 ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.04)'}">
            <div class="sem-metric-val" style="font-size:18px;color:${kpiSob > 0 ? 'var(--fire)' : 'var(--text-3)'}">${kpiSob > 0 ? '+' + kpiSob + '%' : '—'}</div>
            <div class="sem-metric-lbl">Sobrecumpl.</div>
          </div>
        </div>
        <div style="display:flex; align-items:flex-end; gap:8px; height:150px; padding:0 2px; position:relative;">
          <!-- Lineas de referencia -->
          <div style="position:absolute; inset:0; pointer-events:none; padding-bottom:24px;">
            ${[25, 50, 75, 100].map(ref => `
              <div style="position:absolute; left:0; right:0;
                bottom:${Math.round((ref / 100) * 120) + 4}px;
                display:flex; align-items:center; justify-content:flex-end;">
                <span style="font-size:8px; color:rgba(255,255,255,0.15); padding-right:2px;">${ref}%</span>
                <div style="flex:1; height:1px; background:rgba(255,255,255,0.06);"></div>
              </div>
            `).join('')}
          </div>
          ${semanaArr.map((item, i) => {
    const d = getSemData(item);
    const pct = d.pct;
    const esHoy = i === semanaArr.length - 1;

    const h = pct > 0 ? Math.max(14, Math.round((pct / maxSem) * 120)) : 6;
    const color = esHoy
      ? 'linear-gradient(180deg,#FFD700,#B8860B)'
      : pct >= 85 ? 'linear-gradient(180deg,#22C55E,rgba(34,197,94,0.5))'
        : pct >= 50 ? 'linear-gradient(180deg,#7B61FF,rgba(123,97,255,0.4))'
          : pct > 0 ? 'linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08))'
            : 'rgba(255,255,255,0.04)';
    const shadow = esHoy
      ? '0 -6px 20px rgba(212,168,67,0.6)'
      : pct >= 85 ? '0 -4px 12px rgba(34,197,94,0.35)'
        : pct >= 50 ? '0 -4px 8px rgba(123,97,255,0.25)'
          : 'none';
    return `
              <div class="tappable" onclick="showChartTooltip(this, ${pct}, '${diasLabels[i]}')" style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; z-index:1; padding-top:10px;">
                ${pct > 0
        ? `<div style="font-size:10px; font-weight:800; color:${esHoy ? '#FFD700' : pct >= 85 ? 'var(--success)' : 'var(--text-3)'}; letter-spacing:-0.02em;">${pct}%</div>`
        : `<div style="font-size:10px; color:var(--text-3);">-</div>`}
                <div style="width:100%; border-radius:7px 7px 3px 3px;
                  background:${color};
                  box-shadow:${shadow};
                  height:0px; transition:height 1.2s cubic-bezier(0.34,1.1,0.64,1) ${i * 0.1}s;
                  position:relative;"
                  id="bar-${i}" data-h="${h}px">
                  ${esHoy ? `<div style="position:absolute;top:-5px;left:50%;transform:translateX(-50%);
                    width:7px;height:7px;border-radius:50%;background:#FFD700;
                    box-shadow:0 0 8px rgba(212,168,67,0.9);"></div>` : ''}
                </div>
                <div style="font-size:10px; color:${esHoy ? '#FFD700' : 'var(--text-3)'}; font-weight:${esHoy ? '800' : '400'};">${diasLabels[i]}</div>
              </div>
            `;
  }).join('')}
        </div>
      </div>

      <!-- ══ AUDITORÍA DIARIA — Tabla rolling 7 días ══ -->
      <div class="card stagger-up stagger-3" style="margin-bottom:10px;padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;" class="tappable" onclick="showInteractiveModal('Auditoría Diaria','Registro exacto de tu actividad día por día. Sin promedios que engañen: ves los números reales de cada jornada.','📋')">
          <div class="section-title" style="margin:0;">Auditoría Diaria</div>
          <span style="font-size:11px;color:var(--text-3);">↔ desliza</span>
        </div>
        <div class="day-matrix-wrap">
          <table class="day-matrix">
            <thead><tr>
              <th style="text-align:left;">Misión</th>
              ${semanaArr.map((item, i) => { const d = getSemData(item); const esH = i === 6; return `<th class="${esH ? 'today-col' : ''}">${d.dia || diasLabels[i]}</th>`; }).join('')}
            </tr></thead>
            <tbody>
              ${isGlobal ? `
                <tr>
                  <td class="row-label">Misiones</td>
                  ${semanaArr.map((item, i) => { const d = getSemData(item), esH = i === 6, cnt = d.count || 0, tot = d.total || 0; const cls = cnt > 0 && cnt >= tot ? 'good' : cnt > 0 ? 'mid' : 'zero'; return `<td class="cell-val cell-val--${cls}" style="${esH ? 'color:var(--gold);' : ''}">${tot > 0 ? cnt + '/' + tot : '—'}</td>`; }).join('')}
                </tr>
                <tr>
                  <td class="row-label">Cumplim.</td>
                  ${semanaArr.map((item, i) => { const p = getSemData(item).pct, esH = i === 6; const cls = p >= 85 ? 'good' : p >= 50 ? 'mid' : p > 0 ? 'low' : 'zero'; return `<td class="cell-val cell-val--${cls}" style="${esH ? 'color:var(--gold);' : ''}">${p > 0 ? p + '%' : '—'}</td>`; }).join('')}
                </tr>` : (() => {
      const comp = compromisosList.find(c => c.id === currentStatsFilter); return `
                <tr>
                  <td class="row-label">${comp ? comp.emoji + ' ' + comp.nombre.substring(0, 10) : 'Misión'}</td>
                  ${semanaArr.map((item, i) => { const d = getSemData(item), esH = i === 6, val = d.valor || 0, pct = d.pct || 0; const cls = pct >= 100 ? 'good' : pct >= 50 ? 'mid' : pct > 0 ? 'low' : 'zero'; return `<td class="cell-val cell-val--${cls}" style="${esH ? 'color:var(--gold);' : ''}">${val > 0 ? Number(val.toFixed(1)).toLocaleString('es-CO') : '—'}</td>`; }).join('')}
                </tr>
                <tr>
                  <td class="row-label">Cumplim.</td>
                  ${semanaArr.map((item, i) => { const p = getSemData(item).pct, esH = i === 6; const cls = p >= 100 ? 'good' : p >= 50 ? 'mid' : p > 0 ? 'low' : 'zero'; return `<td class="cell-val cell-val--${cls}" style="${esH ? 'color:var(--gold);' : ''}">${p > 0 ? p + '%' : '—'}</td>`; }).join('')}
                </tr>`;
    })()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══ DISTRIBUCIÓN POR ÁREA ══ -->
      ${areasD.length > 0 ? `
      <div class="card stagger-up stagger-3" style="margin-bottom:10px;">
        <div class="section-title tappable" style="margin-bottom:14px;" onclick="showInteractiveModal('Balance por Área','Distribución de tu energía entre las distintas áreas de vida. Un guerrero élite no descuida ningún frente.','🗺️')">🗺️ Balance por Área</div>
        ${areasD.map((a, idx) => {
      const cls = a.pct >= 80 ? 'green' : a.pct >= 50 ? 'gold' : 'red'; return `
          <div class="area-dist-item">
            <span class="area-dist-icon">${a.icono}</span>
            <span class="area-dist-name">${a.nombre}</span>
            <div class="area-dist-bar-track"><div class="area-dist-bar-fill area-dist-bar-fill--${cls}" id="abar-${idx}" style="width:0%;" data-w="${a.pct}%"></div></div>
            <span class="area-dist-pct area-dist-pct--${cls}">${a.pct}%</span>
          </div>`;
    }).join('')}
      </div>`: ''}

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
          ${[7, 14, 30, 90].map(hito => {
      const alcanzado = lineaActiva >= hito;
      const msgAlcanzado = alcanzado ? '¡Conquistado!' : `Faltan ${hito - lineaActiva} días.`;
      return `
              <div class="tappable" onclick="showInteractiveModal('Hito de ${hito} Días', 'Los hitos son puntos de anclaje de tu identidad. ${alcanzado ? '<b>Ya aseguraste este nivel</b>, el próximo gran reto te espera.' : '<br><br><b>' + msgAlcanzado + '</b> Para romper este candado debes reportar sin falta.'}', '${alcanzado ? '🏆' : '🔒'}')"
                style="text-align:center; padding:8px 4px; border-radius:var(--r-md);
                background:${alcanzado ? 'rgba(212,168,67,0.1)' : 'var(--bg-elevated)'};
                border:1px solid ${alcanzado ? 'var(--border-gold)' : 'var(--border)'};">
                <div style="font-size:14px;">${alcanzado ? '🏆' : '🔒'}</div>
                <div style="font-size:11px; font-weight:700; color:${alcanzado ? 'var(--gold)' : 'var(--text-3)'};">${hito}d</div>
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
                Proyeccion 7d: <strong style="color:${icdProyectado > icd ? 'var(--success)' : icdProyectado < icd ? '#EF4444' : 'var(--text-1)'}">${icdProyectado} ICD</strong>
                ${icdProyectado > icd ? ' ↑' : icdProyectado < icd ? ' ↓' : ' →'}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Escala de zonas -->
        ${[
      { min: 85, label: 'Zona Elite 🎯', color: 'var(--gold)', desc: 'Top 1% global. Consistencia extrema.' },
      { min: 70, label: 'Zona Solida ⚡', color: 'var(--electric)', desc: 'Base solida. Un empuje mas.' },
      { min: 50, label: 'En Progreso 🛠', color: 'var(--text-2)', desc: 'Construyendo el habito.' },
      { min: 0, label: 'En Construccion 🧱', color: '#EF4444', desc: 'Requiere atencion urgente.' },
    ].map(z => {
      const esActual = icd >= z.min && (z.min === ([85, 70, 50, 0].find(m => icd >= m)));
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
                background:${pctDia >= 100 ? 'rgba(34,197,94,0.15)' : pctDia > 0 ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.05)'};
                color:${pctDia >= 100 ? 'var(--success)' : pctDia > 0 ? 'var(--gold)' : 'var(--text-3)'};">
                ${pctDia}%
              </div>
            </div>
          </div>
          <div style="background:var(--bg-elevated); border-radius:99px; height:5px; margin-bottom:16px; overflow:hidden;">
            <div style="height:5px; border-radius:99px; width:${pctDia}%;
              background:${pctDia >= 100 ? 'linear-gradient(90deg,var(--success),#4ADE80)' : 'linear-gradient(90deg,var(--gold-dim),var(--gold))'};
              transition:width 1s ease;"></div>
          </div>
          ${activos.map(c => {
      const pctC = c.meta > 0 ? Math.min(200, Math.round((c.valorHoy / c.meta) * 100)) : 0;
      const critico = pctC > 100;
      const valorFmt = Number(c.valorHoy || 0).toLocaleString('es-CO');
      const metaFmt = Number(c.meta || 0).toLocaleString('es-CO');
      return `
              <div class="tappable" style="display:flex; align-items:center; gap:10px; padding:12px 0;
                border-bottom:1px solid var(--border);" onclick="selectMission('${c.id}')">
                <div style="font-size:26px; flex-shrink:0;">${c.emoji}</div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13px; font-weight:700; color:var(--text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.nombre}</div>
                  <div style="font-size:11px; color:var(--text-3); margin-top:2px;">
                    ${c.hecho
          ? `<span style="color:${critico ? 'var(--fire)' : 'var(--success)'}; font-weight:700;">${valorFmt} ${c.unidad}</span> de ${metaFmt} ${c.unidad} — <strong style="color:${critico ? 'var(--fire)' : 'var(--success)'};">${pctC}%${critico ? ' 🔥' : ''}</strong>`
          : `Meta: <strong>${metaFmt} ${c.unidad}</strong>`
        }
                  </div>
                  ${c.hecho ? `
                    <div style="margin-top:6px; background:var(--bg-elevated); border-radius:99px; height:4px; overflow:hidden;">
                      <div style="height:4px; border-radius:99px; width:${Math.min(100, pctC)}%;
                        background:${critico ? 'linear-gradient(90deg,var(--fire-dim),var(--fire))' : 'linear-gradient(90deg,var(--gold-dim),var(--gold))'};">
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

  // Animar barras de área
  setTimeout(() => {
    document.querySelectorAll('[id^="abar-"]').forEach(el => {
      el.style.width = el.dataset.w || '0%';
    });
  }, 150);

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
  // Mantenido por compatibilidad (ya no es el handler principal del heatmap)
  let extra = '';
  if (isGlobal && total > 0) extra = `<br><span style="font-size:11px;color:var(--text-3);">${count}/${total} misiones</span>`;
  else if (!isGlobal && valor > 0) extra = `<br><span style="font-size:11px;color:var(--gold);">Vol: +${Number(valor).toLocaleString('es-CO')}</span>`;
  const msgs = ['<span style="color:var(--text-3);">Día vacío</span>', 'Soporte Vital', 'Cumplimiento Parcial', '<span style="color:var(--gold);">Día Ganado ⭐</span>', '<span style="color:var(--electric);font-weight:800;">Ejecución Élite ⚡</span>'];
  _createTooltip(element, (msgs[level] || msgs[0]) + extra);
}

// ══ DRILL-DOWN POR FECHA ═══════════════════════════════════════════════
function showDayDrilldown(idx, data, filtro) {
  if (!data) return;
  if (window.Telegram?.WebApp?.HapticFeedback)
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

  const isG = (filtro || 'GLOBAL') === 'GLOBAL';
  const historial = data.historial || {};
  const histList = historial[filtro] || historial.GLOBAL || [];
  const gH = d => {
    if (typeof d === 'object') return d;
    const n = Number(d) || 0;
    const p = n === 4 ? 100 : n === 3 ? 80 : n === 2 ? 60 : n === 1 ? 30 : 0;
    return { nivel: n, count: n>0?'?':0, total: n>0?'?':0, valor: 0, pct: p, fecha: '', dia: '' };
  };

  // idx is 0..27 logically for the heatmap grid (recent 28 days)
  // in histList (length 56), the recent 28 days are index 28 to 55
  const actualIdx = idx + 28;

  const cell = gH(histList[actualIdx] || 0);
  const fecha = cell.fecha || '';
  const diaNom = cell.dia || '';

  // Calcular fecha si no viene del backend
  const d = new Date(); d.setDate(d.getDate() - (27 - idx));
  const fechaDisplay = fecha || (d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' }));
  const esHoy = idx === 27;

  // Comparación con ayer (actualIdx-1)
  const cellAyer = actualIdx > 0 ? gH(histList[actualIdx - 1] || 0) : null;
  const cellSemanAnt = actualIdx >= 7 ? gH(histList[actualIdx - 7] || 0) : null;

  // Actividades del día (compromisos + estado)
  const compromisos = data.compromisos || [];
  const actividadesHtml = isG && compromisos.length > 0 ? compromisos.map(c => {
    const pctC = c.meta > 0 ? Math.min(200, Math.round((c.valorHoy / c.meta) * 100)) : 0;
    const cls = c.hecho ? (pctC >= 100 ? 'var(--success)' : 'var(--gold)') : 'var(--text-3)';
    return `
      <div class="drill-activity-item">
        <span style="font-size:20px;">${c.emoji}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--text-1);">${c.nombre}</div>
          <div style="font-size:11px;color:var(--text-3);">
            ${c.hecho ? `${Number(c.valorHoy || 0).toLocaleString('es-CO')} ${c.unidad}` : 'Sin reporte'}
          </div>
        </div>
        <div class="drill-activity-pct" style="color:${cls};">
          ${c.hecho ? pctC + '%' : '—'}
        </div>
      </div>`;
  }).join('') : '<p style="color:var(--text-3);font-size:13px;">Datos del día no disponibles en vista histórica.</p>';

  const nivelLabel = ['Vacío', 'Soporte Vital', 'Parcial', 'Día Ganado ⭐', 'Ejecución Élite ⚡'];
  const nivelColor = ['var(--text-3)', 'rgba(123,97,255,0.8)', 'rgba(123,97,255,1)', 'var(--success)', 'var(--gold)'];

  const html = `
    <div class="drill-backdrop" onclick="closeDrilldown()"></div>
    <div class="drill-sheet">
      <div class="drill-handle"></div>
      <div class="drill-date-title">${esHoy ? '🗓️ Hoy' : fechaDisplay}</div>
      <div class="drill-date-sub" style="color:${nivelColor[cell.nivel]};">${nivelLabel[cell.nivel] || 'Sin datos'}</div>

      <div class="drill-kpi-row">
        <div class="drill-kpi-box">
          <div class="drill-kpi-val" style="color:${nivelColor[cell.nivel]};">${cell.pct || 0}%</div>
          <div class="drill-kpi-lbl">Cumplim.</div>
        </div>
        <div class="drill-kpi-box">
          <div class="drill-kpi-val">${cell.count || 0}/${cell.total || 0}</div>
          <div class="drill-kpi-lbl">Misiones</div>
        </div>
        <div class="drill-kpi-box">
          <div class="drill-kpi-val" style="font-size:18px;">${(['0', 'I', 'II', 'III', 'IV'][cell.nivel]) || '0'}</div>
          <div class="drill-kpi-lbl">Nivel</div>
        </div>
      </div>

      ${(cellAyer || cellSemanAnt) ? `
      <div class="drill-compare-row">
        ${cellAyer ? `
        <div class="drill-compare-chip">
          <div class="label">← Ayer</div>
          <div class="val" style="color:${(cell.pct || 0) >= (cellAyer.pct || 0) ? 'var(--success)' : '#EF4444'};">
            ${cellAyer.pct || 0}% ${(cell.pct || 0) >= (cellAyer.pct || 0) ? '↑' : '↓'}
          </div>
        </div>`: ''}
        ${cellSemanAnt ? `
        <div class="drill-compare-chip">
          <div class="label">Sem. ant.</div>
          <div class="val" style="color:${(cell.pct || 0) >= (cellSemanAnt.pct || 0) ? 'var(--success)' : '#EF4444'};">
            ${cellSemanAnt.pct || 0}% ${(cell.pct || 0) >= (cellSemanAnt.pct || 0) ? '↑' : '↓'}
          </div>
        </div>`: ''}
      </div>`: ''}

      ${esHoy && isG ? `
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-3);margin-bottom:10px;">Estado de misiones hoy</div>
        ${actividadesHtml}
      `: ''}
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'drilldown-container';
  container.innerHTML = html;
  document.body.appendChild(container);

  // Marcar celda seleccionada
  document.querySelectorAll('.heatmap-day').forEach(el => el.classList.remove('heatmap-day--selected'));
  const sel = document.querySelector(`[data-idx="${idx}"]`);
  if (sel) sel.classList.add('heatmap-day--selected');
}

function closeDrilldown() {
  const el = document.getElementById('drilldown-container');
  if (el) {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.2s';
    setTimeout(() => el.remove(), 200);
  }
  document.querySelectorAll('.heatmap-day').forEach(el => el.classList.remove('heatmap-day--selected'));
}
