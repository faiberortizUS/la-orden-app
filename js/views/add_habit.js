/**
 * 🏛️ LA ORDEN — views/add_habit.js
 * Añadir nuevos pilares directamente desde el Dashboard
 */

function renderAddHabit(data) {
  return `
    <div class="view" id="view-add-habit" style="padding-bottom: 120px;">
      <!-- ENCABEZADO STICKY PARA VOLVER -->
      <div style="position: sticky; top: -20px; background: rgba(10,10,15,0.95); backdrop-filter: blur(8px); 
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
        <div style="font-size:13px; color:var(--text-3); line-height:1.5;">Elige tus nuevas batallas sabiamente. Aquellas palabras que no cumplas derribarán tu consistencia.</div>
      </div>

      <div class="card">
        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">1. Territorio de Impacto</label>
          <select id="newHabitArea" class="form-input" style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
            <option value="SALUD_FISICA">🏃 Salud Física</option>
            <option value="SALUD_MENTAL">🧠 Salud Mental</option>
            <option value="PRODUCTIVIDAD">⚡ Productividad</option>
            <option value="CRECIMIENTO">📚 Crecimiento e Intelecto</option>
            <option value="RELACIONES">🤝 Relaciones</option>
            <option value="FINANZAS">💰 Finanzas</option>
            <option value="ESPIRITUALIDAD">🙏 Espiritualidad</option>
            <option value="PERSONALIZADO">🎯 Personalizado</option>
          </select>
        </div>

        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">2. Nombre de la Misión</label>
          <input type="text" id="newHabitName" placeholder="Ej. Meditar, Correr 5K, Leer..." class="form-input" style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--gold); padding:14px; font-size:15px; outline:none;" autocomplete="off">
        </div>

        <div style="display:flex; gap:12px; margin-bottom:var(--s4);">
          <div style="flex:1;">
            <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">3. Meta Diaria (Número)</label>
            <input type="number" id="newHabitMeta" placeholder="Ej. 10" inputmode="numeric" pattern="[0-9]*" class="form-input" style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
          </div>
          <div style="flex:1;">
            <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">Unidad</label>
            <input type="text" id="newHabitUnidad" placeholder="min, reps, pág..." class="form-input" style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
          </div>
        </div>

        <div style="margin-bottom:var(--s4);">
          <label style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); margin-bottom:8px;">4. Frecuencia Estratégica</label>
          <select id="newHabitFreq" class="form-input" style="width:100%; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-primary); color:var(--text-1); padding:14px; font-size:15px; outline:none;">
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
