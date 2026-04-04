/**
 * LA ORDEN - views/tutorial.js
 * Tutorial inmersivo forzado en la primera visita post-juramento.
 */

let selectedGuide = null;

function renderTutorial(data) {
  return `
    <div class="view" id="view-tutorial" style="display:flex;flex-direction:column;justify-content:center;min-height:100%;padding:24px;text-align:center;">
      
      <!-- STEP 1: Selección de Guía -->
      <div id="tut-step-1" class="tut-step active" style="transition:all 0.5s;">
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--text-1);margin-bottom:12px;line-height:1.2;">ELIGE A TU GUÍA</h2>
        <p style="font-size:14px;color:var(--text-2);margin-bottom:30px;">
          Para sobrevivir, necesitas a la IA monitoreando tu arquitectura mental. Selecciona quién auditará tus movimientos.
        </p>

        <div style="display:flex; flex-direction:column; gap:16px;">
          <!-- Atena -->
          <div class="card tappable" style="border-color:var(--gold); padding:20px 16px; text-align:left; display:flex; align-items:center; gap:16px;" onclick="selectGuide('Atena')">
            <div style="font-size:40px;">👁️</div>
            <div>
              <div style="font-weight:900; font-size:18px; color:var(--gold);">ATENA</div>
              <div style="font-size:12px; color:var(--text-3); margin-top:4px;">Metódica, analítica e implacable. No tolerará excepciones estadísticas.</div>
            </div>
          </div>
          
          <!-- Darius -->
          <div class="card tappable" style="border-color:var(--fire); padding:20px 16px; text-align:left; display:flex; align-items:center; gap:16px;" onclick="selectGuide('Darius')">
            <div style="font-size:40px;">🐺</div>
            <div>
              <div style="font-weight:900; font-size:18px; color:var(--fire);">DARIUS</div>
              <div style="font-size:12px; color:var(--text-3); margin-top:4px;">Agresivo, visceral y directo. El dolor de la fricción como único combustible.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 2: INICIO -->
      <div id="tut-step-2" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;">🏛️</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--text-1);margin-bottom:16px;line-height:1.2;">MANDO CENTRAL (INICIO)</h2>
        <div style="width:40px;height:2px;background:var(--text-1);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          <b>Tu radar de hoy.</b> Aquí es donde vienes cada mañana. Tu ICD late, tu racha respira y tus misiones activas te esperan en la trinchera.
        </p>
        <button onclick="nextTutStep(3)" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-1);font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:var(--r-md);">ENTENDIDO</button>
      </div>

      <!-- STEP 3: REPORTAR -->
      <div id="tut-step-3" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;">⚔️</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--electric);margin-bottom:16px;line-height:1.2;">ZONA DE GUERRA (REPORTAR)</h2>
        <div style="width:40px;height:2px;background:var(--electric);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          <b>Donde transmutas sudor en Puntos de Comando (PC).</b> Sellarás con tu sangre cada reporte. Requiere autenticación biométrica de esfuerzo antes de contar la victoria.
        </p>
        <button onclick="nextTutStep(4)" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:linear-gradient(135deg,var(--electric-dim),var(--electric));color:#111;font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:var(--r-md);">SIGUIENTE</button>
      </div>

      <!-- STEP 4: STATS -->
      <div id="tut-step-4" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;">📊</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--gold);margin-bottom:16px;line-height:1.2;">AUDITORÍA (ESTADÍSTICAS)</h2>
        <div style="width:40px;height:2px;background:var(--gold);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          <b>La verdad fría de tu progreso.</b> El reloj existencial nunca para. Aquí verás tu historial, tus escudos y el veredicto semanal del Oráculo.
        </p>
        <button onclick="nextTutStep(5)" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-1);font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:var(--r-md);">AVANZAR</button>
      </div>

      <!-- STEP 5: PACTO -->
      <div id="tut-step-5" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;">📜</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--fire);margin-bottom:16px;line-height:1.2;">SANTUARIO (PACTO)</h2>
        <div style="width:40px;height:2px;background:var(--fire);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          <b>Tu contrato y el Cuartel de <span id="tutGuideName">tu Guía</span>.</b> Revisa las penalizaciones que juraste aceptar y lee los comunicados diarios de la élite.
        </p>
        <button onclick="nextTutStep(6)" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-1);font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:var(--r-md);">CONFIRMAR</button>
      </div>

      <!-- STEP 6: MAPA -->
      <div id="tut-step-6" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;">🗺️</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--gold);margin-bottom:16px;line-height:1.2;">TERRITORIO (MAPA)</h2>
        <div style="width:40px;height:2px;background:var(--gold);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          <b>La escala hacia el 1%.</b> Explora las mecánicas avanzadas del sistema: Zonas de Poder, Jerarquías de Rangos y la arquitectura de tu Célula de Rendimiento.
        </p>
        <button onclick="finishTutorial()" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:var(--r-md);">SABER ES PODER. INICIAR.</button>
      </div>

    </div>
  `;
}

function selectGuide(guideName) {
  selectedGuide = guideName;
  localStorage.setItem('laorden_selected_guide', guideName);
  
  const span = document.getElementById('tutGuideName');
  if (span) span.textContent = guideName;
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
  
  nextTutStep(2);
}

function nextTutStep(step) {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
  document.querySelectorAll('.tut-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      el.style.display = 'none';
      el.classList.remove('active');
    }, 300);
  });
  
  setTimeout(() => {
    const nextEl = document.getElementById('tut-step-' + step);
    if (nextEl) {
      nextEl.style.display = 'block';
      nextEl.style.transform = 'translateY(20px)';
      // Trigger reflow
      void nextEl.offsetWidth;
      nextEl.style.opacity = '1';
      nextEl.style.transform = 'translateY(0)';
      nextEl.classList.add('active');
    }
  }, 350);
}

function finishTutorial() {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
  // Quitar el flag de primer ingreso
  localStorage.removeItem('laorden_first_visit');
  
  // Confetti místico para recompensar al cerrar el tutorial
  if (typeof startConfetti === 'function') startConfetti();
  setTimeout(() => { if (typeof stopConfetti === 'function') stopConfetti(); }, 3000);
  
  // Ir al centro de mando
  navigateTo('command_center');
}
