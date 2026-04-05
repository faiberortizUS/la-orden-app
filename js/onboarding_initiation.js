/**
 * 🏛️ LA ORDEN — onboarding_initiation.js
 * Las Reglas del Juego — Iniciación Post-Juramento
 */

const INITIATION_SLIDES = [
  {
    icon: '🗺️',
    title: 'EL TERRITORIO',
    text: `Bienvenido a La Orden, <b>{nombre}</b>.<br><br>Acabas de cruzar la línea que divide al 99% de las personas que prometen, del 1% que opera. A partir de hoy, tus hábitos no son tareas. Son <b>misiones</b> que alteran directamente los atributos de tu propia identidad.`,
    button: 'Comprendido'
  },
  {
    icon: '📊',
    title: 'TU ICD Y LA CAÍDA',
    text: `El activo más valioso aquí es tu <b>ICD (Índice de Consistencia Disciplinada)</b>.<br><br>Este número mide quién eres cuando nadie te observa. Si rompes tu compromiso un día, <b>perderás puntos acumulados que te costaron semanas construir</b>. Romperlo dos días seguidos activa una penalización brutal — el sistema te castiga de forma exponencial porque la debilidad repetida destruye identidad.<br><br><i>La intensidad importa poco si no hay consistencia.</i>`,
    button: 'Acepto las reglas'
  },
  {
    icon: '🛡️',
    title: 'LÍNEA ACTIVA Y ESCUDOS',
    text: `Tus días de éxito ininterrumpidos forman tu <b>Línea Activa</b>. Cada 14 días impecables forjarás un <b>Escudo</b>.<br><br>Si caes un día, un Escudo se sacrificará para proteger tu racha. Si caes y estás desprotegido... regresas al inicio.`,
    button: 'Defenderé mi posición'
  },
  {
    icon: '⚔️',
    title: 'TUS HERMANOS DE ARMAS',
    text: `No vas a pelear esta guerra solo. El sistema integrará tu progreso en una <b>Célula</b> de 5 personas de tu mismo calibre.<br><br>Si tú fallas, arrastras el rango de la célula. Si todos cumplen, los atributos se multiplican. Tu debilidad expone a tu equipo.`,
    button: 'Honor a mi Célula'
  },
  {
    icon: '🦅',
    title: 'TU GUÍA PERSONAL',
    text: `El 99% fracasa cuando su voluntad se quiebra en silencio. Para blindar tu éxito, nuestro <b>Sistema Antiabandono</b> te conectará con un <b>Guía Personal</b>.<br><br>Este mentor marchará a tu lado en cada actividad. Te inyectará foco al despertar con su primer mensaje y te arrinconará al caer la noche si intentas desaparecer sin reportar.<br><br><i>Una conexión humana, íntima e inquebrantable, diseñada para sostenerte en tu momento más oscuro.</i>`,
    button: 'Acepto a mi Guía'
  },
  {
    icon: '📈',
    title: 'AUDITORÍA DE ÉLITE',
    text: `Para conquistar tu territorio, necesitas inteligencia táctica superior.<br><br>Cada semana, recibirás un <b>Informe de Desempeño Personalizado</b> elaborado a partir de tus acciones. Un análisis frío y quirúrgico de tus métricas que revelará tus patrones de sabotaje invisibles y calibrará tu próxima semana.<br><br><i>El mismo nivel de precisión y exigencia de un Coaching premium de $10,000, ahora guiando tu destino.</i>`,
    button: 'Reclamo mi poder'
  },
  {
    icon: '💎',
    title: 'EL PRECIO DE ENTRADA',
    text: `Tanto el dolor de la disciplina como el dolor del arrepentimiento cobran una tarifa. Tú eliges qué precio quieres pagar.<br><br>Cruzarás ahora el umbral final. Invierte en tu transformación para sellar irrevocablemente tu <b>Juramento</b>. Lo gratuito rara vez impone respeto.`,
    button: 'Cruzar el umbral'
  }
];

let currentSlideIndex = 0;

async function renderObInitiationAsync(container) {
  currentSlideIndex = 0;

  const nombreFmt = OB.nombre || 'Arquitecto';

  const html = `
    <div id="ob-initiation" style="min-height:100vh;display:flex;flex-direction:column;
      background:radial-gradient(circle at top right, #17110e, #0A0A0F);
      padding-bottom:120px; position:relative;">
      
      ${obProgressBar(3, 4)}
      
      <div style="flex:1;display:flex;flex-direction:column;position:relative;overflow:hidden;padding:24px;z-index:2;">
         
         <!-- Progress Dots -->
         <div id="initiation-dots" style="display:flex;justify-content:center;gap:8px;margin-bottom:40px;margin-top:20px;">
           ${INITIATION_SLIDES.map((_, i) => `<div class="init-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
         </div>
         
         <!-- Cards Wrapper -->
         <div id="init-cards-wrapper" style="position:relative;flex:1;width:100%;">
            ${INITIATION_SLIDES.map((s, i) => `
               <div class="init-card ${i === 0 ? 'active' : ''}" id="init-card-${i}" style="overflow-y:auto;justify-content:flex-start;padding-top:40px;">
                 <div class="init-card-icon">${s.icon}</div>
                 <div class="init-card-title">${s.title}</div>
                 <div class="init-card-text">${s.text.replace('{nombre}', nombreFmt)}</div>
               </div>
            `).join('')}
         </div>

         <!-- CTA -->
         <button id="init-next-btn" class="tappable btn-premium" style="width:100%;margin-top:20px;height:56px;display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:16px;font-weight:800;letter-spacing:1px;background:linear-gradient(135deg, var(--gold-dim), var(--gold));border:none;box-shadow:0 0 30px rgba(212,168,67,0.4);color:#0A0A0F;border-radius:var(--r-xl);transition:all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);" onclick="nextInitiationSlide()">
           ${INITIATION_SLIDES[0].button}
         </button>
      </div>
      
      <!-- Fog / Smoke effect overlay for depth -->
      <div style="position:absolute;bottom:0;left:0;right:0;height:40vh;background:linear-gradient(to top, rgba(10,10,15,1), transparent);z-index:1;pointer-events:none;"></div>
    </div>
  `;
  container.innerHTML = html;

  // Pequeña aparición al entrar
  setTimeout(() => {
    const card0 = document.getElementById('init-card-0');
    if (card0) card0.style.transform = 'translateY(0) scale(1)';
  }, 100);
}

function nextInitiationSlide() {
  const currentCard = document.getElementById('init-card-' + currentSlideIndex);

  if (currentSlideIndex < INITIATION_SLIDES.length - 1) {
    if (currentCard) {
      currentCard.classList.remove('active');
      currentCard.classList.add('exit');
    }

    const dots = document.querySelectorAll('.init-dot');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.remove('active');

    currentSlideIndex++;

    const nextCard = document.getElementById('init-card-' + currentSlideIndex);
    if (nextCard) {
      nextCard.classList.add('active');
    }

    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');

    const btn = document.getElementById('init-next-btn');
    if (btn) {
      btn.style.opacity = '0';
      setTimeout(() => {
        btn.innerHTML = INITIATION_SLIDES[currentSlideIndex].button;
        btn.style.opacity = '1';

        // Botón dorado premium desde el slide 1 en adelante
        if (currentSlideIndex >= 1) {
          btn.style.background = 'linear-gradient(135deg, var(--gold-dim), var(--gold))';
          btn.style.color = '#0A0A0F';
          btn.style.border = 'none';
          btn.style.boxShadow = '0 0 30px rgba(212,168,67,0.4)';
        }
      }, 200);
    }

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  } else {
    // Si estamos en la última tarjeta, avanzamos al siguiente paso (payment)
    obNext();
  }
}
