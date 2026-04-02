/**
 * 🏛️ LA ORDEN — onboarding_areas.js
 * Selección de Campos de Batalla (áreas) con grid visual premium
 */

const AREAS_CATALOG = [
  { id: 'SALUD_FISICA',   emoji: '🏃', nombre: 'Salud Física',      desc: 'Cuerpo como arma' },
  { id: 'SALUD_MENTAL',   emoji: '🧠', nombre: 'Mente Clara',        desc: 'Control total' },
  { id: 'FINANZAS',       emoji: '💰', nombre: 'Finanzas',           desc: 'Libertad real' },
  { id: 'PRODUCTIVIDAD',  emoji: '⚡', nombre: 'Productividad',      desc: 'Máximo rendimiento' },
  { id: 'RELACIONES',     emoji: '🤝', nombre: 'Relaciones',         desc: 'El círculo correcto' },
  { id: 'CRECIMIENTO',    emoji: '📚', nombre: 'Crecimiento',        desc: 'Ventaja cognitiva' },
  { id: 'ESPIRITUALIDAD', emoji: '🙏', nombre: 'Espiritualidad',     desc: 'Propósito profundo' },
  { id: 'PERSONALIZADO',  emoji: '🎯', nombre: 'Personalizado',      desc: 'Tu campo único' },
];

function renderObAreas() {
  const selected = OB.areas;
  return `
    <div id="ob-areas" style="min-height:100vh;padding-bottom:100px;">
      ${obProgressBar(2, 6)}

      <div style="padding:24px 20px 16px;">
        <div style="font-size:11px;letter-spacing:0.25em;color:var(--electric);text-transform:uppercase;margin-bottom:8px;">
          Paso 2 de 5
        </div>
        <div style="font-family:var(--font-head);font-size:22px;font-weight:800;
          color:var(--text-1);margin-bottom:6px;">
          Elige tus Campos de Batalla
        </div>
        <div style="font-size:13px;color:var(--text-3);line-height:1.6;">
          Los Arquitectos del 1% no se dispersan — conquistan una dimensión a la vez.<br>
          Elige dónde vas a reclamar soberanía.
        </div>
      </div>

      <!-- Grid de áreas -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 20px;" id="areasGrid">
        ${AREAS_CATALOG.map(a => {
          const sel = selected.includes(a.id);
          return `
            <div id="area-${a.id}" onclick="toggleArea('${a.id}')"
              style="background:${sel ? 'rgba(212,168,67,0.1)' : 'var(--bg-elevated)'};
                border:2px solid ${sel ? 'var(--gold)' : 'var(--border)'};
                border-radius:var(--r-lg);padding:20px 14px;cursor:pointer;
                transition:all 0.2s ease;position:relative;text-align:center;
                ${sel ? 'box-shadow:0 0 20px rgba(212,168,67,0.2);' : ''}">
              ${sel ? `<div style="position:absolute;top:8px;right:8px;
                width:18px;height:18px;border-radius:50%;
                background:var(--gold);display:flex;align-items:center;justify-content:center;
                font-size:10px;color:#000;font-weight:900;">✓</div>` : ''}
              <div style="font-size:32px;margin-bottom:8px;">${a.emoji}</div>
              <div style="font-weight:700;font-size:13px;color:${sel ? 'var(--gold)' : 'var(--text-1)'};
                margin-bottom:3px;">${a.nombre}</div>
              <div style="font-size:11px;color:var(--text-3);">${a.desc}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer sticky -->
      <div style="position:fixed;bottom:0;left:0;right:0;padding:16px 20px;
        background:linear-gradient(to top,var(--bg-base) 70%,transparent);
        display:flex;flex-direction:column;gap:8px;">

        <div style="text-align:center;font-size:12px;color:var(--text-3);" id="areasCounter">
          ${selected.length === 0 ? 'Selecciona al menos 1 campo' : `${selected.length} campo${selected.length > 1 ? 's' : ''} seleccionado${selected.length > 1 ? 's' : ''}`}
        </div>

        <button onclick="obAreasProceed()"
          id="areasBtn"
          style="width:100%;padding:16px;border:none;border-radius:var(--r-lg);cursor:pointer;
            font-family:var(--font-head);font-size:15px;font-weight:800;letter-spacing:0.05em;
            ${selected.length > 0
              ? 'background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.3);'
              : 'background:var(--bg-elevated);color:var(--text-3);'
            }
            transition:all 0.3s ease;">
          ${selected.length > 0 ? '⚔️ AVANZAR — DEFINIR MIS COMPROMISOS ⟩' : 'Selecciona tus campos primero'}
        </button>
      </div>
    </div>
  `;
}

function toggleArea(areaId) {
  const idx = OB.areas.indexOf(areaId);
  if (idx === -1) {
    OB.areas.push(areaId);

    // ── MAGIA DE PREFETCH SILENCIOSO (Zero Latency) ──
    // Justo al momento en que The user de selecciona un área, mandamos a descargar 
    // su catálogo del servidor de forma silenciosa en segundo plano.
    // Mientras la persona lee y avanza de pantalla (tarda ~4-8 segs), los datos 
    // se cargarán. Resultado: cero pantalla de "Cargando" y datos 100% frescos.
    try {
      if (typeof fetchCatalog !== 'undefined' && typeof _catalogCache !== 'undefined') {
        if (!_catalogCache[areaId]) {
          fetchCatalog(areaId).then(data => {
            if (data && data.length > 0) _catalogCache[areaId] = data;
          }).catch(() => {});
        }
      }
    } catch(e) {}

  } else {
    OB.areas.splice(idx, 1);
  }

  // Re-render el elemento específico para no perder scroll
  const el = document.getElementById(`area-${areaId}`);
  const sel = OB.areas.includes(areaId);
  if (el) {
    el.style.background   = sel ? 'rgba(212,168,67,0.1)' : 'var(--bg-elevated)';
    el.style.borderColor  = sel ? 'var(--gold)' : 'var(--border)';
    el.style.boxShadow    = sel ? '0 0 20px rgba(212,168,67,0.2)' : '';

    // Checkmark
    const check = el.querySelector('.area-check');
    if (sel && !check) {
      const c = document.createElement('div');
      c.className = 'area-check';
      c.style.cssText = 'position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:900;';
      c.textContent = '✓';
      el.appendChild(c);
    } else if (!sel && check) {
      check.remove();
    }

    // Nombre color
    const nombre = el.querySelectorAll('div')[2];
    if (nombre) nombre.style.color = sel ? 'var(--gold)' : 'var(--text-1)';
  }

  // Actualizar contador y botón
  const count   = OB.areas.length;
  const counter = document.getElementById('areasCounter');
  const btn     = document.getElementById('areasBtn');
  if (counter) counter.textContent = count === 0 ? 'Selecciona al menos 1 campo' : `${count} campo${count>1?'s':''} seleccionado${count>1?'s':''}`;
  if (btn) {
    btn.style.background = count > 0 ? 'linear-gradient(135deg,var(--gold-dim),var(--gold))' : 'var(--bg-elevated)';
    btn.style.color      = count > 0 ? '#0A0A0F' : 'var(--text-3)';
    btn.textContent      = count > 0 ? '⚔️ AVANZAR — DEFINIR MIS COMPROMISOS ⟩' : 'Selecciona tus campos primero';
  }

  // Vibración en Telegram
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

function obAreasProceed() {
  if (OB.areas.length === 0) return;
  OB.areaIndex = 0;
  obNext();
}
