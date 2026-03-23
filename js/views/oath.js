/**
 * 🏛️ LA ORDEN — views/oath.js
 * Vista del Juramento activo y contrato vigente
 */

function renderOath(data) {
  const { user, contrato, compromisos } = data;
  const { numero, inicio, fin, diasTotales, diasRestantes, renovaciones } = contrato;

  const porcentajeTranscurrido = Math.round(((diasTotales - diasRestantes) / diasTotales) * 100);
  const inicioFmt = new Date(inicio).toLocaleDateString('es-CO', { day:'numeric', month:'long' });
  const finFmt   = new Date(fin).toLocaleDateString('es-CO', { day:'numeric', month:'long', year:'numeric' });

  const urgencia = diasRestantes <= 5;
  const frecLabels = { DIARIO: 'Diario', L_V: 'Lun–Vie', FDS: 'Fines de semana', CUSTOM: 'Días específicos' };

  return `
    <div class="view" id="view-oath">

      <!-- PACTO ACTIVO -->
      <div class="oath-card">
        <div class="oath-contract-num">⚔️ Contrato #${numero} · ${renovaciones + 1}ª ejecución</div>
        <div class="flex" style="gap:16px; align-items:flex-end; margin-bottom:8px;">
          <div>
            <div class="oath-days-left" style="color:${urgencia ? 'var(--fire)' : 'var(--text-1)'};">${diasRestantes}</div>
            <div class="oath-days-label">${urgencia ? '⚠️ días para cierre' : 'días restantes'}</div>
          </div>
          <div style="flex:1; padding-bottom:6px;">
            <div class="flex between text-xs text-muted" style="margin-bottom:4px;">
              <span>${inicioFmt}</span>
              <span>${finFmt}</span>
            </div>
            <div class="prog-bar-wrap">
              <div class="prog-bar-fill ${urgencia ? '' : 'prog-bar-fill--gold'}"
                style="width:${porcentajeTranscurrido}%; background: ${urgencia ? 'linear-gradient(90deg, var(--fire-dim), var(--fire))' : ''};">
              </div>
            </div>
            <div class="text-xs text-muted" style="margin-top:4px; text-align:right;">${porcentajeTranscurrido}% ejecutado</div>
          </div>
        </div>

        ${urgencia ? `
          <div style="background:rgba(255,107,53,0.1); border:1px solid rgba(255,107,53,0.2); border-radius:var(--r-md); padding:10px 14px; margin-top:8px;">
            <div class="text-sm fw-600" style="color:var(--fire);">📅 Próximo cierre en ${diasRestantes} días</div>
            <div class="text-xs text-muted" style="margin-top:4px;">El sistema calculará tu ICD final y generará tu siguiente contrato.</div>
          </div>
        ` : ''}
      </div>

      <!-- COMPROMISOS SELLADOS -->
      <div class="card">
        <div class="section-title" style="margin-bottom:var(--s4);">Compromisos sellados</div>
        ${compromisos.map(c => `
          <div class="oath-commitment-item">
            <span class="oath-commitment-emoji">${c.emoji}</span>
            <span class="oath-commitment-name">${c.nombre}</span>
            <span class="oath-commitment-meta">${c.meta.toLocaleString('es-CO')} ${c.unidad} · Diario</span>
          </div>
        `).join('')}
      </div>

      <!-- STATS DEL CONTRATO -->
      <div class="card card--glass">
        <div class="section-title" style="margin-bottom:var(--s3);">Este contrato</div>
        <div class="stat-row">
          <div class="stat-chip">
            <div class="stat-val stat-val--gold" style="font-family:var(--font-head);">${diasTotales - diasRestantes}</div>
            <div class="stat-lbl">Días ejecutados</div>
          </div>
          <div class="stat-chip">
            <div class="stat-val" style="font-family:var(--font-head);">${compromisos.length}</div>
            <div class="stat-lbl">Pilares activos</div>
          </div>
        </div>
      </div>

      <!-- FRASE DEL JURAMENTO -->
      <div class="card" style="background: linear-gradient(145deg, rgba(212,168,67,0.06), rgba(123,97,255,0.03)); border-color:var(--border-gold); text-align:center; padding:var(--s6);">
        <div style="font-size:28px; margin-bottom:12px;">⚔️</div>
        <div class="fw-600" style="font-size:15px; color:var(--text-1); line-height:1.6; font-style:italic;">
          "El compromiso es la decisión de honrar una promesa mucho después de que el entusiasmo inicial haya desaparecido."
        </div>
        <div class="text-xs text-muted" style="margin-top:12px;">— Tu Juramento, ${inicioFmt}</div>
      </div>

      <!-- RANGO ACTUAL -->
      <div class="card flex" style="align-items:center; gap:var(--s4);">
        <div style="font-size:40px;">${user.rango.split(' ')[0]}</div>
        <div>
          <div class="text-xs text-muted uppercase ls-wide" style="margin-bottom:3px;">Tu Rango</div>
          <div class="fw-800" style="font-size:18px; font-family:var(--font-head); color:var(--gold);">
            ${user.rango.split(' ').slice(1).join(' ')}
          </div>
          <div class="text-xs text-muted" style="margin-top:4px;">
            🌱→⚔️→🛡️→🔱→💎→🏛️→👁️
          </div>
        </div>
      </div>

    </div>
  `;
}
