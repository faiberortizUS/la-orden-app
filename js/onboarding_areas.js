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
    <div id="ob-areas" style="min-height:100vh;padding-bottom:120px; background:radial-gradient(circle at top left, #1a1610, #0A0A0F);">
      ${obProgressBar(2, 6)}

      <div style="padding:28px 24px 20px;">
        <div style="font-size:11px;letter-spacing:0.25em;color:var(--gold);text-transform:uppercase;margin-bottom:12px;">
          Paso 2 de 6
        </div>
        <div style="font-family:var(--font-head);font-size:32px;font-weight:900;
          color:var(--text-1);line-height:1.1;letter-spacing:0.02em;margin-bottom:16px;">
          Terreno de Operaciones
        </div>
        <div style="font-size:15px;color:var(--text-3);line-height:1.6;">
          Los arquitectos del 1% no atacan al azar. <b style="color:var(--text-2);">Conquistan una dimensión a la vez.</b><br><br>Selecciona los campos donde reclamarás soberanía absoluta.
        </div>
      </div>

      <!-- Lista de áreas premium -->
      <div style="display:flex;flex-direction:column;gap:14px;padding:0 24px;" id="areasGrid">
        ${AREAS_CATALOG.map(a => {
          const sel = selected.includes(a.id);
          return `
            <div id="area-${a.id}" class="area-card ${sel ? 'active' : ''}" onclick="toggleArea('${a.id}')">
               <div class="area-bg-glow"></div>
               <div class="area-content">
                  <div class="area-icon-wrap">
                     <span class="area-emoji">${a.emoji}</span>
                  </div>
                  <div class="area-info">
                     <div class="area-name">${a.nombre}</div>
                     <div class="area-desc">${a.desc}</div>
                  </div>
                  <div class="area-checkbox">
                     <div class="area-check-inner">✓</div>
                  </div>
               </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer sticky con blur -->
      <div style="position:fixed;bottom:0;left:0;right:0;padding:20px 24px 24px;
        background:linear-gradient(to top, rgba(10,10,15,1) 50%, rgba(10,10,15,0) 100%);
        backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
        display:flex;flex-direction:column;gap:12px;z-index:20;">

        <div style="text-align:center;font-size:12px;color:var(--text-3);font-weight:600;" id="areasCounter">
          ${selected.length === 0 ? 'Debes seleccionar al menos 1 campo' : `${selected.length} campo${selected.length > 1 ? 's' : ''} seleccionado${selected.length > 1 ? 's' : ''}`}
        </div>

        <button onclick="obAreasProceed()"
          id="areasBtn" class="btn-premium"
          style="width:100%;height:56px;display:flex;align-items:center;justify-content:center;
            border-radius:var(--r-xl);font-family:var(--font-head);font-size:15px;font-weight:800;letter-spacing:0.04em;
            transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            ${selected.length > 0
              ? 'background:linear-gradient(135deg, var(--gold-dim), var(--gold)); color:#0A0A0F; box-shadow:0 8px 24px rgba(212,168,67,0.3); transform:translateY(0);'
              : 'background:var(--bg-elevated); color:var(--text-3); box-shadow:none; transform:translateY(4px); opacity:0.8;'
            }">
          ${selected.length > 0 ? 'FORJAR MIS COMPROMISOS ⟩' : 'ESPERANDO ÓRDENES'}
        </button>
      </div>
    </div>
  `;
}

function toggleArea(areaId) {
  const idx = OB.areas.indexOf(areaId);
  const el = document.getElementById(`area-${areaId}`);
  
  if (idx === -1) {
    OB.areas.push(areaId);
    if (el) el.classList.add('active');

    // ── MAGIA DE PREFETCH SILENCIOSO (Zero Latency) ──
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
    if (el) el.classList.remove('active');
  }

  // Actualizar contador y botón
  const count   = OB.areas.length;
  const counter = document.getElementById('areasCounter');
  const btn     = document.getElementById('areasBtn');
  
  if (counter) {
    counter.textContent = count === 0 ? 'Debes seleccionar al menos 1 campo' : `${count} logístic${count>1?'as':'a'} en preparación`;
    counter.style.color = count > 0 ? 'var(--gold)' : 'var(--text-3)';
  }
  
  if (btn) {
    if (count > 0) {
      btn.style.background = 'linear-gradient(135deg, var(--gold-dim), var(--gold))';
      btn.style.color = '#0A0A0F';
      btn.style.boxShadow = '0 8px 24px rgba(212,168,67,0.3)';
      btn.style.transform = 'translateY(0)';
      btn.style.opacity = '1';
      btn.textContent = 'FORJAR MIS COMPROMISOS ⟩';
    } else {
      btn.style.background = 'var(--bg-elevated)';
      btn.style.color = 'var(--text-3)';
      btn.style.boxShadow = 'none';
      btn.style.transform = 'translateY(4px)';
      btn.style.opacity = '0.8';
      btn.textContent = 'ESPERANDO ÓRDENES';
    }
  }

  // Vibración Haptic
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

function obAreasProceed() {
  if (OB.areas.length === 0) {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
    return;
  }
  OB.areaIndex = 0;
  obNext();
}
