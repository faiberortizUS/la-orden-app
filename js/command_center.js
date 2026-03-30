/**
 * 🏛️ LA ORDEN — command_center.js
 * Centro de Comandos — Mapa interactivo de la aplicación
 * Primera vez: guía de entrada. Siempre: accesible desde la nav.
 */

const CC_ZONES = [
  {
    id:     'icd',
    emoji:  '🎯',
    nombre: 'Índice de Consistencia',
    corto:  'ICD',
    color:  'var(--gold)',
    desc:   'Tu métrica maestra. Mide qué tan consistente eres frente a tus compromisos en los últimos 28 días.',
    detalle:'100 = perfecta consistencia. 85+ = Zona Élite del 1%. Se actualiza cada vez que reportas.',
    tip:    'Sube tu ICD reportando todos tus compromisos cada día. Un solo día fallado puede bajarlo hasta 4 puntos.',
  },
  {
    id:     'streak',
    emoji:  '🔥',
    nombre: 'Línea Activa',
    corto:  'RACHA',
    color:  'var(--fire)',
    desc:   'Días consecutivos con al menos un reporte. Tu racha sin interrupciones.',
    detalle:'Cada 7, 14, 21, 30, 60 y 90 días de racha desbloqueas un Escudo de Protección.',
    tip:    'Los Escudos te protegen de perder tu racha si fallas un día. ¡Acumúlalos antes de que los necesites!',
  },
  {
    id:     'escudos',
    emoji:  '🛡️',
    nombre: 'Escudos de Protección',
    corto:  'ESCUDOS',
    color:  '#EAB308',
    desc:   'Tu salvavidas contra la pérdida de inercia. Te salvan automáticamente si fallas un día.',
    detalle:'Se ganan al alcanzar hitos de racha (7, 14, 21, 30, 60, 90 días). Si tu racha se va a romper por inactividad, un escudo se sacrifica automáticamente para proteger tu fuego y mantener la racha viva.',
    tip:    'Nunca uses tu último escudo como "Día Libre". Úsalos como seguro para emergencias reales. Perder la racha cuesta semanas de recuperación mental.',
  },
  {
    id:     'pc',
    emoji:  '⚡',
    nombre: 'Puntos de Poder',
    corto:  'PC',
    color:  'var(--electric)',
    desc:   'Moneda de La Orden. Los ganas cada vez que reportas un compromiso completado.',
    detalle:'PC = (Valor/Meta) × PCBase + bonos por exceder la meta (10-20 PC extra). Los PC determinan tu Rango.',
    tip:    'Supera tu meta para ganar el bono de PC. Si llegas al 120% recibes +10 PC extra. ¡Al 150%+ ganas +20!',
  },
  {
    id:     'rangos',
    emoji:  '🏛️',
    nombre: 'Rangos',
    corto:  'JERARQUIA',
    color:  '#A855F7',
    desc:   'Tu posición en La Orden, determinada por tus PC totales acumulados.',
    detalle:'Aspirante -> Iniciado -> Comprometido -> Veterano -> Elite -> Arquitecto -> Custodio',
    tip:    'Cada rango desbloquea nuevas funciones y visibilidad en tu Célula.',
  },
  {
    id:     'celula',
    emoji:  '⚔️',
    nombre: 'Célula de Rendimiento',
    corto:  'CELULA',
    color:  'var(--success)',
    desc:   'Tu equipo de 5-8 personas con objetivos similares. Compiten y se empujan mutuamente.',
    detalle:'El leaderboard de tu Célula se actualiza en tiempo real según el ICD de cada miembro.',
    tip:    'La presión social positiva multiplica los resultados. Tu ICD impacta el ranking de toda la Célula.',
  },
  {
    id:     'contrato',
    emoji:  '📜',
    nombre: 'Contrato de 30 Días',
    corto:  'PACTO',
    color:  'var(--gold)',
    desc:   'Cada Juramento firmado crea un contrato de 30 días. Al terminar, se genera el siguiente automáticamente.',
    detalle:'El contrato vigente muestra tu progreso real: días con reporte vs. total de días del período.',
    tip:    'Completa tus 30 días con al menos 25 reportes para alcanzar el estatus de Contrato Sellado.',
  },
];

function renderCommandCenter(data, isFirstTime) {
  data = data || window._appData || {};
  const user = data.user || {};

  return `
    <div class="view" id="view-command-center">

      <!-- Header del mapa -->
      <div style="text-align:center;padding:20px 20px 16px;">
        ${isFirstTime ? `
          <div style="font-size:11px;letter-spacing:0.2em;color:var(--electric);
            text-transform:uppercase;margin-bottom:8px;">Tu base de operaciones</div>
        ` : ''}
        <div style="font-family:var(--font-head);font-size:22px;font-weight:900;
          color:var(--text-1);margin-bottom:6px;">🗺️ Centro de Comandos</div>
        <div style="font-size:13px;color:var(--text-3);">
          ${isFirstTime
            ? 'Conoce tu sistema antes de entrar en batalla. Cada zona es una herramienta de tu arsenal.'
            : 'Tu arsenal de métricas y herramientas. Toca cada zona para explorarla.'}
        </div>
      </div>

      <!-- Stats rápidos del usuario (si tiene datos) -->
      ${user.icd !== undefined ? `
        <div style="display:flex;gap:10px;padding:0 20px 16px;overflow-x:auto;">
          <div style="background:rgba(212,168,67,0.08);border:1px solid var(--border-gold);
            border-radius:var(--r-md);padding:12px 16px;min-width:90px;text-align:center;flex-shrink:0;cursor:pointer;" 
            onclick="showInteractiveModal('ICD', 'El Índice de Consistencia es tu brújula interior. Mide qué tan firme es la palabra que te diste a ti mismo.', '🎯')">
            <div style="font-size:20px;font-weight:900;color:var(--gold);font-family:var(--font-head);">${user.icd || 0}</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;">ICD</div>
          </div>
          <div style="background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);
            border-radius:var(--r-md);padding:12px 16px;min-width:90px;text-align:center;flex-shrink:0;cursor:pointer;" 
            onclick="showInteractiveModal('Línea Activa (Fuego)', 'Tu racha actual. ¿Un mal día? Salva todo cumpliendo tan solo 1 diminuto pilar de tu pacto.', '🔥')">
            <div style="font-size:20px;font-weight:900;color:var(--fire);font-family:var(--font-head);">${user.lineaActiva || 0}🔥</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;">RACHA</div>
          </div>
          <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);
            border-radius:var(--r-md);padding:12px 16px;min-width:90px;text-align:center;flex-shrink:0;cursor:pointer;" 
            onclick="showInteractiveModal('Escudos Protectores', 'Salvan tu racha cuando fracasas rotundamente al reportar todo un día. Gánalos manteniendo un fuego largo e ininterrumpido.', '🛡️')">
            <div style="font-size:20px;font-weight:900;color:#EAB308;font-family:var(--font-head);">${user.escudos || 0}🛡️</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;">ESCUDOS</div>
          </div>
          <div style="background:rgba(123,97,255,0.08);border:1px solid rgba(123,97,255,0.2);
            border-radius:var(--r-md);padding:12px 16px;min-width:90px;text-align:center;flex-shrink:0;cursor:pointer;" 
            onclick="showInteractiveModal('Puntos PC', 'Divisa interna y poder adquisitivo. Úsalos como comprobante empírico de que honraste cada meta diaria por encima de tus límites.', '⚡')">
            <div style="font-size:20px;font-weight:900;color:var(--electric);font-family:var(--font-head);">${Number(user.pcTotal||0).toLocaleString('es-CO')}</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;">PC</div>
          </div>
          <div style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);
            border-radius:var(--r-md);padding:12px 16px;min-width:90px;text-align:center;flex-shrink:0;cursor:pointer;" 
            onclick="showInteractiveModal('Rango', 'Demuestra quién eres dentro de tu Célula de rendimiento. Escapa del promedio logrando Ascensos tácticos.', '👑')">
            <div style="font-size:20px;font-weight:900;color:#A855F7;font-family:var(--font-head);">${(user.rango||'🌱').split(' ')[0]}</div>
            <div style="font-size:10px;color:var(--text-3);letter-spacing:0.1em;">RANGO</div>
          </div>
        </div>
      ` : ''}

      <!-- Zonas del mapa -->
      <div style="padding:0 20px 120px;" id="ccZones">
        ${CC_ZONES.map((z, i) => `
          <div id="cc-zone-${z.id}"
            onclick="toggleCCZone('${z.id}')"
            style="background:var(--bg-elevated);border:1px solid var(--border);
              border-radius:var(--r-lg);margin-bottom:12px;overflow:hidden;
              transition:all 0.3s ease;cursor:pointer;
              animation:cc-reveal 0.5s ease ${i * 0.12}s both;">

            <div style="display:flex;align-items:center;gap:12px;padding:16px;">
              <div style="width:48px;height:48px;border-radius:var(--r-md);
                background:${z.color}18;border:1px solid ${z.color}40;
                display:flex;align-items:center;justify-content:center;
                font-size:22px;flex-shrink:0;">${z.emoji}</div>
              <div style="flex:1;">
                <div style="font-size:10px;letter-spacing:0.2em;color:${z.color};
                  text-transform:uppercase;margin-bottom:2px;">${z.corto}</div>
                <div style="font-weight:700;font-size:14px;color:var(--text-1);">${z.nombre}</div>
                <div style="font-size:12px;color:var(--text-3);margin-top:2px;line-height:1.4;">${z.desc}</div>
              </div>
              <div id="cc-chevron-${z.id}" style="color:var(--text-3);font-size:16px;
                transition:transform 0.3s ease;">⟩</div>
            </div>

            <div id="cc-detail-${z.id}" style="display:none;
              padding:0 16px 16px;border-top:1px solid var(--border);">
              <div style="padding-top:12px;">
                <div style="font-size:13px;color:var(--text-2);line-height:1.7;margin-bottom:12px;">${z.detalle}</div>
                <div style="background:${z.color}10;border-left:3px solid ${z.color};
                  padding:10px 14px;border-radius:0 var(--r-md) var(--r-md) 0;">
                  <div style="font-size:10px;color:${z.color};font-weight:700;
                    letter-spacing:0.15em;margin-bottom:4px;">💡 TIP</div>
                  <div style="font-size:12px;color:var(--text-2);line-height:1.6;">${z.tip}</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- CTA primera vez -->
      ${isFirstTime ? `
        <div style="padding:8px 20px 40px;text-align:center;">
          <button onclick="ccProceedToDashboard()"
            style="width:100%;padding:18px 24px;border:none;border-radius:var(--r-lg);
              cursor:pointer;font-family:var(--font-head);font-size:16px;font-weight:800;
              color:#0A0A0F;letter-spacing:0.08em;
              background:linear-gradient(135deg,var(--gold-dim),var(--gold));
              box-shadow:0 0 30px rgba(212,168,67,0.4);
              animation:pulse-gold 2s ease-in-out infinite;">
            🏛️ INICIAR MI LEGADO →
          </button>
          <div style="margin-top:10px;font-size:11px;color:var(--text-3);">
            Siempre puedes volver al Centro de Comandos desde la navegación
          </div>
        </div>
      ` : ''}

      <style>
        @keyframes cc-reveal {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-gold {
          0%,100% { box-shadow:0 0 20px rgba(212,168,67,0.3); }
          50%      { box-shadow:0 0 40px rgba(212,168,67,0.6); }
        }
      </style>
    </div>
  `;
}

function toggleCCZone(id) {
  const detail  = document.getElementById(`cc-detail-${id}`);
  const chevron = document.getElementById(`cc-chevron-${id}`);
  if (!detail) return;
  const isOpen = detail.style.display !== 'none';
  detail.style.display  = isOpen ? 'none' : 'block';
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(90deg)';
}

function ccProceedToDashboard() {
  localStorage.removeItem('laorden_first_visit');
  navigateTo('home');
}
