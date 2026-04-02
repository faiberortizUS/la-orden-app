/**
 * 🏛️ LA ORDEN — views/oath.js
 * Vista del Juramento activo y contrato vigente
 *
 * CORRECCIONES:
 * - Si contrato === null → el usuario no ha firmado el juramento aún
 * - Días ejecutados = reportes reales, NO diferencia de fechas
 * - Progreso = 0 hasta que haya reportes registrados
 */

function renderOath(data) {
  const { user, contrato, compromisos, historial } = data;

  // ── Sin juramento firmado aún
  if (!contrato) {
    return `
      <div class="view" id="view-oath">
        <div class="oath-card" style="text-align:center; padding:var(--s8);">
          <div style="font-size:48px; margin-bottom:16px;">⚔️</div>
          <div class="fw-800 text-gold" style="font-size:20px; font-family:var(--font-head); margin-bottom:8px;">
            Tu Pacto de Acero te espera
          </div>
          <div class="text-sm text-muted" style="line-height:1.7; margin-bottom:20px;">
            Aún no has completado el proceso de activación.<br>
            Tu estructura y compromisos ya están diseñados.<br><br>
            Solo falta un paso: activar tu membresía para que el sistema empiece a vigilar y auditar tu disciplina en tiempo real.
          </div>
          <button onclick="resumePaymentOnboarding()" 
            style="width:100%;padding:14px;border:none;border-radius:var(--r-md);
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));
            color:#0A0A0F;font-family:var(--font-head);font-weight:800;font-size:15px;cursor:pointer;">
            🔓 ACTIVAR MI MEMBRESÍA
          </button>
        </div>
      </div>
    `;
  }

  // ── Con juramento firmado
  const { numero, inicio, fin, diasTotales, diasRestantes, renovaciones } = contrato;

  // Días reportados = días con al menos un log (nivel > 0 en historial)
  const globalHist = historial ? (historial.GLOBAL || []) : [];
  const diasConReporte = globalHist.filter(n => n > 0).length;

  // Progreso real = solo si hay reportes
  const diasEjecutados       = diasConReporte;
  const porcentajeTranscurrido = diasConReporte > 0
    ? Math.min(100, Math.round((diasConReporte / diasTotales) * 100))
    : 0;

  let inicioFmt = '—', finFmt = '—';
  try {
    inicioFmt = new Date(inicio).toLocaleDateString('es-CO', { day:'numeric', month:'long' });
    finFmt    = new Date(fin).toLocaleDateString('es-CO', { day:'numeric', month:'long', year:'numeric' });
  } catch(e) {}

  const urgencia    = diasRestantes <= 5;
  const frecLabels  = { DIARIO:'Diario', L_V:'Lun–Vie', FDS:'Fines de semana', CUSTOM:'Personalizado' };

  return `
    <div class="view" id="view-oath">

      ${urgencia ? '<div class="screen-flash-danger"></div>' : ''}

      <!-- PACTO ACTIVO -->
      <div class="oath-card stagger-up stagger-1 ${urgencia ? 'breathe-danger' : 'breathe-gold'}">
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
            <div class="text-xs text-muted" style="margin-top:4px; text-align:right;">
              ${diasConReporte > 0 ? porcentajeTranscurrido + '% de días con reporte' : 'Sin reportes aún'}
            </div>
          </div>
        </div>

        ${urgencia ? `
          <div style="background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.2);border-radius:var(--r-md);padding:10px 14px;margin-top:8px;">
            <div class="text-sm fw-600" style="color:var(--fire);">📅 Cierre en ${diasRestantes} días</div>
            <div class="text-xs text-muted" style="margin-top:4px;">El sistema calculará tu ICD final y generará tu siguiente contrato.</div>
          </div>
        ` : ''}
      </div>

      <!-- COMPROMISOS SELLADOS -->
      <div class="card stagger-up stagger-2">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--s4);">
          <div class="section-title" style="margin:0;">Compromisos sellados</div>
          <button onclick="navigateTo('add_habit')" class="tappable" style="background:none;border:none;color:var(--gold);font-family:var(--font-head);font-weight:700;font-size:13px;letter-spacing:0.05em;padding:4px 0;">+ AÑADIR</button>
        </div>
        ${compromisos.length > 0 ? compromisos.map(c => `
          <div class="oath-commitment-item">
            <span class="oath-commitment-emoji">${c.emoji}</span>
            <span class="oath-commitment-name">${c.nombre}</span>
            <span class="oath-commitment-meta">${Number(c.meta).toLocaleString('es-CO')} ${c.unidad} · ${frecLabels[c.frecuencia] || 'Diario'}</span>
          </div>
        `).join('') : `
          <div class="text-sm text-muted" style="padding:12px 0;">
            Tus compromisos se mostrarán aquí una vez firmado el juramento.
          </div>
        `}
      </div>

      <!-- STATS DEL CONTRATO -->
      <div class="card card--glass stagger-up stagger-3">
        <div class="section-title" style="margin-bottom:var(--s3);">Este contrato</div>
        <div class="stat-row">
          <div class="stat-chip tappable" onclick="showInteractiveModal('Días Ejecutados', 'De los 30 días fijados en este contrato cerrado, este número certifica el peso real de tu esfuerzo.<br><br><b>🎯 Objetivo base:</b> Renovar tus contratos al final del periodo contabilizando al menos 25 días ejecutados para reclamar el éxito táctico y certificar tu disciplina.', '📜')">
            <div class="stat-val stat-val--gold" style="font-family:var(--font-head);">${diasEjecutados}</div>
            <div class="stat-lbl">Días con reporte</div>
          </div>
          <div class="stat-chip tappable" onclick="showInteractiveModal('Cargar la Cruz (Pilares)', 'El número de promesas simultáneas (hábitos) que sostienes bajo este contrato sin excusas.<br><br>Solo los miembros puramente élites mantienen su palabra de honor inquebrantable en más de 4 áreas a la vez durante mucho tiempo.', '🏛️')">
            <div class="stat-val" style="font-family:var(--font-head);">${compromisos.length}</div>
            <div class="stat-lbl">Pilares activos</div>
          </div>
        </div>
      </div>

      <!-- FRASE DEL JURAMENTO -->
      <div class="card" style="background:linear-gradient(145deg,rgba(212,168,67,0.06),rgba(123,97,255,0.03));border-color:var(--border-gold);text-align:center;padding:var(--s6);">
        <div style="font-size:28px;margin-bottom:12px;">⚔️</div>
        <div class="fw-600" style="font-size:15px;color:var(--text-1);line-height:1.6;font-style:italic;">
          "El compromiso es la decisión de honrar una promesa mucho después de que el entusiasmo inicial haya desaparecido."
        </div>
        <div class="text-xs text-muted" style="margin-top:12px;">— Tu Juramento, ${inicioFmt}</div>
      </div>

      <!-- RANGO ACTUAL -->
      <div class="card flex stagger-up stagger-4 tappable" style="align-items:center;gap:var(--s4);" onclick="showInteractiveModal('Escala de Dominio Jerárquico', 'Tu rango impone a la Célula cuánto peso y Puntos de Poder (PC) has acumulado triturando la debilidad.<br><br><b>🌱 Aspirante</b> — Punto de partida.<br><b>⚔️ Iniciado</b> — Acceso al sistema.<br><b>🛡️ Comprometido</b> — ICD ≥60 · 7 días.<br><b>🔱 Disciplinado</b> — ICD ≥70 · 14 días.<br><b>💎 Consistente</b> — ICD ≥80 · 30 días · 1 contrato.<br><b>🏛️ Arquitecto</b> — ICD ≥85 · 60 días · 2 contratos.<br><b>👁️ Custodio</b> — ICD ≥90 · 90 días · 3 contratos.<br><br>⚠️ Sin acción diaria el rango cae. El ICD que construiste hoy, lo pierdes mañana si no reportas. Sella tu próxima victoria para sostener el trono.', '🏛️')">
        <div style="font-size:40px;">${(user.rango || '🌱').split(' ')[0]}</div>
        <div>
          <div class="text-xs text-muted uppercase ls-wide" style="margin-bottom:3px;">Tu Rango</div>
          <div class="fw-800" style="font-size:18px;font-family:var(--font-head);color:var(--gold);">
            ${(user.rango || '🌱 Aspirante').split(' ').slice(1).join(' ')}
          </div>
          <div class="text-xs text-muted" style="margin-top:4px;">🌱→⚔️→🛡️→🔱→💎→🏛️→👁️</div>
        </div>
      </div>

      <!-- ACCIÓN PRINCIPAL DEL PACTO -->
      <div class="stagger-up stagger-5" style="padding:8px 0 24px;">
        <button onclick="navigateTo('add_habit')" class="tappable"
          style="width:100%;padding:18px 24px;border:none;border-radius:var(--r-lg);
            font-family:var(--font-head);font-size:15px;font-weight:900;color:#0A0A0F;letter-spacing:0.06em;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));
            box-shadow:0 0 30px rgba(212,168,67,0.25);
            display:flex;align-items:center;justify-content:center;gap:10px;">
          ⚔️ FORJAR NUEVO COMPROMISO
        </button>
        <div style="text-align:center;margin-top:10px;font-size:11px;color:var(--text-3);line-height:1.5;">
          Cada compromiso nuevo exige más de ti. Solo añade lo que puedas cumplir con honor.
        </div>
      </div>

    </div>
  `;
}
