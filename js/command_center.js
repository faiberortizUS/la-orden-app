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
    desc:   'Tu activo más frágil. Un solo día de silencio destruye lo que tardaste semanas en construir. El ICD mide los últimos 28 días — el sistema no olvida.',
    detalle:'100 = consistencia perfecta. 85+ = Zona Élite del 1%.\n\nLo que pierdes al fallar:\n• 1 día sin reportar → hasta −4 puntos de ICD\n• 2 días seguidos → penalización exponencial\n• Caer de 85 a 70 puede costar 3 semanas de trabajo\n\nEl ICD no sube de golpe. Cae en horas. Sube en semanas.',
    tip:    '⚠️ Cada día que no reportas, el sistema registra un 0% de cumplimiento. Esos ceros se promedian sobre 28 días y arrastran tu ICD hacia abajo. No pierdas hoy lo que construiste ayer.',
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
  const icd = user.icd || 0;
  const pcFmt = Number(user.pcTotal||0).toLocaleString('es-CO');

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
        <div class="stagger-up stagger-1" style="display:flex; flex-wrap:wrap; gap:10px; padding:0 20px 20px;">
          <!-- FILA 1: ICD (100% full width hero) -->
          <div class="stat-chip tappable ${icd > 85 ? 'breathe-gold' : icd < 50 ? 'breathe-danger' : ''}" 
            onclick="showInteractiveModal('🎯 ICD — Tu Activo Más Frágil', 'El ICD no sube de golpe. Cae en horas. Sube en semanas.\\n\\nCada día sin reportar, el sistema registra 0% de cumplimiento y ese cero se promedia sobre 28 días.\\n\\n<b>Lo que pierdes al fallar:</b>\\n• 1 día → hasta −4 puntos\\n• 2 días seguidos → penalización exponencial\\n• Caer de 85 a 70 toma 3 semanas recuperar\\n\\nEl sistema no olvida. Tú tampoco puedes permitirte olvidar.', '🎯')"
            style="flex: 1 1 100%; display:flex; align-items:center; justify-content:space-between; padding:16px 20px;">
            <div style="text-align:left;">
                <div class="stat-lbl" style="font-size:12px; margin-bottom:4px;">ÍNDICE DE CONSISTENCIA</div>
                <div class="stat-val" style="color:var(--gold); font-size:32px;">${icd} <span style="font-size:16px;color:var(--text-3);font-weight:600;">/100</span></div>
            </div>
            <div style="font-size:32px; filter:grayscale(1) opacity(0.2);">🎯</div>
          </div>
          
          <!-- FILA 2: Racha y Escudos (50/50 block) -->
          <div class="stat-chip tappable" style="flex: 1 1 calc(50% - 10px); display:flex; flex-direction:column; align-items:center; padding:16px 10px;" 
            onclick="showInteractiveModal('Linea Activa (Fuego)', 'Tu racha actual. Un mal dia? Salva todo cumpliendo tan solo 1 pilar de tu pacto.', '🔥')">
            <div class="stat-val" style="color:var(--fire); font-size:24px;">${user.lineaActiva || 0}🔥</div>
            <div class="stat-lbl" style="font-size:11px; margin-top:6px; letter-spacing:0.05em;">RACHA ACTIVA</div>
          </div>
          
          <div class="stat-chip tappable" style="flex: 1 1 calc(50% - 10px); display:flex; flex-direction:column; align-items:center; padding:16px 10px;" 
            onclick="showInteractiveModal('Escudos Protectores', 'Salvan tu racha cuando fracasas rotundamente al reportar todo un dia. Ganalos manteniendo un fuego largo e ininterrumpido.', '🛡️')">
            <div class="stat-val" style="color:#EAB308; font-size:24px;">${user.escudos || 0}🛡️</div>
            <div class="stat-lbl" style="font-size:11px; margin-top:6px; letter-spacing:0.05em;">ESCUDOS</div>
          </div>

          <!-- FILA 3: PC y Rango (50/50 block) -->
          <div class="stat-chip tappable" style="flex: 1 1 calc(50% - 10px); display:flex; flex-direction:column; align-items:center; padding:16px 10px;" 
            onclick="showInteractiveModal('Puntos PC', 'Divisa interna. Usalos como comprobante empirico de que honraste cada meta diaria.', '⚡')">
            <div class="stat-val" style="color:var(--electric); font-size:24px;">${pcFmt}</div>
            <div class="stat-lbl" style="font-size:11px; margin-top:6px; letter-spacing:0.05em;">PUNTOS PODER</div>
          </div>
          
          <div class="stat-chip tappable" style="flex: 1 1 calc(50% - 10px); display:flex; flex-direction:column; align-items:center; padding:16px 10px;" 
            onclick="showInteractiveModal('Rango', 'Demuestra quien eres dentro de tu Celula de rendimiento. Escala posiciones logrando ascensos tacticos.', '👑')">
            <div class="stat-val" style="color:#A855F7; font-size:24px;">${(user.rango||'🌱').split(' ')[0]}</div>
            <div class="stat-lbl" style="font-size:11px; margin-top:6px; letter-spacing:0.05em;">RANGO</div>
          </div>
        </div>
      ` : ''}

      <!-- Zonas del mapa -->
      <div class="cc-grid stagger-up stagger-2" style="padding:0 20px 120px;" id="ccZones">
        ${CC_ZONES.map((z, i) => `
          <div id="cc-zone-${z.id}"
            class="cc-card tappable"
            onclick="toggleCCZone('${z.id}')"
            style="background:var(--bg-elevated);border:1px solid var(--border);
              border-radius:var(--r-lg);margin-bottom:12px;overflow:hidden;
              transition:all 0.3s ease;cursor:pointer;">

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
