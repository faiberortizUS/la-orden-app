/**
 * LA ORDEN - views/tutorial.js
 * Tutorial inmersivo forzado en la primera visita post-juramento.
 */

function renderTutorial(data) {
  return `
    <div class="view" id="view-tutorial" style="display:flex;flex-direction:column;justify-content:center;min-height:100%;padding:24px;text-align:center;">
      <div id="tut-step-1" class="tut-step active" style="transition:all 0.5s;">
        <div style="font-size:60px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(212,168,67,0.5));">🏛️</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--gold);margin-bottom:16px;line-height:1.2;">BIENVENIDO AL 1%</h2>
        <div style="width:40px;height:2px;background:var(--gold);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          Tu juramento está sellado. Tu estructura está viva.<br><br>
          A partir de hoy, <b>el sistema auditará cada una de tus acciones.</b>
        </p>
        <button onclick="nextTutStep(2)" class="badge-chip badge-chip--gold tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:linear-gradient(135deg,var(--gold-dim),var(--gold));color:#0A0A0F;font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:14px;box-shadow:0 0 20px rgba(212,168,67,0.2);">ENTRAR A LA CÁMARA</button>
      </div>

      <div id="tut-step-2" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(123,97,255,0.5));">⚡</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--electric);margin-bottom:16px;line-height:1.2;">EL ÍNDICE DE CONSISTENCIA</h2>
        <div style="width:40px;height:2px;background:var(--electric);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          Cada día que reportas, tu ICD sube. Cada día que fallas o decides ignorar el sistema, <b>tu ICD cae sin piedad</b>.<br><br>
          Si baja demasiado, pierdes tu rango en la Célula.
        </p>
        <button onclick="nextTutStep(3)" class="badge-chip badge-chip--electric tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:linear-gradient(135deg,var(--electric-dim),var(--electric));color:#F5F5F5;font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:14px;box-shadow:0 0 20px rgba(123,97,255,0.2);">ENTIENDO EL RIESGO</button>
      </div>

      <div id="tut-step-3" class="tut-step" style="display:none; transition:all 0.5s; opacity:0; transform:translateY(20px);">
        <div style="font-size:60px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(220,38,38,0.5));">🔥</div>
        <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;color:var(--fire);margin-bottom:16px;line-height:1.2;">LA REGLA DE SUPERVIVENCIA</h2>
        <div style="width:40px;height:2px;background:var(--fire);margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:var(--text-2);line-height:1.6;margin-bottom:40px;">
          Falla un día en todo, y tu racha ardiente vuelve a cero.<br><br>
          Pero si reportas al menos <b>una sola misión</b>, salvas la inercia (Día Mínimo Viable). Nunca te rindas por completo.
        </p>
        <button onclick="finishTutorial()" class="badge-chip tappable" style="width:100%;padding:18px;font-size:16px;border:none;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text-1);font-family:var(--font-head);font-weight:800;letter-spacing:0.05em;border-radius:14px;">ESTOY LISTO PARA REPORTAR</button>
      </div>
    </div>
  `;
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
