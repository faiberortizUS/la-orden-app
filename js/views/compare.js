/**
 * 🏛️ LA ORDEN — views/compare.js
 * Oráculo Comparativo — Módulo de Inteligencia Cruzada
 */

let currentCompareSubTab = 'PERIOD'; // 'PERIOD' | 'DAY_VS_DAY' | 'MISSION_VS_MISSION'
let comparePeriodRange = '7D'; // '7D' | '28D'
let compareDayA = 0; // index in historial (0 = 55 days ago, 27 = hoy, 55 = hoy) - wait, _getHistorial56diasBatched starts at 55 down to 0, so idx 55 is today, idx 0 is -55 days.
let compareDayB = 1; 
let compareMissionA = 'GLOBAL';
let compareMissionB = 'GLOBAL';

function renderCompare(data) {
  const { user, compromisos, historial } = data;
  const compromisosList = compromisos || [];
  
  // historial array length is 56 based on Phase 1. 
  // index 55 = hoy, index 0 = 55 days ago. 
  // Wait, in _getHistorial56diasBatched: for (var i = 55; i >= 0; i--) array.push(...) 
  // so index 0 corresponds to (hoy - 55), index 55 corresponds to hoy.

  const gH = d => {
    if (typeof d === 'object') return d;
    const n = Number(d) || 0;
    const p = n === 4 ? 100 : n === 3 ? 80 : n === 2 ? 60 : n === 1 ? 30 : 0;
    return { nivel: n, count: n>0?'?':0, total: n>0?'?':0, valor: 0, pct: p, fecha: '', dia: '' };
  };

  const getHeatData = (list) => list.length === 56 ? list : Array(56).fill(0);
  const histGlobal = getHeatData(historial ? (historial.GLOBAL || []) : []);

  // Tabs for Sub Mode
  const subTabs = `
    <div style="display:flex; background:rgba(0,0,0,0.4); border-radius:12px; padding:4px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.05);">
        <div class="tappable" onclick="changeCompareSubTab('PERIOD')" style="flex:1; text-align:center; padding:10px; border-radius:8px; font-size:12px; font-weight:700; transition:all 0.2s; ${currentCompareSubTab === 'PERIOD' ? 'background:rgba(212,168,67,0.15); color:var(--gold);' : 'color:var(--text-3);'}">Período</div>
        <div class="tappable" onclick="changeCompareSubTab('DAY_VS_DAY')" style="flex:1; text-align:center; padding:10px; border-radius:8px; font-size:12px; font-weight:700; transition:all 0.2s; ${currentCompareSubTab === 'DAY_VS_DAY' ? 'background:rgba(212,168,67,0.15); color:var(--gold);' : 'color:var(--text-3);'}">Día vs Día</div>
        <div class="tappable" onclick="changeCompareSubTab('MISSION_VS_MISSION')" style="flex:1; text-align:center; padding:10px; border-radius:8px; font-size:12px; font-weight:700; transition:all 0.2s; ${currentCompareSubTab === 'MISSION_VS_MISSION' ? 'background:rgba(212,168,67,0.15); color:var(--gold);' : 'color:var(--text-3);'}">Misión</div>
    </div>
  `;

  let contentHtml = '';

  if (currentCompareSubTab === 'PERIOD') {
    // 7D vs Previous 7D
    // Array order: index 55 (today), index 49 (today - 6) => current 7D is slice(49, 56)
    // Previous 7D is slice(42, 49)
    // Month vs Month: current Month is slice(28, 56), prev Month is slice(0, 28)
    const is7D = comparePeriodRange === '7D';
    const cSize = is7D ? 7 : 28;
    const pEnd = 56;
    const p1Start = pEnd - cSize;
    const p2Start = p1Start - cSize;

    const currPeriod = histGlobal.slice(p1Start, pEnd).map(gH);
    const prevPeriod = histGlobal.slice(p2Start, p1Start).map(gH);

    const currPct = Math.round(currPeriod.reduce((a,b)=>a+(b.pct||0),0)/cSize);
    const prevPct = Math.round(prevPeriod.reduce((a,b)=>a+(b.pct||0),0)/cSize);
    
    // Cobertura is only reliably extracted if count & total are present, else we approximate via pct
    const currCob = Math.round(currPeriod.map(d=>d.total>0?((d.count/d.total)*100):0).reduce((a,b)=>a+b,0)/cSize);
    const prevCob = Math.round(prevPeriod.map(d=>d.total>0?((d.count/d.total)*100):0).reduce((a,b)=>a+b,0)/cSize);

    const dfPct = currPct - prevPct;
    const dfCob = currCob - prevCob;

    contentHtml = `
      <div class="card stagger-up stagger-1">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
           <div class="section-title" style="margin:0;">Matriz Temporal</div>
           <select onchange="changeComparePeriodRange(this.value)" style="background:var(--bg-overlay); border:1px solid rgba(212,168,67,0.4); border-radius:6px; color:var(--text-1); font-family:var(--font-head); font-size:12px; padding:4px 8px; outline:none;">
             <option value="7D" ${is7D?'selected':''}>Últimos 7 Días</option>
             <option value="28D" ${!is7D?'selected':''}>Mes vs Mes (28D)</option>
           </select>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- Cumplimiento -->
          <div style="background:rgba(0,0,0,0.4); border-radius:12px; padding:16px; border:1px solid rgba(255,255,255,0.03);">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700; margin-bottom:12px;">Cumplimiento Operativo</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div>
                <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Período Actual</div>
                <div style="font-family:var(--font-head); font-size:24px; font-weight:900; color:var(--text-1);">${currPct}%</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Período Anterior</div>
                <div style="font-family:var(--font-head); font-size:18px; font-weight:800; color:var(--text-2);">${prevPct}%</div>
              </div>
            </div>
            <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:600; color:var(--text-3);">Diferencial</span>
              <span style="font-size:14px; font-weight:800; color:${dfPct > 0 ? 'var(--success)' : dfPct < 0 ? '#EF4444' : 'var(--text-3)'};">${dfPct > 0 ? '+'+dfPct : dfPct}%</span>
            </div>
          </div>

          <!-- Cobertura -->
          <div style="background:rgba(0,0,0,0.4); border-radius:12px; padding:16px; border:1px solid rgba(255,255,255,0.03);">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-3); font-weight:700; margin-bottom:12px;">Cobertura (Misiones)</div>
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div>
                <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Período Actual</div>
                <div style="font-family:var(--font-head); font-size:24px; font-weight:900; color:var(--text-1);">${currCob}%</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Período Anterior</div>
                <div style="font-family:var(--font-head); font-size:18px; font-weight:800; color:var(--text-2);">${prevCob}%</div>
              </div>
            </div>
            <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:600; color:var(--text-3);">Diferencial</span>
              <span style="font-size:14px; font-weight:800; color:${dfCob > 0 ? 'var(--electric)' : dfCob < 0 ? '#EF4444' : 'var(--text-3)'};">${dfCob > 0 ? '+'+dfCob : dfCob}%</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }
  else if (currentCompareSubTab === 'DAY_VS_DAY') {
    const dayOptions = histGlobal.map((d, i) => {
      const hd = gH(d);
      const fd = new Date(); fd.setDate(fd.getDate() - (55 - i));
      const lbl = hd.fecha || fd.toLocaleDateString('es-CO', { weekday:'short', day:'numeric', month:'short' });
      return `<option value="${i}">${i === 55 ? 'Hoy' : lbl}</option>`;
    });

    const dA = gH(histGlobal[compareDayA]);
    const dB = gH(histGlobal[compareDayB]);

    contentHtml = `
      <div class="card stagger-up stagger-1">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
           <div class="section-title" style="margin:0;">Frente a Frente</div>
        </div>
        <div style="display:flex; gap:10px; margin-bottom:20px;">
          <div style="flex:1;">
            <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Día A</div>
            <select onchange="changeCompareDayA(this.value)" style="width:100%; background:var(--bg-overlay); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:var(--text-1); font-family:var(--font-head); font-size:13px; padding:8px; outline:none;">
              ${dayOptions.map((opt, i) => opt.replace('value="'+i+'"', 'value="'+i+'"'+(i===compareDayA?' selected':''))).join('')}
            </select>
          </div>
          <div style="display:flex; align-items:center; justify-content:center; width:24px; padding-top:18px; color:var(--text-3); font-weight:900;">VS</div>
          <div style="flex:1;">
            <div style="font-size:10px; color:var(--text-3); margin-bottom:4px;">Día B</div>
            <select onchange="changeCompareDayB(this.value)" style="width:100%; background:var(--bg-overlay); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:var(--text-1); font-family:var(--font-head); font-size:13px; padding:8px; outline:none;">
              ${dayOptions.map((opt, i) => opt.replace('value="'+i+'"', 'value="'+i+'"'+(i===compareDayB?' selected':''))).join('')}
            </select>
          </div>
        </div>

        <!-- Métrica Cumplimiento -->
        <div style="display:flex; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--border);">
           <div style="flex:1; text-align:center;">
             <div style="font-family:var(--font-head); font-size:24px; font-weight:900; color:${dA.pct >= 100 ? 'var(--success)' : 'var(--text-1)'};">${dA.pct}%</div>
           </div>
           <div style="width:80px; text-align:center; display:flex; flex-direction:column; justify-content:center; font-size:11px; font-weight:700; color:var(--text-3); text-transform:uppercase;">Cumplim</div>
           <div style="flex:1; text-align:center;">
             <div style="font-family:var(--font-head); font-size:24px; font-weight:900; color:${dB.pct >= 100 ? 'var(--success)' : 'var(--text-1)'};">${dB.pct}%</div>
           </div>
        </div>

        <!-- Métrica Misiones -->
        <div style="display:flex; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--border);">
           <div style="flex:1; text-align:center;">
             <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--gold);">${dA.count}/${dA.total}</div>
           </div>
           <div style="width:80px; text-align:center; display:flex; flex-direction:column; justify-content:center; font-size:11px; font-weight:700; color:var(--text-3); text-transform:uppercase;">Misiones</div>
           <div style="flex:1; text-align:center;">
             <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--gold);">${dB.count}/${dB.total}</div>
           </div>
        </div>

      </div>
    `;
  }
  else if (currentCompareSubTab === 'MISSION_VS_MISSION') {
    const missOptions = compromisosList.map(c => `<option value="${c.id}">${c.emoji} ${c.nombre.substring(0,20)}</option>`);
    missOptions.unshift(`<option value="GLOBAL">🌍 Global (Todas)</option>`);

    const mAId = compareMissionA;
    const mBId = compareMissionB;

    const histA = getHeatData(historial[mAId] || historial.GLOBAL || []).map(gH);
    const histB = getHeatData(historial[mBId] || historial.GLOBAL || []).map(gH);

    // Sumamos volumenes en los últimos 28 dias
    // Note subset 28 for mission (slice 28, 56) to make it highly relevant
    const sliceA = histA.slice(28, 56);
    const sliceB = histB.slice(28, 56);

    const volA = sliceA.reduce((s, d) => s + (mAId === 'GLOBAL'? (Number(d.count)||0) : (Number(d.valor)||0)), 0);
    const volB = sliceB.reduce((s, d) => s + (mBId === 'GLOBAL'? (Number(d.count)||0) : (Number(d.valor)||0)), 0);
    const pctA = Math.round(sliceA.reduce((s, d) => s + (d.pct||0), 0) / 28);
    const pctB = Math.round(sliceB.reduce((s, d) => s + (d.pct||0), 0) / 28);

    const compA = mAId === 'GLOBAL' ? { unidad: 'misiones', emoji: '🌍' } : compromisosList.find(c=>c.id===mAId) || {};
    const compB = mBId === 'GLOBAL' ? { unidad: 'misiones', emoji: '🌍' } : compromisosList.find(c=>c.id===mBId) || {};

    contentHtml = `
      <div class="card stagger-up stagger-1">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
           <div class="section-title" style="margin:0;">Disputa de Prioridades <span style="font-size:10px;font-weight:400;color:var(--text-3);">(Últimos 28d)</span></div>
        </div>
        <div style="display:flex; gap:10px; margin-bottom:20px;">
          <div style="flex:1;">
            <select onchange="changeCompareMissionA(this.value)" style="width:100%; background:var(--bg-overlay); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:var(--text-1); font-family:var(--font-head); font-size:13px; padding:8px; outline:none; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${missOptions.map(opt => opt.replace('value="'+mAId+'"', 'value="'+mAId+'" selected')).join('')}
            </select>
          </div>
          <div style="display:flex; align-items:center; justify-content:center; width:24px; color:var(--text-3); font-weight:900;">VS</div>
          <div style="flex:1;">
            <select onchange="changeCompareMissionB(this.value)" style="width:100%; background:var(--bg-overlay); border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:var(--text-1); font-family:var(--font-head); font-size:13px; padding:8px; outline:none; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${missOptions.map(opt => opt.replace('value="'+mBId+'"', 'value="'+mBId+'" selected')).join('')}
            </select>
          </div>
        </div>

        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border);">
          <!-- Header T -->
          <div style="display:flex; background:rgba(0,0,0,0.5); padding:10px; border-bottom:1px solid var(--border); font-size:10px; font-weight:700; color:var(--text-3); text-transform:uppercase; text-align:center;">
             <div style="flex:1;">${compA.emoji} Lado A</div>
             <div style="width:60px;">Métrica</div>
             <div style="flex:1;">${compB.emoji} Lado B</div>
          </div>

          <!-- Cumplimiento -->
          <div style="display:flex; padding:16px 10px; border-bottom:1px solid var(--border); align-items:center;">
             <div style="flex:1; text-align:center;">
               <div style="font-family:var(--font-head); font-size:22px; font-weight:900; color:${pctA > pctB ? 'var(--electric)' : 'var(--text-1)'};">${pctA}%</div>
             </div>
             <div style="width:60px; text-align:center; font-size:10px; font-weight:700; color:var(--text-3); text-transform:uppercase;">Cumplim.</div>
             <div style="flex:1; text-align:center;">
               <div style="font-family:var(--font-head); font-size:22px; font-weight:900; color:${pctB > pctA ? 'var(--electric)' : 'var(--text-1)'};">${pctB}%</div>
             </div>
          </div>

          <!-- Volumen -->
          <div style="display:flex; padding:16px 10px; align-items:center;">
             <div style="flex:1; text-align:center;">
               <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--gold);">${Number(volA.toFixed(1)).toLocaleString('es-CO')}</div>
               <div style="font-size:9px; color:var(--text-3); margin-top:2px;">${compA.unidad || 'ud'}</div>
             </div>
             <div style="width:60px; text-align:center; font-size:10px; font-weight:700; color:var(--text-3); text-transform:uppercase;">Volumen</div>
             <div style="flex:1; text-align:center;">
               <div style="font-family:var(--font-head); font-size:20px; font-weight:800; color:var(--gold);">${Number(volB.toFixed(1)).toLocaleString('es-CO')}</div>
               <div style="font-size:9px; color:var(--text-3); margin-top:2px;">${compB.unidad || 'ud'}</div>
             </div>
          </div>
        </div>

      </div>
    `;
  }

  return `
    <div class="view" id="view-compare" style="padding-bottom: 32px; animation: modalBgIn 0.3s ease;">
      <!-- CABECERA EXPLICATIVA -->
      <div style="margin-bottom:20px;">
        <h2 style="font-family:var(--font-head); font-size:22px; font-weight:900; color:var(--text-1); margin-bottom:6px;">Modo Comparativa ⚖️</h2>
        <p style="font-size:14px; color:var(--text-2); line-height:1.5;">Cruza tus métricas históricas para auditar tu consistencia en el tiempo y prioridades.</p>
      </div>

      ${subTabs}
      ${contentHtml}

      <!-- Información Educativa -->
      <div style="margin-top:24px; padding:16px; background:rgba(212,168,67,0.05); border:1px solid rgba(212,168,67,0.2); border-radius:12px;">
         <div style="display:flex; gap:12px;">
           <span style="font-size:24px;">👁️</span>
           <div style="font-size:13px; color:var(--text-2); line-height:1.5;">
             La comparación sistemática (Self-Monitoring) es uno de los motores más robustos en neurociencia conductual. Al medirte contra tu yo anterior, cierras rutas de escape para el autoengaño.
           </div>
         </div>
      </div>
    </div>
  `;
}

// ── Controladores de Eventos Globales ──
window.changeCompareSubTab = function(tab) {
  currentCompareSubTab = tab;
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};

window.changeComparePeriodRange = function(val) {
  comparePeriodRange = val;
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};

window.changeCompareDayA = function(val) {
  compareDayA = parseInt(val);
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};

window.changeCompareDayB = function(val) {
  compareDayB = parseInt(val);
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};

window.changeCompareMissionA = function(val) {
  compareMissionA = val;
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};

window.changeCompareMissionB = function(val) {
  compareMissionB = val;
  if(window._appData) document.getElementById('viewContainer').innerHTML = window.renderStatsWrapper();
};
