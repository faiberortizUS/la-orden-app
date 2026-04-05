/**
 * 🏛️ LA ORDEN — onboarding_commitments.js
 * UNIFICADO: Selección de Campos de Batalla (Áreas) y Compromisos en la misma vista.
 */

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
    { id: 'AA_ALCOHOL',  nombre: 'Sobriedad: Alcohol',        unidad: 'días', pcBase: 40, metaDef: 1, info: 'Recuerda: se trabaja un día a la vez. Cada día suma a la reparación neuronal de tu circuito de recompensa.' },
    { id: 'AA_NICOTINA', nombre: 'Sobriedad: Nicotina / Vape',unidad: 'días', pcBase: 40, metaDef: 1, info: 'Recuerda: se trabaja un día a la vez. Superar el craving de nicotina recablea tu tolerancia a la ansiedad y al estrés.' },
    { id: 'AA_PORNO',    nombre: 'Sobriedad: Pornografía',    unidad: 'días', pcBase: 40, metaDef: 1, info: 'Recuerda: se trabaja un día a la vez. La abstención resetea tus receptores dopaminérgicos y restaura tu vitalidad y atención.' },
    { id: 'AA_DROGAS',   nombre: 'Sobriedad: Sustancias',     unidad: 'días', pcBase: 40, metaDef: 1, info: 'Recuerda: se trabaja un día a la vez. NIDA indica que la neuroplasticidad requiere semanas de constancia sin excepciones.' },
    { id: 'AA_APUESTAS', nombre: 'Sobriedad: Apuestas',       unidad: 'días', pcBase: 40, metaDef: 1, info: 'Recuerda: se trabaja un día a la vez. Romper la trampa del azar devuelve el control absoluto a tus manos.' },
    { id: 'AA_CRAVING',  nombre: 'Soportar un Craving',       unidad: 'eventos', pcBase: 35, metaDef: 1, info: 'Surfing the urge: el pico de abstinencia dura solo ~20 min. No lo satisfagas, obsérvalo pasar; así matas al monstruo.' },
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

const AREAS_CATALOG = [
  { id: 'SALUD_FISICA',   emoji: '🏃', nombre: 'Salud Física',      desc: 'Cuerpo como arma' },
  { id: 'SALUD_MENTAL',   emoji: '🧠', nombre: 'Mente Clara',        desc: 'Control total' },
  { id: 'ANTI_ADICCION',  emoji: '🚫', nombre: 'Sobriedad',          desc: 'Domar el impulso' },
  { id: 'FINANZAS',       emoji: '💰', nombre: 'Finanzas',           desc: 'Libertad real' },
  { id: 'CARRERA',        emoji: '🚀', nombre: 'Carrera',            desc: 'Impacto y dominio' },
  { id: 'PRODUCTIVIDAD',  emoji: '⚡', nombre: 'Productividad',      desc: 'Máximo rendimiento' },
  { id: 'RELACIONES',     emoji: '🤝', nombre: 'Relaciones',         desc: 'El círculo correcto' },
  { id: 'CRECIMIENTO',    emoji: '📚', nombre: 'Crecimiento',        desc: 'Ventaja cognitiva' },
  { id: 'ENTORNO',        emoji: '🏠', nombre: 'Entorno',            desc: 'Control del caos' },
  { id: 'ESPIRITUALIDAD', emoji: '🙏', nombre: 'Espiritualidad',     desc: 'Propósito profundo' },
  { id: 'PERSONALIZADO',  emoji: '🎯', nombre: 'Personalizado',      desc: 'Tu campo único' },
];

const FREQ_OPTIONS = [
  { id: 'DIARIO', label: 'Todos los días', emoji: '📅' },
  { id: 'L_V',    label: 'Lunes a viernes', emoji: '💼' },
  { id: 'FDS',    label: 'Fines de semana', emoji: '🌅' },
];

let _catalogCache = {};
let _obExpandedArea = null; // Controla qué acordeón está abierto

// Lllamada de entrada desde onboarding.js
function renderObCommitmentsAsync(container) {
  // Inicialmente abrimos la primera área que tenga compromisos.
  // Si no hay ninguno (primera vez), se declaran cerrados (null) para una mejor presentación.
  if (!_obExpandedArea && OB.compromisos.length > 0) {
    _obExpandedArea = OB.compromisos[0].areaId;
  }
  container.innerHTML = renderObCommitmentsCombined();
  container.scrollTop = 0;
}

// ── VISTA PRINCIPAL ──────────────────────────────────────
function renderObCommitmentsCombined() {
  const totalComps = OB.compromisos.length;
  // Paso 1 de 4 (La bienvenida ya no cuenta como paso)
  const pbArgs = typeof obProgressBar !== 'undefined' ? obProgressBar(1, 4) : '';

  return `
    <div id="ob-commitments" style="min-height:100vh;padding-bottom:120px;background:var(--bg-primary);">
      ${pbArgs}

      <div style="padding:24px 20px 16px;">
        <div style="font-size:11px;letter-spacing:0.25em;color:var(--gold);text-transform:uppercase;margin-bottom:8px;font-weight:800;">
          Paso 1: Plan de Batalla
        </div>
        <div style="font-family:var(--font-head);font-size:28px;font-weight:900;color:var(--text-1);margin-bottom:4px;line-height:1.1;">
          TERRENO DE<br>OPERACIONES
        </div>
        <div style="font-size:14px;color:var(--text-3);line-height:1.5;margin-top:12px;">
          Selecciona un campo de batalla para ver sus misiones. No intentes abarcar todo.
          <strong style="color:var(--text-2);">Elige lo que verdaderamente estás dispuesto a hacer.</strong>
        </div>
      </div>

      <!-- ACORDEÓN DE ÁREAS -->
      <div id="areasAccordion" style="padding:0 20px;">
        ${AREAS_CATALOG.map(area => {
          const areaCompromisos = OB.compromisos.filter(c => c.areaId === area.id);
          const isExpanded = _obExpandedArea === area.id;
          const actCount   = areaCompromisos.length;
          
          return `
            <div class="ob-area-section tappable-no-scale" 
              style="background:var(--bg-elevated);border:1px solid ${isExpanded ? 'var(--gold)' : 'var(--border)'};
                     border-radius:var(--r-lg);margin-bottom:12px;overflow:hidden;
                     ${isExpanded ? 'box-shadow:0 0 16px rgba(212,168,67,0.1);' : ''}
                     transition:all 0.3s;">
              
              <!-- HEADER DE ÁREA -->
              <div onclick="toggleObAreaExpand('${area.id}')"
                style="padding:16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;
                       background:${isExpanded ? 'rgba(212,168,67,0.05)' : 'transparent'};">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${area.emoji}</div>
                  <div>
                    <div style="font-weight:800;color:${isExpanded || actCount > 0 ? 'var(--text-1)' : 'var(--text-2)'};font-size:15px;margin-bottom:2px;">${area.nombre}</div>
                    <div style="font-size:11px;color:var(--text-3);">${area.desc}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                  ${actCount > 0 ? `
                    <!-- CHIP CON FRICCIÓN PARA ELIMINAR -->
                    <div style="background:var(--gold);color:#0A0A0F;font-size:11px;font-weight:900;
                                padding:4px 8px;border-radius:12px;display:flex;align-items:center;gap:6px;"
                         onclick="event.stopPropagation(); requestClearArea('${area.id}', '${area.nombre}', ${actCount})">
                      ${actCount} act.
                      <span style="font-weight:400;font-size:16px;line-height:0.8;margin-bottom:1px;">×</span>
                    </div>
                  ` : ''}
                  <div style="color:var(--text-3);font-size:14px;
                              transform:${isExpanded ? 'rotate(180deg)' : 'none'};
                              transition:transform 0.3s ease;">▼</div>
                </div>
              </div>

              <!-- CONTENIDO EXPANDIDO (LISTA DE HÁBITOS) -->
              ${isExpanded ? `
                <div class="ob-area-body" style="padding:0 16px 16px;border-top:1px solid rgba(212,168,67,0.15);animation:fadeIn 0.3s ease;">
                  <div style="font-size:10px;color:var(--text-3);margin:16px 0 12px;letter-spacing:0.1em;text-transform:uppercase;font-weight:800;">
                    Selecciona tus armas:
                  </div>
                  ${(_catalogCache[area.id] || CATALOG_LOCAL[area.id] || []).map(c => {
                    const comp = areaCompromisos.find(x => x.compromisoId === c.id);
                    const isSel = !!comp;
                    return renderActivityBlock(c, area.id, isSel, comp);
                  }).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- FOOTER STICKY -->
      <div style="position:fixed;bottom:0;left:0;right:0;padding:16px 20px;
        background:linear-gradient(to top,var(--bg-base) 70%,transparent);">
        <button onclick="obCommitmentsProceedCombined()"
          id="commitmentsBtn" class="btn-premium tappable"
          style="width:100%;height:56px;display:flex;align-items:center;justify-content:center;
            border:none;border-radius:var(--r-xl);cursor:${totalComps > 0 ? 'pointer' : 'not-allowed'};
            font-family:var(--font-head);font-size:15px;font-weight:900;letter-spacing:0.04em;
            transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            ${totalComps > 0 
              ? 'background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;box-shadow:0 8px 24px rgba(212,168,67,0.3);transform:translateY(0);' 
              : 'background:var(--bg-elevated);color:var(--text-3);transform:translateY(4px);opacity:0.8;'}">
          ${totalComps > 0 ? '⚔️ FORJAR COMPROMISOS ⟩' : 'SELECCIONA AL MENOS UNO'}
        </button>
      </div>
      
      <style>
        @keyframes fadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
      </style>
    </div>
  `;
}

// ── RENDER DE ACTIVIDAD (Bloque individual) ───────────────
function renderActivityBlock(c, areaId, isSel, comp) {
  const safeNombre = c.nombre.replace(/'/g, "\\\\\\'").replace(/"/g, "&quot;");
  const rawInfo = c.info || '';
  const rawDesc = c.desc || rawInfo;
  
  // Extraer primera oración para beneficio real
  const _pIdx = rawInfo.search(/\\.\\s+[A-Z0-9]/);
  const beneficio = _pIdx > 0 ? rawInfo.substring(0, _pIdx + 1) : rawInfo;
  
  // Armar tooltip (Códice)
  const tooltipHtml = '<div style="margin-bottom:14px;"><div style="font-size:10px; color:var(--gold); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:6px;">👁️ Arquitectura Conceptual</div><div style="font-size:13px; color:var(--text-1); line-height:1.6; margin-bottom:14px;">' + rawDesc + '</div><div style="font-size:10px; color:var(--gold); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:6px;">📈 El Beneficio Real</div><div style="font-size:13px; color:var(--text-1); line-height:1.6; margin-bottom:14px;">' + beneficio + '</div><div style="font-size:10px; color:var(--gold); text-transform:uppercase; letter-spacing:0.1em; font-weight:800; margin-bottom:6px;">🔬 Bio-Ciencia</div><div style="font-size:13px; color:var(--text-2); font-style:italic; line-height:1.6; margin-bottom:14px;">' + rawInfo + '</div></div><div style="background:rgba(212,168,67,0.05); border:1px solid rgba(212,168,67,0.3); border-radius:var(--r-md); padding:12px;"><div style="font-size:10px; text-transform:uppercase; color:var(--gold); font-weight:800; letter-spacing:0.1em; margin-bottom:6px;">🎯 Calibración Sugerida</div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px; color:var(--text-2);">Meta de impacto:</span><span style="font-size:15px; color:var(--gold); font-weight:900; font-family:var(--font-head);">' + c.metaDef.toLocaleString('es-CO') + ' ' + c.unidad + '</span></div></div>';
  const safeInfo = tooltipHtml.replace(/'/g, "\\\\\\'").replace(/"/g, "&quot;");

  return `
    <div id="comp-${c.id}" style="background:var(--bg-base);border:2px solid ${isSel ? 'var(--gold)' : 'var(--border)'};
      border-radius:var(--r-md);margin-bottom:8px;overflow:hidden;
      ${isSel ? 'box-shadow:0 0 12px rgba(212,168,67,0.1);' : ''}
      transition:all 0.2s ease;">

      <!-- Header del compromiso -->
      <div onclick="toggleCommitmentCombined('${c.id}','${areaId}','${safeNombre}','${c.unidad}',${c.pcBase},${c.metaDef})"
        style="display:flex;align-items:center;gap:12px;padding:14px 12px;cursor:pointer;">
        
        <div style="width:22px;height:22px;border-radius:4px;border:2px solid ${isSel ? 'var(--gold)' : 'var(--border)'};
          background:${isSel ? 'var(--gold)' : 'transparent'};display:flex;align-items:center;justify-content:center;
          font-size:12px;color:#000;font-weight:900;flex-shrink:0;">${isSel ? '✓' : ''}</div>
        
        <div style="flex:1;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-weight:700;font-size:14px;color:${isSel ? 'var(--gold)' : 'var(--text-1)'};">${c.nombre}</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Sugerido: ${c.metaDef.toLocaleString('es-CO')} ${c.unidad}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            ${isSel ? `
              <div onclick="event.stopPropagation(); removeCommitmentIndividual('${c.id}')"
                   style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;
                          color:var(--text-3);background:rgba(255,255,255,0.08);border-radius:50%;font-size:16px;">×</div>
            ` : ''}
            <div onclick="event.stopPropagation(); showInteractiveModal('${safeNombre}', '${safeInfo}', '🧠')"
                 style="color:var(--gold);font-size:13px;width:26px;height:26px;display:flex;align-items:center;
                        justify-content:center;border-radius:50%;background:rgba(212,168,67,0.1);
                        font-weight:900;border:1px solid rgba(212,168,67,0.3);">?</div>
          </div>
        </div>
      </div>

      <!-- Formulario expandido -->
      ${isSel ? `
        <div style="padding:0 12px 14px;border-top:1px solid rgba(212,168,67,0.15);">
          <div style="font-size:11px;color:var(--gold);margin:12px 0 6px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800;">
            🎯 Calibración Diaria
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;">
            <input type="number" id="meta-${c.id}" value="${comp ? comp.meta : c.metaDef}" min="1" inputmode="numeric"
              oninput="updateCompromisoCombined('${c.id}','meta',this.value)"
              style="flex:1;background:rgba(0,0,0,0.3);border:1px solid var(--border-gold);border-radius:var(--r-md);
                     color:var(--text-1);font-size:16px;padding:10px 12px;outline:none;font-family:var(--font-head);font-weight:900;" />
            <span style="color:var(--text-2);font-size:13px;min-width:44px;font-weight:600;">${c.unidad}</span>
          </div>

          <div style="font-size:11px;color:var(--gold);margin:0 0 6px;text-transform:uppercase;letter-spacing:0.1em;font-weight:800;">
            ⏱️ Frecuencia
          </div>
          <div style="display:flex;gap:6px;">
            ${FREQ_OPTIONS.map(f => `
              <div onclick="updateCompromisoCombined('${c.id}','frecuencia','${f.id}')"
                id="freq-${c.id}-${f.id}"
                style="flex:1;padding:8px 4px;text-align:center;border-radius:var(--r-md);font-size:10px;cursor:pointer;border:1px solid;
                  ${(comp ? comp.frecuencia : 'DIARIO') === f.id
                    ? 'background:rgba(212,168,67,0.15);border-color:var(--gold);color:var(--gold);font-weight:700;'
                    : 'background:rgba(0,0,0,0.3);border-color:var(--border);color:var(--text-3);'}
                  transition:all 0.2s;">
                <div style="font-size:14px;margin-bottom:2px;">${f.emoji}</div>
                ${f.label}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ── LOGICA DE COMPORTAMIENTO ──────────────────────────────
function toggleObAreaExpand(areaId) {
  if (_obExpandedArea === areaId) {
    _obExpandedArea = null;
  } else {
    _obExpandedArea = areaId;
    
    // Si no está en caché, prefetch silencioso
    if (!_catalogCache[areaId]) {
      try {
        if (typeof fetchCatalog !== 'undefined') {
          fetchCatalog(areaId).then(data => {
            if (data && data.length > 0) {
              _catalogCache[areaId] = data;
              // Re-renderizar si sigue abierta esta área
              if (_obExpandedArea === areaId) {
                const container = document.getElementById('onboardingContainer');
                if (container) container.innerHTML = renderObCommitmentsCombined();
              }
            }
          }).catch(() => {});
        }
      } catch(e) {}
    }
  }

  // Actualizar UI
  const container = document.getElementById('onboardingContainer');
  if (container) container.innerHTML = renderObCommitmentsCombined();
}

function toggleCommitmentCombined(cId, areaId, nombre, unidad, pcBase, metaDef) {
  const idx = OB.compromisos.findIndex(c => c.compromisoId === cId);
  if (idx === -1) {
    // Añadir
    OB.compromisos.push({ compromisoId: cId, areaId, nombre, unidad, pcBase, meta: metaDef, frecuencia: 'DIARIO' });
  } else {
    // Eliminar
    OB.compromisos.splice(idx, 1);
  }
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
  
  // Re-render de toda la vista
  const container = document.getElementById('onboardingContainer');
  if (container) container.innerHTML = renderObCommitmentsCombined();
}

// Actualizar valores de input o frecuencia
function updateCompromisoCombined(cId, field, value) {
  const comp = OB.compromisos.find(c => c.compromisoId === cId);
  if (!comp) return;
  if (field === 'meta') {
    comp.meta = parseFloat(value) || 1;
  } else if (field === 'frecuencia') {
    comp.frecuencia = value;
    // Actualización visual directa (sin re-render global)
    FREQ_OPTIONS.forEach(f => {
      const el = document.getElementById(`freq-${cId}-${f.id}`);
      if (el) {
        const active = f.id === value;
        el.style.background  = active ? 'rgba(212,168,67,0.15)' : 'rgba(0,0,0,0.3)';
        el.style.borderColor = active ? 'var(--gold)' : 'var(--border)';
        el.style.color       = active ? 'var(--gold)' : 'var(--text-3)';
        el.style.fontWeight  = active ? '700' : '400';
      }
    });
  }
}

// ── FRICCIONES DE ELIMINACIÓN ─────────────────────────────
// Acción desde el [×] individual (sin fricción fuerte, es una deselección)
function removeCommitmentIndividual(cId) {
  const idx = OB.compromisos.findIndex(c => c.compromisoId === cId);
  if (idx !== -1) {
    OB.compromisos.splice(idx, 1);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    const container = document.getElementById('onboardingContainer');
    if (container) container.innerHTML = renderObCommitmentsCombined();
  }
}

// Acción desde el chip [x] del área completa: FRICCIÓN ALTA
function requestClearArea(areaId, areaName, actCount) {
  if (window.Telegram?.WebApp?.showPopup) {
    window.Telegram.WebApp.showPopup({
      title: '⚠️ ¿Borrar terreno operativo?',
      message: `Vas a eliminar ${actCount} misión(es) activa(s) de "${areaName}".\\n\\n¿Seguro que quieres descartar esta línea táctica?`,
      buttons: [
        { id: 'borrar', type: 'destructive', text: 'Sí, borrar misiones' },
        { id: 'cancelar', type: 'default',   text: 'Mantener preparadas' }
      ]
    }, (btnId) => {
      if (btnId === 'borrar') clearAreaCommitments(areaId);
    });
  } else {
    const ok = confirm(`Vas a eliminar ${actCount} misión(es) de "${areaName}".\\n\\n¿Borrar misiones?`);
    if (ok) clearAreaCommitments(areaId);
  }
}

function clearAreaCommitments(areaId) {
  OB.compromisos = OB.compromisos.filter(c => c.areaId !== areaId);
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
  }
  
  const container = document.getElementById('onboardingContainer');
  if (container) container.innerHTML = renderObCommitmentsCombined();
}

// ── CONTINUAR ONBOARDING ──────────────────────────────────
function obCommitmentsProceedCombined() {
  if (OB.compromisos.length === 0) {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    }
    return;
  }
  
  // Como ya no existe la pantalla "areas", derivamos OB.areas a partir de los compromisos
  // Esto mantiene compatibilidad con la base de datos (por si se usan)
  const areasSet = new Set(OB.compromisos.map(c => c.areaId));
  OB.areas = Array.from(areasSet);
  
  // Avanzar
  if (typeof obNext === 'function') obNext();
}
