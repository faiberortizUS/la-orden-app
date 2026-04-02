/**
 * 🏛️ LA ORDEN — onboarding_commitments.js
 * Selección de compromisos por área, con meta y frecuencia
 * Catálogo cargado desde GAS backend
 */

// Catálogo local embebido como fallback (GAS sirve el definitivo)
const CATALOG_LOCAL = {
  SALUD_FISICA:   [
    { id: 'SF_CARDIO',  nombre: 'Ejercicio cardiovascular', unidad: 'min', pcBase: 30, metaDef: 30 },
    { id: 'SF_FUERZA',  nombre: 'Entrenamiento de fuerza',  unidad: 'min', pcBase: 30, metaDef: 45 },
    { id: 'SF_PASOS',   nombre: 'Pasos diarios',           unidad: 'pasos', pcBase: 25, metaDef: 8000 },
    { id: 'SF_AGUA',    nombre: 'Hidratación',              unidad: 'vasos', pcBase: 20, metaDef: 8 },
    { id: 'SF_SUENIO',  nombre: 'Horas de sueño',          unidad: 'hrs', pcBase: 25, metaDef: 7 },
  ],
  SALUD_MENTAL:   [
    { id: 'SM_MEDIT',   nombre: 'Meditación',               unidad: 'min', pcBase: 25, metaDef: 10 },
    { id: 'SM_DIARIO',  nombre: 'Diario personal',          unidad: 'min', pcBase: 20, metaDef: 10 },
    { id: 'SM_GRATIT',  nombre: 'Gratitud diaria',          unidad: 'items', pcBase: 15, metaDef: 3 },
    { id: 'SM_DIGITAL', nombre: 'Detox digital',            unidad: 'hrs', pcBase: 25, metaDef: 2 },
  ],
  FINANZAS:       [
    { id: 'FIN_AHORRO', nombre: 'Ahorro diario',            unidad: 'COP', pcBase: 30, metaDef: 10000 },
    { id: 'FIN_REVIEW', nombre: 'Revisión financiera',      unidad: 'min', pcBase: 20, metaDef: 10 },
    { id: 'FIN_INVEST',  nombre: 'Estudio de inversiones',  unidad: 'min', pcBase: 25, metaDef: 20 },
  ],
  PRODUCTIVIDAD:  [
    { id: 'PRO_DEEP',   nombre: 'Deep Work',                unidad: 'min', pcBase: 35, metaDef: 90 },
    { id: 'PRO_TAREAS', nombre: 'Tareas completadas',       unidad: 'tareas', pcBase: 25, metaDef: 3 },
    { id: 'PRO_BLOQUES',nombre: 'Bloques de tiempo',        unidad: 'bloques', pcBase: 25, metaDef: 4 },
    { id: 'PRO_NOTICIAS',nombre: 'Sin redes sociales',      unidad: 'hrs', pcBase: 20, metaDef: 4 },
  ],
  RELACIONES:     [
    { id: 'REL_CONV',   nombre: 'Conversación significativa',unidad: 'conv', pcBase: 20, metaDef: 1 },
    { id: 'REL_RED',    nombre: 'Networking activo',         unidad: 'contactos', pcBase: 25, metaDef: 1 },
    { id: 'REL_FAMILIA',nombre: 'Tiempo en familia',         unidad: 'min', pcBase: 20, metaDef: 30 },
  ],
  CRECIMIENTO:    [
    { id: 'CRE_LECT',   nombre: 'Lectura',                  unidad: 'pág', pcBase: 25, metaDef: 20 },
    { id: 'CRE_CURSO',  nombre: 'Aprendizaje estructurado', unidad: 'min', pcBase: 30, metaDef: 30 },
    { id: 'CRE_POD',    nombre: 'Podcast / audiolibro',     unidad: 'min', pcBase: 20, metaDef: 30 },
  ],
  ESPIRITUALIDAD: [
    { id: 'ESP_ORACION', nombre: 'Oración / meditación',   unidad: 'min', pcBase: 20, metaDef: 15 },
    { id: 'ESP_SILENCIO',nombre: 'Silencio intencional',    unidad: 'min', pcBase: 20, metaDef: 10 },
    { id: 'ESP_PROP',    nombre: 'Reflexión de propósito',  unidad: 'min', pcBase: 20, metaDef: 10 },
  ],
  PERSONALIZADO:  [
    { id: 'PER_CUSTOM1', nombre: 'Mi compromiso 1',         unidad: 'reps', pcBase: 25, metaDef: 1 },
    { id: 'PER_CUSTOM2', nombre: 'Mi compromiso 2',         unidad: 'reps', pcBase: 25, metaDef: 1 },
  ],
};

const FREQ_OPTIONS = [
  { id: 'DIARIO', label: 'Todos los días', emoji: '📅' },
  { id: 'L_V',    label: 'Lunes a viernes', emoji: '💼' },
  { id: 'FDS',    label: 'Fines de semana', emoji: '🌅' },
];

// Catálogo cargado desde GAS (se sobrescribe si el backend responde)
let _catalogCache = {};

async function renderObCommitmentsAsync(container) {
  container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;">
    <div style="text-align:center;color:var(--text-3);">
      <div style="font-size:40px;margin-bottom:12px;">⚔️</div>
      <div>Cargando tu arsenal...</div>
    </div>
  </div>`;

  const areaId = OB.areas[OB.areaIndex];
  const area   = AREAS_CATALOG.find(a => a.id === areaId);

  // Intentar cargar del backend, fallback al catálogo local
  if (!_catalogCache[areaId]) {
    try {
      const data = await fetchCatalog(areaId);
      _catalogCache[areaId] = (data && data.length > 0) ? data : CATALOG_LOCAL[areaId] || [];
    } catch(e) {
      _catalogCache[areaId] = CATALOG_LOCAL[areaId] || [];
    }
  }

  container.innerHTML = renderObCommitments(area, _catalogCache[areaId]);
  container.scrollTop = 0;
}

function renderObCommitments(area, catalog) {
  const areaIdx  = OB.areaIndex;
  const totalAreas = OB.areas.length;
  const already  = OB.compromisos.filter(c => c.areaId === area.id);
  const selected = already.map(c => c.compromisoId);

  return `
    <div id="ob-commitments" style="min-height:100vh;padding-bottom:120px;">
      ${obProgressBar(3, 6)}

      <div style="padding:24px 20px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div style="font-size:11px;letter-spacing:0.25em;color:var(--electric);text-transform:uppercase;">
            Área ${areaIdx + 1} de ${totalAreas}
          </div>
          <div style="display:flex;gap:4px;">
            ${OB.areas.map((a, i) => `<div style="width:8px;height:8px;border-radius:50%;
              background:${i <= areaIdx ? 'var(--gold)' : 'var(--border)'};"></div>`).join('')}
          </div>
        </div>
        <div style="font-size:28px;margin-bottom:4px;">${area.emoji}</div>
        <div style="font-family:var(--font-head);font-size:22px;font-weight:800;color:var(--text-1);margin-bottom:4px;">
          ${area.nombre}
        </div>
        <div style="font-size:13px;color:var(--text-3);">
          Selecciona qué compromisos vas a sellar en este campo de batalla.
        </div>
      </div>

      <!-- Lista de compromisos -->
      <div style="padding:0 20px;" id="commitmentsList">
        ${catalog.map(c => {
          const isSel = selected.includes(c.id);
          const comp  = already.find(x => x.compromisoId === c.id);
          return `
            <div id="comp-${c.id}" style="background:var(--bg-elevated);border:2px solid ${isSel ? 'var(--gold)' : 'var(--border)'};
              border-radius:var(--r-lg);margin-bottom:12px;overflow:hidden;
              ${isSel ? 'box-shadow:0 0 16px rgba(212,168,67,0.15);' : ''}
              transition:all 0.2s ease;">

              <!-- Header del compromiso -->
              <div onclick="toggleCommitment('${c.id}','${area.id}','${c.nombre}','${c.unidad}',${c.pcBase},${c.metaDef})"
                style="display:flex;align-items:center;gap:12px;padding:16px;cursor:pointer;">
                <div style="width:24px;height:24px;border-radius:50%;border:2px solid ${isSel ? 'var(--gold)' : 'var(--border)'};
                  background:${isSel ? 'var(--gold)' : 'transparent'};display:flex;align-items:center;justify-content:center;
                  font-size:12px;color:#000;font-weight:900;flex-shrink:0;">${isSel ? '✓' : ''}</div>
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:14px;color:${isSel ? 'var(--gold)' : 'var(--text-1)'};">${c.nombre}</div>
                  <div style="font-size:11px;color:var(--text-3);">Meta sugerida: ${c.metaDef.toLocaleString('es-CO')} ${c.unidad} · +${c.pcBase} PC</div>
                </div>
              </div>

              <!-- Formulario expandido cuando está seleccionado -->
              ${isSel ? `
                <div style="padding:0 16px 16px;border-top:1px solid rgba(212,168,67,0.15);">
                  <div style="font-size:12px;color:var(--text-3);margin:12px 0 6px;">¿Cuál es tu meta diaria?</div>
                  <div style="display:flex;gap:8px;align-items:center;">
                    <input type="number" id="meta-${c.id}" value="${comp ? comp.meta : c.metaDef}"
                      min="1" inputmode="numeric"
                      oninput="updateCompromiso('${c.id}','meta',this.value)"
                      style="flex:1;background:var(--bg-base);border:1px solid var(--border-gold);
                        border-radius:var(--r-md);color:var(--text-1);font-size:16px;
                        padding:10px 12px;outline:none;font-family:var(--font-body);" />
                    <span style="color:var(--text-3);font-size:13px;min-width:44px;">${c.unidad}</span>
                  </div>

                  <div style="font-size:12px;color:var(--text-3);margin:12px 0 6px;">¿Con qué frecuencia?</div>
                  <div style="display:flex;gap:6px;">
                    ${FREQ_OPTIONS.map(f => `
                      <div onclick="updateCompromiso('${c.id}','frecuencia','${f.id}')"
                        id="freq-${c.id}-${f.id}"
                        style="flex:1;padding:8px 6px;text-align:center;border-radius:var(--r-md);
                          font-size:11px;cursor:pointer;border:1px solid;
                          ${(comp ? comp.frecuencia : 'DIARIO') === f.id
                            ? 'background:rgba(212,168,67,0.15);border-color:var(--gold);color:var(--gold);font-weight:700;'
                            : 'background:var(--bg-base);border-color:var(--border);color:var(--text-3);'}
                          transition:all 0.2s;">
                        ${f.emoji}<br>${f.label}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer -->
      <div style="position:fixed;bottom:0;left:0;right:0;padding:16px 20px;
        background:linear-gradient(to top,var(--bg-base) 70%,transparent);">
        <button onclick="obCommitmentsProceed()"
          id="commitmentsBtn"
          style="width:100%;padding:16px;border:none;border-radius:var(--r-lg);cursor:pointer;
            font-family:var(--font-head);font-size:15px;font-weight:800;
            background:linear-gradient(135deg,var(--gold-dim),var(--gold));
            color:#0A0A0F;box-shadow:0 0 20px rgba(212,168,67,0.3);">
          ${areaIdx < totalAreas - 1
            ? `⟩ Siguiente área: ${AREAS_CATALOG.find(a => a.id === OB.areas[areaIdx+1])?.nombre || ''}`
            : '⚔️ TODOS MIS COMPROMISOS ESTÁN SELLADOS'}
        </button>
      </div>
    </div>
  `;
}

function toggleCommitment(cId, areaId, nombre, unidad, pcBase, metaDef) {
  const idx = OB.compromisos.findIndex(c => c.compromisoId === cId);
  if (idx === -1) {
    OB.compromisos.push({ compromisoId: cId, areaId, nombre, unidad, pcBase, meta: metaDef, frecuencia: 'DIARIO' });
  } else {
    OB.compromisos.splice(idx, 1);
  }
  // Re-render solo la lista
  const area    = AREAS_CATALOG.find(a => a.id === areaId);
  const catalog = _catalogCache[areaId] || CATALOG_LOCAL[areaId] || [];
  const container = document.getElementById('onboardingContainer');
  if (container) {
    container.innerHTML = renderObCommitments(area, catalog);
    container.scrollTop = 0;
  }
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

function updateCompromiso(cId, field, value) {
  const comp = OB.compromisos.find(c => c.compromisoId === cId);
  if (!comp) return;
  if (field === 'meta') comp.meta = parseFloat(value) || 1;
  if (field === 'frecuencia') {
    comp.frecuencia = value;
    // Actualizar visualmente los botones de frecuencia
    FREQ_OPTIONS.forEach(f => {
      const el = document.getElementById(`freq-${cId}-${f.id}`);
      if (el) {
        const active = f.id === value;
        el.style.background   = active ? 'rgba(212,168,67,0.15)' : 'var(--bg-base)';
        el.style.borderColor  = active ? 'var(--gold)' : 'var(--border)';
        el.style.color        = active ? 'var(--gold)' : 'var(--text-3)';
        el.style.fontWeight   = active ? '700' : '400';
      }
    });
  }
}

function obCommitmentsProceed() {
  const areaId = OB.areas[OB.areaIndex];
  const tieneCompromisos = OB.compromisos.some(c => c.areaId === areaId);

  if (!tieneCompromisos) {
    // Vibración de error
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
    return;
  }

  if (OB.areaIndex < OB.areas.length - 1) {
    // Siguiente área
    OB.areaIndex++;
    const container = document.getElementById('onboardingContainer');
    if (container) renderObCommitmentsAsync(container);
  } else {
    // Todas las áreas configuradas → siguiente paso (juramento)
    obNext();
  }
}
