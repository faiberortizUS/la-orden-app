function renderAddHabit(data) {
  return `
    <div class="view" id="view-add-habit" style="padding-bottom: 120px;">
      <!-- ENCABEZADO STICKY PARA VOLVER -->
      <div style="position: sticky; top: -20px; background: rgba(10,10,15,0.95); 
           padding: 16px 0; margin: -20px -20px 16px -20px; z-index: 50; display: flex; align-items: center; 
           gap: 8px; cursor: pointer; border-bottom: 1px solid var(--border);" 
           onclick="navigateTo('oath')">
        <div style="padding: 0 20px; display: flex; align-items: center; gap: 8px; width: 100%;">
          <span style="font-size:20px;color:var(--gold);">←</span>
          <span style="font-size:14px; font-weight:700; color:var(--text-1); letter-spacing:0.04em;">Atrás / Cancelar Misión</span>
        </div>
      </div>

      <div style="text-align:center; padding: 20px 20px;">
        <div style="font-size:48px; margin-bottom:8px;">⚔️</div>
        <div style="font-family:var(--font-head); font-size:22px; font-weight:900; color:var(--gold); margin-bottom:8px;">FORJAR NUEVO PILAR</div>
        <div style="font-size:13px; color:var(--text-3); line-height:1.5;">Elige tus nuevas batallas sabiamente. Solo compromete lo que puedas cumplir con honor.</div>
      </div>

      <div class="card">
        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">1. Territorio de Impacto</label>
          <select id="newHabitArea" class="form-input" onchange="updateActivitySuggestions()"
            style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
            <option value="SALUD_FISICA">🏃 Salud Física</option>
            <option value="SALUD_MENTAL">🧠 Salud Mental</option>
            <option value="ANTI_ADICCION">🚫 Recuperación y Sobriedad</option>
            <option value="FINANZAS">💰 Finanzas</option>
            <option value="PRODUCTIVIDAD">⚡ Productividad</option>
            <option value="CRECIMIENTO">📚 Crecimiento e Intelecto</option>
            <option value="RELACIONES">🤝 Relaciones</option>
            <option value="CARRERA">🚀 Carrera y Negocio</option>
            <option value="ENTORNO">🏠 Entorno y Orden</option>
            <option value="ESPIRITUALIDAD">🙏 Espiritualidad</option>
            <option value="PERSONALIZADO">🎯 Personalizado</option>
          </select>
        </div>

        <!-- Actividades sugeridas del área -->
        <div id="activitySuggestions" style="margin-bottom:var(--s4);">
          <!-- Se rellena dinámicamente por updateActivitySuggestions() -->
        </div>

        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">2. Nombre de la Misión</label>
          <input type="text" id="newHabitName" placeholder="Ej. Meditar, Correr 5K, Leer..." class="form-input"
            style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--gold); padding:14px; font-size:15px; outline:none;" autocomplete="off">
        </div>

        <div style="display:flex; gap:12px; margin-bottom:var(--s4);">
          <div style="flex:1;">
            <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">3. Meta Diaria (Número)</label>
            <input type="number" id="newHabitMeta" placeholder="Ej. 10" inputmode="numeric" pattern="[0-9]*" class="form-input"
              style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
          </div>
          <div style="flex:1;">
            <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">Unidad</label>
            <input type="text" id="newHabitUnidad" placeholder="min, reps, pág..." class="form-input"
              style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
          </div>
        </div>

        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">4. Frecuencia Estratégica</label>
          <select id="newHabitFreq" class="form-input"
            style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
            <option value="DIARIO">Diario (Alta Disciplina)</option>
            <option value="L_V">Lunes a Viernes</option>
            <option value="FDS">Fin de Semana (Sáb-Dom)</option>
          </select>
        </div>
        
      <button id="saveHabitBtn" onclick="saveNewHabit()" 
          style="width:100%; margin-top:16px; padding:18px 24px; border:none; border-radius:var(--r-lg); cursor:pointer; 
                 font-family:var(--font-head); font-size:16px; font-weight:900; color:#0A0A0F; letter-spacing:0.06em; 
                 background:linear-gradient(135deg,var(--gold-dim),var(--gold)); box-shadow:0 0 30px rgba(212,168,67,0.2);">
          ➕ INTEGRAR AL PACTO
        </button>
      </div>

    </div>
  `;
}

function initAddHabitView() {
  // Inicializar sugerencias con el area por defecto al cargar la vista
  requestAnimationFrame(() => updateActivitySuggestions());
}

// Catálogo de sugerencias por área con descripción científica
const ADD_HABIT_CATALOG = {
  SALUD_FISICA: [
    { nombre: 'Ejercicio cardiovascular', unidad: 'min', meta: 30, info: 'Reduce cortisol, mejora neuroplasticidad y aumenta BDNF (factor neurotrópico). 30 min/día = -26% riesgo cardiovascular (AHA, 2021).' },
    { nombre: 'Entrenamiento de fuerza',  unidad: 'min', meta: 45, info: 'Aumenta testosterona, densidad ósea y metabolismo basal. Investigación NSCA: 3 sesiones/semana mejoran fuerza hasta 40% en 8 semanas.' },
    { nombre: 'Pasos diarios',            unidad: 'pasos', meta: 8000, info: 'Estudio JAMA (2021): 8K pasos/día correlaciona con -51% de mortalidad por todas las causas.' },
    { nombre: 'Hidratación',              unidad: 'vasos', meta: 8, info: 'Deshidratación del 2% deteriora concentración un 20% (Univ. Connecticut). Agua es rendimiento cognitivo.' },
    { nombre: 'Horas de sueño',           unidad: 'hrs',   meta: 7, info: 'El NHLBI establece 7-9h como óptimo. Menos de 6h duplica el riesgo de accidente cardiovascular y deteriora la memoria declarativa.' },
  ],
  SALUD_MENTAL: [
    { nombre: 'Meditación',              unidad: 'min', meta: 10, info: 'Harvard: 8 semanas de meditación diaria reducen la amígdala (reactividad emocional) y engrosan la corteza prefrontal.' },
    { nombre: 'Diario personal',         unidad: 'min', meta: 10, info: 'James Pennebaker (UT Austin): escritura expresiva reduce síntomas de ansiedad y mejora el sistema inmune en 4 semanas.' },
    { nombre: 'Gratitud diaria',         unidad: 'items', meta: 3, info: '3 cosas de gratitud/día aumentan el bienestar subjetivo un 25% (Robert Emmons, UC Davis). Activa circuito de dopamina.' },
    { nombre: 'Detox digital',           unidad: 'hrs', meta: 2, info: 'Cada hora menos de pantalla = 20% menos cortisol (APA, 2017). El scroll activa el mismo circuito de dopamina que las tragamonedas.' },
  ],
  ANTI_ADICCION: [
    { nombre: 'Días de sobriedad',       unidad: 'días', meta: 1, info: 'NIDA: 90 días de abstinencia inician la reparación neuronal del circuito de recompensa. Cada día sin ceder es un ladrillo de reconstrucción cerebral.' },
    { nombre: 'Minutos sin craving',     unidad: 'min', meta: 60, info: 'Técnica de surfing del craving (Marlatt). El impulso dura promedio 20 min: no lo satisfagas, obsérvaio pasar como una ola.' },
    { nombre: 'Actividad sustituta',     unidad: 'min', meta: 30, info: 'Protocolo CBT: reemplazar la conducta adictiva con actividad incompatible reduce la frecuencia de recaída un 35% (NIDA).' },
    { nombre: 'Conexión social sana',    unidad: 'conv', meta: 1, info: 'Johann Hari: "Lo opuesto a la adicción no es la sobriedad, es la conexión". Una conversación real por día es medicina preventiva.' },
    { nombre: 'Meditación de atención plena', unidad: 'min', meta: 15, info: 'Mindfulness-Based Relapse Prevention (MBRP): reduce recaídas un 31% comparado con tratamiento estándar (Witkiewitz, 2014).' },
  ],
  FINANZAS: [
    { nombre: 'Ahorro diario',           unidad: 'COP', meta: 10000, info: '$10K COP/día = $3.65M/año. El poder del compounding: a 7% anual, en 10 años son $50M. La riqueza se construye en silencio, día a día.' },
    { nombre: 'Revisión financiera',     unidad: 'min', meta: 10, info: '"Lo que se mide, mejora" (Peter Drucker). 10 min de revisión diaria generan conciencia financiera que reduce gastos impulsivos un 23%.' },
    { nombre: 'Estudio de inversiones',  unidad: 'min', meta: 20, info: 'Warren Buffett dedica 80% de su día a leer. 20 min de aprendizaje financiero diario = 120 horas al año de ventaja sobre el promedio.' },
  ],
  PRODUCTIVIDAD: [
    { nombre: 'Deep Work',               unidad: 'min', meta: 90, info: 'Cal Newport: 4h de trabajo profundo producen más valor que 8h de trabajo fragmentado. Solo el 1% practica Deep Work consistentemente.' },
    { nombre: 'Tareas completadas',      unidad: 'tareas', meta: 3, info: 'Regla de las 3 victorias (Michael Hyatt): identifica las 3 tareas más importantes del día y complétalas antes de cualquier otra cosa.' },
    { nombre: 'Planificación diaria',    unidad: 'min', meta: 15, info: 'Benjamin Franklin planificaba la noche anterior. Cada minuto de planificación ahorra 10 de ejecución (Tim Ferriss).' },
    { nombre: 'Sin redes sociales',      unidad: 'hrs', meta: 4, info: 'Gloria Mark (UCI): toma 23 minutos recuperar el foco tras una interrupción. 4h sin redes = hasta 5h adicionales de productividad real.' },
  ],
  CRECIMIENTO: [
    { nombre: 'Lectura',                 unidad: 'pág', meta: 20, info: 'Univ. de Sussex: 6 min de lectura reducen estrés un 68%. 20 pág/día = 12-15 libros al año. El CEO promedio lee 52 libros/año.' },
    { nombre: 'Aprendizaje estructurado',unidad: 'min', meta: 30, info: 'La Regla de las 10,000 horas (K. Anders Ericsson): la práctica deliberada, no el talento, define la maestría. 30 min/día = elite en 10 años.' },
    { nombre: 'Podcast/audiolibro',      unidad: 'min', meta: 30, info: 'Convierte tiempo muerto (transporte, ejercicio) en inversión cognitiva. 30 min/día = 180+ horas de aprendizaje al año.' },
  ],
  RELACIONES: [
    { nombre: 'Conversación significativa', unidad: 'conv', meta: 1, info: 'Robert Waldinger (Harvard, 85 años de datos): la calidad de las relaciones es el mayor predictor de salud y longevidad. Más que el dinero.' },
    { nombre: 'Networking activo',       unidad: 'contactos', meta: 1, info: 'Ivan Misner: tu red determina tu patrimonio neto. 1 contacto nuevo/día = 365 conexiones al año de ventaja profesional acumulada.' },
    { nombre: 'Tiempo en familia',       unidad: 'min', meta: 30, info: 'John Gottman: los matrimonios exitosos tienen una ratio 5:1 de interacciones positivas vs negativas. 30 min de presencia real es el mínimo crítico.' },
  ],
  ESPIRITUALIDAD: [
    { nombre: 'Oración / meditación',   unidad: 'min', meta: 15, info: 'Viktor Frankl: las personas con sentido de propósito sobreviven y prosperan en condiciones extremas. La práctica espiritual diaria ancla el propósito.' },
    { nombre: 'Silencio intencional',    unidad: 'min', meta: 10, info: 'Un estudio en el Journal of Psychosomatic Medicine muestra que el silencio intencional reduce presión arterial y clarifica la toma de decisiones.' },
    { nombre: 'Reflexión de propósito',  unidad: 'min', meta: 10, info: 'Simon Sinek: el "por qué" es más poderoso que el "qué". 10 min de reflexión de propósito diaria alinea acciones con valores core.' },
  ],
  CARRERA: [
    { nombre: 'Prospección comercial',   unidad: 'contactos', meta: 5, info: 'Principio de las 5 llamadas: el 80% de ventas se cierran entre el 5to y 12vo contacto. La constancia en prospección = ingresos predecibles.' },
    { nombre: 'Creación de contenido',   unidad: 'min', meta: 30, info: 'Gary Vaynerchuk: el contenido es el precio de entrada a la relevancia moderna. 1 pieza/día = 365 activos digitales trabajando para ti.' },
    { nombre: 'Aprendizaje profesional', unidad: 'min', meta: 30, info: 'El mercado laboral cambia 40% cada 5 años (WEF). 30 min de upskilling diario es la vacuna contra la obsolescencia profesional.' },
  ],
  ENTORNO: [
    { nombre: 'Orden del espacio',       unidad: 'min', meta: 10, info: 'BJ Fogg (Stanford): el entorno es el predictor #1 de comportamiento. Un espacio ordenado reduce fricción cognitiva y aumenta autocontrol un 15%.' },
    { nombre: 'Preparación nocturna',    unidad: 'min', meta: 15, info: 'Benjamin Franklin: "Si fallas en planificar, planificas fallar." 15 min de preparación nocturna eliminan decisiones de la mañana y reducen el estrés matutino.' },
  ],
  PERSONALIZADO: [],
};

function updateActivitySuggestions() {
  const area = document.getElementById('newHabitArea')?.value;
  const container = document.getElementById('activitySuggestions');
  if (!container || !area) return;
  
  const catalog = ADD_HABIT_CATALOG[area] || [];
  if (catalog.length === 0) {
    container.innerHTML = '';
    // Limpiar para area personalizada
    const nameInput = document.getElementById('newHabitName');
    const uniInput  = document.getElementById('newHabitUnidad');
    const metaInput = document.getElementById('newHabitMeta');
    if (nameInput) nameInput.value = '';
    if (uniInput)  uniInput.value  = '';
    if (metaInput) metaInput.value = '';
    return;
  }

  // Auto-rellenar con la primera actividad sugerida del area
  const primera = catalog[0];
  const nameInput = document.getElementById('newHabitName');
  const uniInput  = document.getElementById('newHabitUnidad');
  const metaInput = document.getElementById('newHabitMeta');
  if (nameInput) nameInput.value = primera.nombre;
  if (uniInput)  uniInput.value  = primera.unidad;
  if (metaInput) metaInput.value = primera.meta;
  
  container.innerHTML = `
    <div style="margin-bottom:12px;">
      <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">
        Actividades sugeridas — toca para seleccionar + ver la ciencia
      </label>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${catalog.map(c => {
          const safeNombre = c.nombre.replace(/'/g, "\\'").replace(/"/g, "&quot;");
          const rawInfo = c.info || 'Actividad táctica diseñada para erradicar la mediocridad. Su ejecución diaria engrana tu mente al estándar del 1%.';
          const tooltipHtml = `<div style="margin-bottom:14px; font-size:13px; color:var(--text-1); line-height:1.6;">${rawInfo}</div><div style="background:rgba(212,168,67,0.05); border:1px solid rgba(212,168,67,0.3); border-radius:var(--r-md); padding:12px;"><div style="font-size:10px; text-transform:uppercase; color:var(--gold); font-weight:800; letter-spacing:0.1em; margin-bottom:6px;">Calibración Táctica</div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px; color:var(--text-2);">Meta de impacto:</span><span style="font-size:15px; color:var(--gold); font-weight:900; font-family:var(--font-head);">${c.meta.toLocaleString('es-CO')} ${c.unidad}</span></div></div>`;
          const safeInfo = tooltipHtml.replace(/'/g, "\\'").replace(/"/g, "&quot;");
          return `
          <div onclick="selectSuggestedActivity('${safeNombre}','${c.unidad}',${c.meta},'${safeInfo}')"
            style="display:flex; align-items:center; gap:10px; padding:12px 14px;
              background:var(--bg-elevated); border:1px solid var(--border);
              border-radius:var(--r-md); transition:all 0.2s ease;" class="tappable"
            onmouseover="this.style.borderColor='var(--border-gold)';this.style.background='rgba(212,168,67,0.06)'"
            onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg-elevated)'">
            <div style="flex:1;">
              <div style="font-size:13px; font-weight:700; color:var(--text-1);">${c.nombre}</div>
              <div style="font-size:11px; color:var(--text-3); margin-top:2px;">Meta sugerida: ${c.meta} ${c.unidad}</div>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <div onclick="event.stopPropagation(); showInteractiveModal('${safeNombre}','${safeInfo}','🧠')" class="tappable"
                style="color:var(--gold);font-size:13px;padding:3px 9px;border-radius:var(--r-full);
                  background:rgba(212,168,67,0.1);font-weight:800;border:1px solid rgba(212,168,67,0.3);">?</div>
              <span style="font-size:16px; color:var(--text-3);">⟩</span>
            </div>
          </div>
        `}).join('')}
      </div>
    </div>
  `;
}


function selectSuggestedActivity(nombre, unidad, meta, info) {
  const nameInput = document.getElementById('newHabitName');
  const metaInput = document.getElementById('newHabitMeta');
  const uniInput = document.getElementById('newHabitUnidad');
  if (nameInput) nameInput.value = nombre;
  if (metaInput) metaInput.value = meta;
  if (uniInput) uniInput.value = unidad;
  
  // Mostrar la info científica
  showInteractiveModal(nombre, info, '🧠');
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

async function saveNewHabit() {
  const nameInput = document.getElementById('newHabitName');
  const metaInput = document.getElementById('newHabitMeta');
  const uniInput = document.getElementById('newHabitUnidad');
  const areaSelect = document.getElementById('newHabitArea');
  const freqSelect = document.getElementById('newHabitFreq');
  const btn = document.getElementById('saveHabitBtn');

  const nombre = nameInput.value.trim();
  const meta = parseFloat(metaInput.value);
  const unidad = uniInput.value.trim() || 'unidades';

  if (!nombre) {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert('El pilar debe tener un nombre de misión.');
    else alert('El nombre es requerido');
    return;
  }
  if (!meta || meta <= 0) {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert('La meta debe ser un número mayor a cero.');
    else alert('Meta inválida');
    return;
  }

  // CHECK LOGIC: Duplicate evaluation
  const list = window._appData?.compromisos || [];
  const duplicado = list.find(c => c.nombre.trim().toLowerCase() === nombre.toLowerCase());
  
  if (duplicado) {
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    if (window.Telegram?.WebApp && window.Telegram.WebApp.showPopup) {
      window.Telegram.WebApp.showPopup({
        title: '⛔ Infracción Táctica',
        message: `El pilar "${nombre}" ya existe vigentemente en tu contrato actual.\n\nLas misiones no pueden duplicarse o se anula su peso estructural. Combina tu agresividad y concentración ejecutando e incrementando la métrica de la ya existente.`,
        buttons: [{ id: 'ok', type: 'default', text: 'Entendido' }]
      });
    } else {
      alert(`El pilar "${nombre}" ya existe en tu contrato actual. Las misiones no pueden duplicarse.`);
    }
    return;
  }

  const compromiso = {
    areaId: areaSelect.value,
    nombre: nombre,
    unidad: unidad,
    meta: meta,
    frecuencia: freqSelect.value,
    pcBase: 25 // base por defecto para creados custom
  };

  btn.disabled = true;
  btn.innerHTML = 'FORJANDO...';

  // Haptic
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  }

  try {
    const data = await _postOnboarding({
      action: 'SAVE_COMPROMISOS',
      compromisos: [compromiso]
    });

    if (!data || !data.ok) throw new Error(data?.error || 'No se pudo guardar el pilar');

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

    // Refresh user data para obtener las nuevas misiones con la data fresca
    // CRÍTICO: actualizar AMBAS referencias (appData global + _appData)
    if (typeof fetchUserData === 'function') {
      const fresh = await fetchUserData();
      if (fresh && fresh.user) {
        // appData es la variable global que usa navigateTo()
        // eslint-disable-next-line no-undef
        appData         = fresh;
        window._appData = fresh;
      }
    }

    // Volver a la vista del Pacto con los datos ya actualizados
    navigateTo('oath');

  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = '❌ ERROR: REINTENTAR';
    if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert('Fallo el servidor: ' + e.message);
    else alert(e.message);
  }
}
