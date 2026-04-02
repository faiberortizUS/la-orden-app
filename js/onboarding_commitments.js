/**
 * 🏛️ LA ORDEN — onboarding_commitments.js
 * Selección de compromisos por área, con meta y frecuencia
 * Catálogo cargado desde GAS backend
 */

// Catálogo local embebido como fallback (GAS sirve el definitivo)
const CATALOG_LOCAL = {
  SALUD_FISICA:   [
    { id: 'SF_CARDIO',  nombre: 'Ejercicio cardiovascular', unidad: 'min',    pcBase: 30, metaDef: 30,    info: 'Reduce cortisol y aumenta BDNF. 30 min/día = -26% riesgo cardiovascular (AHA, 2021).' },
    { id: 'SF_FUERZA',  nombre: 'Entrenamiento de fuerza',  unidad: 'min',    pcBase: 30, metaDef: 45,    info: 'Aumenta testosterona y metabolismo basal. NSCA: 3 sesiones/semana mejoran fuerza 40% en 8 semanas.' },
    { id: 'SF_PASOS',   nombre: 'Pasos diarios',            unidad: 'pasos',  pcBase: 25, metaDef: 8000,  info: 'JAMA (2021): 8K pasos/día = -51% mortalidad por todas las causas. Simple, medible, transformador.' },
    { id: 'SF_AGUA',    nombre: 'Hidratación',              unidad: 'vasos',  pcBase: 20, metaDef: 8,     info: 'Deshidratación del 2% deteriora concentración un 20% (Univ. Connecticut). Agua es rendimiento.' },
    { id: 'SF_SUENIO',  nombre: 'Horas de sueño',           unidad: 'hrs',    pcBase: 25, metaDef: 7,     info: 'NHLBI: 7-9h es el rango óptimo. Menos de 6h duplica el riesgo cardiovascular y deteriora la memoria.' },
  ],
  SALUD_MENTAL:   [
    { id: 'SM_MEDIT',   nombre: 'Meditación',               unidad: 'min',   pcBase: 25, metaDef: 10,  info: 'Harvard: 8 semanas de meditación diaria reducen la amígdala y engrosan la corteza prefrontal.' },
    { id: 'SM_DIARIO',  nombre: 'Diario personal',          unidad: 'min',   pcBase: 20, metaDef: 10,  info: 'James Pennebaker (UT Austin): escritura expresiva reduce ansiedad y mejora el sistema inmune en 4 semanas.' },
    { id: 'SM_GRATIT',  nombre: 'Gratitud diaria',          unidad: 'items', pcBase: 15, metaDef: 3,   info: '3 cosas de gratitud/día aumentan el bienestar un 25% (Robert Emmons, UC Davis). Activa dopamina.' },
    { id: 'SM_DIGITAL', nombre: 'Detox digital',            unidad: 'hrs',   pcBase: 25, metaDef: 2,   info: 'Cada hora menos de pantalla = 20% menos cortisol (APA, 2017). El scroll es tragamonedas para el cerebro.' },
  ],
  ANTI_ADICCION:  [
    { id: 'AA_SOBRIED',  nombre: 'Días de sobriedad',          unidad: 'días', pcBase: 40, metaDef: 1,   info: 'NIDA: 90 días de abstinencia inician la reparación neuronal. Cada día sin ceder es un ladrillo de reconstrucción cerebral.' },
    { id: 'AA_CRAVING',  nombre: 'Minutos sin craving cedido', unidad: 'min',  pcBase: 35, metaDef: 60,  info: 'Técnica de surfing del craving (Marlatt): el impulso dura ~20 min. No lo satisfagas, obsérvalo pasar como una ola.' },
    { id: 'AA_SUSTIT',   nombre: 'Actividad sustituta',        unidad: 'min',  pcBase: 30, metaDef: 30,  info: 'Protocolo CBT: reemplazar la conducta adictiva con actividad incompatible reduce recaída un 35% (NIDA).' },
    { id: 'AA_SOCIAL',   nombre: 'Conexión social sana',       unidad: 'conv', pcBase: 30, metaDef: 1,   info: 'Johann Hari: "Lo opuesto a la adicción no es la sobriedad, es la conexión". Una conversación real es medicina.' },
    { id: 'AA_MINDFUL',  nombre: 'Meditación de atención plena',unidad: 'min', pcBase: 30, metaDef: 15,  info: 'MBRP: Mindfulness-Based Relapse Prevention reduce recaídas un 31% vs tratamiento estándar (Witkiewitz, 2014).' },
  ],
  FINANZAS:       [
    { id: 'FIN_AHORRO', nombre: 'Ahorro diario',             unidad: 'COP',   pcBase: 30, metaDef: 10000, info: '$10K COP/día = $3.65M/año. A 7% anual, en 10 años son $50M. La riqueza se construye en silencio.' },
    { id: 'FIN_REVIEW', nombre: 'Revisión financiera',       unidad: 'min',   pcBase: 20, metaDef: 10,   info: 'Peter Drucker: lo que se mide, mejora. 10 min de revisión diaria reduce gastos impulsivos un 23%.' },
    { id: 'FIN_INVEST',  nombre: 'Estudio de inversiones',   unidad: 'min',   pcBase: 25, metaDef: 20,   info: 'Buffett dedica 80% a leer. 20 min de aprendizaje financiero/día = 120h de ventaja al año.' },
  ],
  PRODUCTIVIDAD:  [
    { id: 'PRO_DEEP',    nombre: 'Deep Work',                unidad: 'min',    pcBase: 35, metaDef: 90, info: 'Cal Newport: 4h de trabajo profundo = más valor que 8h fragmentadas. El 1% practica Deep Work.' },
    { id: 'PRO_TAREAS',  nombre: 'Tareas completadas',       unidad: 'tareas', pcBase: 25, metaDef: 3,  info: 'Regla de las 3 victorias (Michael Hyatt): completa las 3 más importantes antes de cualquier otra.' },
    { id: 'PRO_BLOQUES', nombre: 'Bloques de tiempo',        unidad: 'bloques',pcBase: 25, metaDef: 4,  info: 'Time Blocking (Cal Newport): agendar bloques específicos reduce fricción y aumenta output un 40%.' },
    { id: 'PRO_NOTICIAS',nombre: 'Sin redes sociales',       unidad: 'hrs',    pcBase: 20, metaDef: 4,  info: 'Gloria Mark (UCI): 23 min para recuperar el foco tras interrupción. 4h sin redes = 5h extra de productividad.' },
  ],
  RELACIONES:     [
    { id: 'REL_CONV',    nombre: 'Conversación significativa',unidad: 'conv',      pcBase: 20, metaDef: 1,  info: 'Robert Waldinger (Harvard, 85 años de datos): las relaciones de calidad son el mayor predictor de longevidad.' },
    { id: 'REL_RED',     nombre: 'Networking activo',         unidad: 'contactos', pcBase: 25, metaDef: 1,  info: 'Ivan Misner: tu red determina tu patrimonio neto. 1 contacto nuevo/día = 365 conexiones de ventaja al año.' },
    { id: 'REL_FAMILIA', nombre: 'Tiempo en familia',         unidad: 'min',       pcBase: 20, metaDef: 30, info: 'John Gottman: los vínculos exitosos tienen 5:1 de interacciones positivas vs negativas. 30 min es el mínimo.' },
  ],
  CRECIMIENTO:    [
    { id: 'CRE_LECT',    nombre: 'Lectura',                   unidad: 'pág', pcBase: 25, metaDef: 20, info: 'Univ. Sussex: 6 min de lectura = -68% estrés. 20 pág/día = 12-15 libros/año. El CEO promedio lee 52.' },
    { id: 'CRE_CURSO',   nombre: 'Aprendizaje estructurado',  unidad: 'min', pcBase: 30, metaDef: 30, info: 'Ericsson: la práctica deliberada, no el talento, define la maestría. 30 min/día = elite en 10 años.' },
    { id: 'CRE_POD',     nombre: 'Podcast / audiolibro',      unidad: 'min', pcBase: 20, metaDef: 30, info: 'Convierte tiempo muerto en inversión cognitiva. 30 min/día = 180+ horas de aprendizaje al año.' },
  ],
  ESPIRITUALIDAD: [
    { id: 'ESP_ORACION',  nombre: 'Oración / meditación',     unidad: 'min', pcBase: 20, metaDef: 15, info: 'Viktor Frankl: las personas con propósito sobreviven y prosperan. La práctica espiritual ancla el por qué.' },
    { id: 'ESP_SILENCIO', nombre: 'Silencio intencional',     unidad: 'min', pcBase: 20, metaDef: 10, info: 'Journal of Psychosomatic Medicine: el silencio intencional reduce presión arterial y clarifica decisiones.' },
    { id: 'ESP_PROP',     nombre: 'Reflexión de propósito',   unidad: 'min', pcBase: 20, metaDef: 10, info: 'Simon Sinek: el por qué es más poderoso que el qué. 10 min de reflexión alinea acciones con valores core.' },
  ],
  CARRERA:        [
    { id: 'CAR_PROSP',   nombre: 'Prospección comercial',    unidad: 'contactos', pcBase: 35, metaDef: 5,  info: '80% de ventas se cierran entre el 5to y 12vo contacto. Constancia en prospección = ingresos predecibles.' },
    { id: 'CAR_CONT',    nombre: 'Creación de contenido',    unidad: 'min',       pcBase: 30, metaDef: 30, info: 'Gary Vee: el contenido es el precio de entrada a la relevancia. 1 pieza/día = 365 activos trabajando para ti.' },
    { id: 'CAR_APREN',   nombre: 'Upskilling profesional',   unidad: 'min',       pcBase: 30, metaDef: 30, info: 'WEF: el mercado laboral cambia 40% cada 5 años. 30 min de upskilling diario es vacuna contra la obsolescencia.' },
  ],
  ENTORNO:        [
    { id: 'ENT_ORDEN',   nombre: 'Orden del espacio',        unidad: 'min', pcBase: 25, metaDef: 10, info: 'BJ Fogg (Stanford): el entorno es el predictor #1 de comportamiento. Espacio ordenado = autocontrol +15%.' },
    { id: 'ENT_PREP',    nombre: 'Preparación nocturna',     unidad: 'min', pcBase: 25, metaDef: 15, info: 'Benjamin Franklin: si fallas en planificar, planificas fallar. 15 min nocturnos eliminan decisiones matutinas.' },
  ],
  PERSONALIZADO:  [
    { id: 'PER_CUSTOM1', nombre: 'Mi compromiso 1',          unidad: 'reps', pcBase: 25, metaDef: 1,  info: 'Define tu propia misión. Sé específico: nombre claro, unidad medible, meta desafiante pero alcanzable.' },
    { id: 'PER_CUSTOM2', nombre: 'Mi compromiso 2',          unidad: 'reps', pcBase: 25, metaDef: 1,  info: 'Compromiso personalizado. Recuerda: solo compromete lo que puedas defender con disciplina real.' },
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
                <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
                  <div>
                    <div style="font-weight:600;font-size:14px;color:${isSel ? 'var(--gold)' : 'var(--text-1)'};">${c.nombre}</div>
                    <div style="font-size:11px;color:var(--text-3);">Meta sugerida: ${c.metaDef.toLocaleString('es-CO')} ${c.unidad} · +${c.pcBase} PC</div>
                  </div>
                  <div onclick="event.stopPropagation(); showInteractiveModal('🧠 ' + '${c.nombre}','${(c.info || 'Actividad táctica de La Orden. Meta recomendada: ' + c.metaDef + ' ' + c.unidad + '. Comprometerte y cumplir diariamente forja consistencia real.').replace(/'/g, "&apos;")}<br><br><b>Meta sugerida:</b> ${c.metaDef.toLocaleString('es-CO')} ${c.unidad}','🧠')" style="color:var(--gold);font-size:13px;padding:3px 9px;border-radius:var(--r-full);background:rgba(212,168,67,0.1);margin-left:8px;font-weight:800;border:1px solid rgba(212,168,67,0.3);">?</div>
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
