/**
 * LA ORDEN - views/tutorial.js  v26
 * Tutorial inmersivo de 8 pasos — primera visita post-pago.
 * Neuromarketing: identidad, exclusividad, compromiso, prueba social, pérdida.
 */

let selectedGuide   = null;
let tutCurrentStep  = 0;
const TUT_TOTAL     = 8;   // steps 0-7

// ── RENDER PRINCIPAL ──────────────────────────────────────
function renderTutorial(data) {
  tutCurrentStep = 0;
  return `
    <div class="view" id="view-tutorial"
      style="display:flex;flex-direction:column;min-height:100%;background:var(--bg-primary);position:relative;overflow:hidden;">

      <!-- ── INDICADOR DE PROGRESO (sticky) ── -->
      <div id="tut-progress-bar"
        style="position:sticky;top:0;z-index:100;background:rgba(10,10,15,0.95);
               padding:14px 24px 10px;border-bottom:1px solid var(--border);
               display:flex;align-items:center;justify-content:space-between;">
        <!-- Botón atrás -->
        <div id="tut-back-btn" onclick="prevTutStep()"
          style="font-size:20px;color:var(--gold);cursor:pointer;padding:4px 8px;
                 opacity:0;pointer-events:none;transition:opacity 0.3s;">←</div>
        <!-- Puntos -->
        <div id="tut-dots" style="display:flex;gap:6px;align-items:center;">
          ${Array.from({length: TUT_TOTAL}, (_,i) =>
            `<div id="tut-dot-${i}"
              style="width:7px;height:7px;border-radius:50%;transition:all 0.3s;
                     background:${i===0?'var(--gold)':'rgba(255,255,255,0.15)'};
                     transform:${i===0?'scale(1.3)':'scale(1)'};"></div>`
          ).join('')}
        </div>
        <!-- Paso X/8 -->
        <div id="tut-step-label"
          style="font-size:11px;color:var(--text-3);font-weight:700;letter-spacing:0.08em;min-width:36px;text-align:right;">
          1/${TUT_TOTAL}
        </div>
      </div>

      <!-- ── CONTENIDO DE STEPS ── -->
      <div style="flex:1;overflow-y:auto;padding:28px 24px 48px;">

        <!-- ══════════════════════════════════════════
             STEP 0: BIENVENIDA POST-PAGO
        ══════════════════════════════════════════ -->
        <div id="tut-step-0" class="tut-step" style="text-align:center;animation:tutFadeIn 0.6s ease;">

          <!-- Símbolo animado -->
          <div style="font-size:72px;margin-bottom:4px;animation:tutPulseGold 2.5s ease-in-out infinite;">🏛️</div>
          <div style="font-size:11px;letter-spacing:0.35em;color:var(--gold);text-transform:uppercase;
                      margin-bottom:24px;font-weight:800;">La Orden — El 1%</div>

          <h1 style="font-family:var(--font-head);font-weight:900;font-size:28px;
                     color:var(--text-1);margin-bottom:16px;line-height:1.15;">
            CRUZASTE<br><span style="color:var(--gold);">EL UMBRAL.</span>
          </h1>

          <div style="width:48px;height:2px;background:var(--gold);margin:0 auto 24px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:20px;">
            El <strong style="color:var(--text-1);">97% de las personas</strong> que llegaron
            hasta aquí, retrocedieron justo antes de comprometerse.<br><br>
            Tú no.<br><br>
            Esto no es un tutorial. Es la diferencia entre
            <em style="color:var(--gold);">saberlo</em> y
            <em style="color:var(--gold);">vivirlo</em>. En los próximos minutos
            recibirás tu briefing completo como miembro activo de La Orden.
          </p>

          <!-- Prueba social -->
          <div style="background:rgba(212,168,67,0.07);border:1px solid rgba(212,168,67,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:32px;text-align:left;">
            <div style="font-size:10px;color:var(--gold);font-weight:800;letter-spacing:0.15em;
                        text-transform:uppercase;margin-bottom:8px;">📊 Datos de la élite</div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.6;">
              Los miembros que completan este briefing tienen
              <strong style="color:var(--text-1);">3.2x más probabilidad</strong>
              de mantener su ICD por encima de 80 en el primer mes.
            </div>
          </div>

          <button onclick="nextTutStep(1)"
            style="width:100%;padding:18px;font-size:16px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:none;border-radius:var(--r-lg);cursor:pointer;
                   background:linear-gradient(135deg,var(--gold-dim),var(--gold));
                   color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:8px;
                   box-shadow:0 0 30px rgba(212,168,67,0.35);">
            RECIBIR MI BRIEFING <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 1: ELIGE TU GUÍA
        ══════════════════════════════════════════ -->
        <div id="tut-step-1" class="tut-step" style="display:none;opacity:0;text-align:center;">

          <div style="font-size:11px;letter-spacing:0.3em;color:var(--electric);
                      text-transform:uppercase;margin-bottom:12px;font-weight:800;">Decisión Táctica</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:26px;
                     color:var(--text-1);margin-bottom:10px;line-height:1.2;">
            ELIGE A TU<br><span style="color:var(--gold);">GUÍA DE COMBATE</span>
          </h2>
          <p style="font-size:13px;color:var(--text-3);margin-bottom:28px;line-height:1.6;">
            Esta IA monitoreará tu arquitectura mental y te entregará
            retroalimentación personalizada. No podrás cambiarla después.
            <strong style="color:var(--text-2);">Elige con intención.</strong>
          </p>

          <!-- Card ATENA -->
          <div onclick="selectGuide('Atena')" id="guide-card-atena"
            style="background:var(--bg-elevated);border:2px solid rgba(212,168,67,0.4);
                   border-radius:var(--r-lg);overflow:hidden;margin-bottom:16px;
                   cursor:pointer;transition:all 0.25s;text-align:left;">

            <!-- Imagen del personaje -->
            <div style="position:relative;height:180px;overflow:hidden;background:#0d0d0f;">
              <img src="${typeof TUT_IMG_ATENA !== 'undefined' ? TUT_IMG_ATENA : ''}"
                   alt="Atena"
                   style="width:100%;height:100%;object-fit:cover;object-position:center top;
                          filter:saturate(1.1) contrast(1.05);"
                   onerror="this.parentElement.innerHTML='<div style=\'font-size:80px;display:flex;align-items:center;justify-content:center;height:100%;\'>👁️</div>'"/>
              <!-- Overlay gradiente -->
              <div style="position:absolute;bottom:0;left:0;right:0;height:60px;
                          background:linear-gradient(transparent,var(--bg-elevated));"></div>
              <!-- Badge rol -->
              <div style="position:absolute;top:12px;right:12px;background:rgba(212,168,67,0.9);
                          color:#0A0A0F;font-size:10px;font-weight:900;letter-spacing:0.1em;
                          padding:4px 10px;border-radius:999px;">IA ESTRATEGA</div>
            </div>

            <!-- Contenido -->
            <div style="padding:16px;">
              <div style="font-family:var(--font-head);font-weight:900;font-size:22px;
                          color:var(--gold);margin-bottom:4px;letter-spacing:0.05em;">ATENA</div>
              <div style="font-size:11px;color:var(--text-3);letter-spacing:0.1em;
                          text-transform:uppercase;margin-bottom:14px;">Protocolo Élite · Datos & Sistemas</div>

              <!-- Burbuja de texto — primera persona -->
              <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.3);
                          border-radius:12px 12px 12px 0;padding:14px;margin-bottom:14px;
                          position:relative;">
                <div style="position:absolute;bottom:-8px;left:16px;width:0;height:0;
                             border-left:8px solid transparent;
                             border-right:0px solid transparent;
                             border-top:8px solid rgba(212,168,67,0.3);"></div>
                <p style="font-size:13px;color:var(--text-1);line-height:1.65;margin:0;font-style:italic;">
                  "Soy Atena. Mi función no es motivarte —
                  eso es para el 99%. Mi función es
                  <strong style="color:var(--gold);">construir el sistema</strong>
                  que hace innecesaria la motivación. Voy a auditar cada número,
                  cada patrón, cada excusa. Si tienes datos, los uso.
                  Si no los tienes, te los exijo."
                </p>
              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                <span style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.3);
                             color:var(--gold);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">🎯 Analítica</span>
                <span style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.3);
                             color:var(--gold);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">📊 Orientada a datos</span>
                <span style="background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.3);
                             color:var(--gold);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">🧊 Implacable</span>
              </div>

              <button style="width:100%;padding:14px;font-size:14px;font-weight:900;
                             font-family:var(--font-head);letter-spacing:0.08em;
                             border:2px solid var(--gold);border-radius:var(--r-md);cursor:pointer;
                             background:transparent;color:var(--gold);
                             display:flex;align-items:center;justify-content:center;gap:8px;">
                ELEGIR A ATENA <span>→</span>
              </button>
            </div>
          </div>

          <!-- Card DARIUS -->
          <div onclick="selectGuide('Darius')" id="guide-card-darius"
            style="background:var(--bg-elevated);border:2px solid rgba(239,68,68,0.4);
                   border-radius:var(--r-lg);overflow:hidden;margin-bottom:8px;
                   cursor:pointer;transition:all 0.25s;text-align:left;">

            <!-- Imagen del personaje -->
            <div style="position:relative;height:180px;overflow:hidden;background:#0d0805;">
              <img src="${typeof TUT_IMG_DARIUS !== 'undefined' ? TUT_IMG_DARIUS : ''}"
                   alt="Darius"
                   style="width:100%;height:100%;object-fit:cover;object-position:center top;
                          filter:saturate(1.2) contrast(1.1);"
                   onerror="this.parentElement.innerHTML='<div style=\'font-size:80px;display:flex;align-items:center;justify-content:center;height:100%;\'>🐺</div>'"/>
              <div style="position:absolute;bottom:0;left:0;right:0;height:60px;
                          background:linear-gradient(transparent,var(--bg-elevated));"></div>
              <div style="position:absolute;top:12px;right:12px;background:rgba(239,68,68,0.9);
                          color:#fff;font-size:10px;font-weight:900;letter-spacing:0.1em;
                          padding:4px 10px;border-radius:999px;">IA DE COMBATE</div>
            </div>

            <!-- Contenido -->
            <div style="padding:16px;">
              <div style="font-family:var(--font-head);font-weight:900;font-size:22px;
                          color:var(--fire);margin-bottom:4px;letter-spacing:0.05em;">DARIUS</div>
              <div style="font-size:11px;color:var(--text-3);letter-spacing:0.1em;
                          text-transform:uppercase;margin-bottom:14px;">Protocolo Fuego · Combate & Resistencia</div>

              <!-- Burbuja de texto — primera persona -->
              <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);
                          border-radius:12px 12px 12px 0;padding:14px;margin-bottom:14px;
                          position:relative;">
                <div style="position:absolute;bottom:-8px;left:16px;width:0;height:0;
                             border-left:8px solid transparent;
                             border-right:0px solid transparent;
                             border-top:8px solid rgba(239,68,68,0.3);"></div>
                <p style="font-size:13px;color:var(--text-1);line-height:1.65;margin:0;font-style:italic;">
                  "Soy Darius. No vine a darte palmadas en la espalda.
                  Vine a <strong style="color:var(--fire);">convertir tu incomodidad en tu mayor activo.</strong>
                  Cada vez que quieras rendirte, ahí estaré yo. La disciplina
                  que construyas conmigo no la consigues comprando otro curso.
                  Se forja. Todos los días."
                </p>
              </div>

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                <span style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                             color:var(--fire);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">🔥 Visceral</span>
                <span style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                             color:var(--fire);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">💥 Sin filtros</span>
                <span style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                             color:var(--fire);font-size:11px;font-weight:700;padding:4px 10px;
                             border-radius:999px;">⚔️ Combate</span>
              </div>

              <button style="width:100%;padding:14px;font-size:14px;font-weight:900;
                             font-family:var(--font-head);letter-spacing:0.08em;
                             border:2px solid var(--fire);border-radius:var(--r-md);cursor:pointer;
                             background:transparent;color:var(--fire);
                             display:flex;align-items:center;justify-content:center;gap:8px;">
                ELEGIR A DARIUS <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 2: MANDO CENTRAL (INICIO)
        ══════════════════════════════════════════ -->
        <div id="tut-step-2" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">🏛️</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--text-3);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Tu base de operaciones</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--text-1);margin-bottom:6px;line-height:1.2;">MANDO CENTRAL</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Inicio)</div>
          <div style="width:40px;height:2px;background:var(--text-1);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            Aquí aterriza tu guerra cada mañana. Tu
            <strong style="color:var(--text-1);">ICD late</strong>,
            tu <strong style="color:var(--text-1);">racha respira</strong>
            y tus misiones activas te reclutan antes de que te distrai­gas con algo inútil.
          </p>

          <div style="background:var(--bg-elevated);border:1px solid var(--border);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--gold);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              ⚡ Regla de Oro
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.6;">
              El primer minuto del día determina el resto.
              Los miembros que abren La Orden
              <strong style="color:var(--text-1);">antes de abrir otra app</strong>
              tienen un ICD promedio de <strong style="color:var(--gold);">82 puntos</strong>
              vs. 61 para los que lo hacen después.
            </div>
          </div>

          <button onclick="nextTutStep(3)"
            style="width:100%;padding:18px;font-size:15px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:1px solid var(--border);border-radius:var(--r-lg);cursor:pointer;
                   background:var(--bg-elevated);color:var(--text-1);
                   display:flex;align-items:center;justify-content:center;gap:8px;">
            ENTENDIDO <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 3: ZONA DE GUERRA (REPORTAR)
        ══════════════════════════════════════════ -->
        <div id="tut-step-3" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">⚡</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--electric);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Motor del sistema</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--electric);margin-bottom:6px;line-height:1.2;">ZONA DE GUERRA</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Reportar)</div>
          <div style="width:40px;height:2px;background:var(--electric);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            Donde transmutas esfuerzo en
            <strong style="color:var(--electric);">Puntos de Poder (PC)</strong>.
            Cada reporte sellado es una victoria que el sistema registra — y que tu guía evalúa.
            Sin reporte, no hay progreso. Sin progreso, no hay Orden.
          </p>

          <div style="background:rgba(99,179,237,0.07);border:1px solid rgba(99,179,237,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--electric);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              ⚠️ Lo que pierdes si no reportas
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.6;">
              • <strong style="color:var(--text-1);">1 día sin reportar</strong> → hasta −4 puntos de ICD<br>
              • <strong style="color:var(--text-1);">2 días seguidos</strong> → la racha se rompe<br>
              • <strong style="color:var(--text-1);">3 días</strong> → tu Célula te desclasifica
            </div>
          </div>

          <button onclick="nextTutStep(4)"
            style="width:100%;padding:18px;font-size:15px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:none;border-radius:var(--r-lg);cursor:pointer;
                   background:linear-gradient(135deg,var(--electric-dim),var(--electric));
                   color:#111;display:flex;align-items:center;justify-content:center;gap:8px;">
            ASUMO EL COMPROMISO <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 4: AUDITORÍA (ESTADÍSTICAS)
        ══════════════════════════════════════════ -->
        <div id="tut-step-4" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">📊</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--gold);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Inteligencia táctica</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--gold);margin-bottom:6px;line-height:1.2;">AUDITORÍA</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Stats)</div>
          <div style="width:40px;height:2px;background:var(--gold);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            La verdad fría de tu progreso. Aquí no hay narrativa — solo
            <strong style="color:var(--text-1);">datos reales</strong>:
            tu historial de 28 días, tus escudos acumulados y el veredicto semanal de tu Guía.
            El que no mide, no mejora. El que no mejora, retrocede.
          </p>

          <div style="background:rgba(212,168,67,0.07);border:1px solid rgba(212,168,67,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--gold);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              📈 Qué verás aquí
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.75;">
              • Tu <strong style="color:var(--text-1);">ICD</strong> — el activo que más te costará reconstruir<br>
              • El <strong style="color:var(--text-1);">historial de 28 días</strong> sin maquillaje<br>
              • El <strong style="color:var(--text-1);">informe semanal</strong> de tu Guía<br>
              • Tus <strong style="color:var(--text-1);">Escudos</strong> disponibles
            </div>
          </div>

          <button onclick="nextTutStep(5)"
            style="width:100%;padding:18px;font-size:15px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:1px solid var(--border);border-radius:var(--r-lg);cursor:pointer;
                   background:var(--bg-elevated);color:var(--text-1);
                   display:flex;align-items:center;justify-content:center;gap:8px;">
            SIGUIENTE <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 5: SANTUARIO (PACTO)
        ══════════════════════════════════════════ -->
        <div id="tut-step-5" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">📜</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--fire);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Tu contrato activo</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--fire);margin-bottom:6px;line-height:1.2;">SANTUARIO</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Pacto)</div>
          <div style="width:40px;height:2px;background:var(--fire);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            Tu contrato de 30 días y el cuartel de
            <strong id="tutGuideName" style="color:var(--text-1);">tu Guía</strong>.
            Aquí viven las penalizaciones que juraste aceptar, los comunicados diarios
            de la élite y tus misiones activas.
            <strong style="color:var(--fire);">Leerlo no es opcional.</strong>
          </p>

          <div style="background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--fire);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              🔥 La ley de La Orden
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.75;">
              Cada misión incumplida se refleja en tu ICD.
              Tu ICD determina tu rango. Tu rango determina
              <strong style="color:var(--text-1);">cómo te ve tu Célula.</strong>
              La presión social es el mecanismo de accountability más poderoso conocido.
            </div>
          </div>

          <button onclick="nextTutStep(6)"
            style="width:100%;padding:18px;font-size:15px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:none;border-radius:var(--r-lg);cursor:pointer;
                   background:linear-gradient(135deg,rgba(239,68,68,0.6),var(--fire));
                   color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;">
            LO ACEPTO <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 6: CÉLULA (nuevo)
        ══════════════════════════════════════════ -->
        <div id="tut-step-6" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">⚔️</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--success);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Hermanos de Armas</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--text-1);margin-bottom:6px;line-height:1.2;">TU CÉLULA</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Célula)</div>
          <div style="width:40px;height:2px;background:var(--success);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            No asciende solo quien lo intenta en solitario.
            La Orden te asigna automáticamente una
            <strong style="color:var(--text-1);">Célula de 5-8 personas</strong>
            con objetivos similares. Su ICD sube cuando tú reportas.
            El tuyo cae cuando ellos te ven rendirte.
          </p>

          <!-- Stat de prueba social -->
          <div style="background:rgba(34,197,94,0.07);border:1px solid rgba(34,197,94,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:16px;text-align:left;">
            <div style="font-size:12px;color:var(--success);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              📊 Poder de la Célula
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.75;">
              Los miembros con Célula activa tienen
              <strong style="color:var(--text-1);">2.4x más probabilidad</strong>
              de completar su primer contrato de 30 días que quienes operan solos.<br><br>
              La <strong style="color:var(--text-1);">presión social positiva</strong>
              es el sustituto más poderoso de la fuerza de voluntad.
            </div>
          </div>

          <div style="background:var(--bg-elevated);border:1px solid var(--border);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--text-3);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Mecánica</div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.6;">
              El leaderboard de tu Célula se actualiza en tiempo real.
              Tu posición refleja tu ICD promedio de los últimos 7 días.
              <strong style="color:var(--text-1);">Nadie quiere ser el último.</strong>
            </div>
          </div>

          <button onclick="nextTutStep(7)"
            style="width:100%;padding:18px;font-size:15px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:1px solid var(--border);border-radius:var(--r-lg);cursor:pointer;
                   background:var(--bg-elevated);color:var(--text-1);
                   display:flex;align-items:center;justify-content:center;gap:8px;">
            SIGUIENTE <span>→</span>
          </button>
        </div>

        <!-- ══════════════════════════════════════════
             STEP 7: TERRITORIO (MAPA)
        ══════════════════════════════════════════ -->
        <div id="tut-step-7" class="tut-step" style="display:none;opacity:0;text-align:center;">
          <div style="font-size:68px;margin-bottom:16px;">🗺️</div>
          <div style="font-size:10px;letter-spacing:0.3em;color:var(--gold);
                      text-transform:uppercase;margin-bottom:8px;font-weight:700;">Tu brújula estratégica</div>
          <h2 style="font-family:var(--font-head);font-weight:900;font-size:25px;
                     color:var(--gold);margin-bottom:6px;line-height:1.2;">TERRITORIO</h2>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:16px;">(Pestaña Mapa)</div>
          <div style="width:40px;height:2px;background:var(--gold);margin:0 auto 20px;"></div>

          <p style="font-size:15px;color:var(--text-2);line-height:1.75;margin-bottom:24px;">
            Tu cuartel estratégico permanente. Aquí monitoreás tus métricas clave,
            exploráis el Códice de Tácticas — el glosario científico de cada hábito —
            y comprendes las mecánicas que gobiernan tu ascenso.
            <strong style="color:var(--gold);">Conocerlas no es opcional. Es poder.</strong>
          </p>

          <div style="background:rgba(212,168,67,0.07);border:1px solid rgba(212,168,67,0.25);
                      border-radius:var(--r-lg);padding:16px;margin-bottom:28px;text-align:left;">
            <div style="font-size:12px;color:var(--gold);font-weight:800;
                        letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">
              🗺️ Qué encontrarás
            </div>
            <div style="font-size:13px;color:var(--text-2);line-height:1.75;">
              • <strong style="color:var(--text-1);">Zonas de métricas</strong> — ICD, Racha, PC, Rango<br>
              • <strong style="color:var(--text-1);">Códice de Tácticas</strong> — ciencia detrás de cada hábito<br>
              • <strong style="color:var(--text-1);">Escala de Rangos</strong> — hacia dónde vas<br>
              • <strong style="color:var(--text-1);">Mecánicas del sistema</strong> — cómo funciona La Orden
            </div>
          </div>

          <!-- CTA final — máximo peso -->
          <button onclick="finishTutorial()"
            style="width:100%;padding:20px;font-size:16px;font-weight:900;
                   font-family:var(--font-head);letter-spacing:0.08em;
                   border:none;border-radius:var(--r-lg);cursor:pointer;
                   background:linear-gradient(135deg,var(--gold-dim),var(--gold));
                   color:#0A0A0F;display:flex;align-items:center;justify-content:center;gap:8px;
                   box-shadow:0 0 40px rgba(212,168,67,0.4);
                   animation:tutPulseGold 2.5s ease-in-out infinite;">
            🏛️ SABER ES PODER. ENTRAR AL SISTEMA.
          </button>
          <div style="margin-top:12px;font-size:11px;color:var(--text-3);line-height:1.5;">
            Tu guía ya está activo. Tu Célula te espera.
          </div>
        </div>

      </div><!-- /contenido -->

      <style>
        @keyframes tutFadeIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes tutPulseGold {
          0%,100% { box-shadow: 0 0 20px rgba(212,168,67,0.3); }
          50%      { box-shadow: 0 0 45px rgba(212,168,67,0.65); }
        }
        .tut-step { transition: opacity 0.4s ease, transform 0.4s ease; }
      </style>
    </div>
  `;
}

// ── SELECCIÓN DE GUÍA ─────────────────────────────────────
function selectGuide(guideName) {
  selectedGuide = guideName;
  localStorage.setItem('laorden_selected_guide', guideName);

  // Actualizar todos los spans con el nombre del guía
  document.querySelectorAll('[id^="tutGuideName"]').forEach(el => {
    el.textContent = guideName;
  });
  document.getElementById('tutGuideName') && (document.getElementById('tutGuideName').textContent = guideName);

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
  nextTutStep(2);
}

// ── NAVEGACIÓN ────────────────────────────────────────────
function nextTutStep(step) {
  _animateTutTransition(step, 'forward');
}

function prevTutStep() {
  if (tutCurrentStep <= 0) return;
  const prev = tutCurrentStep - 1;
  _animateTutTransition(prev, 'back');
}

function _animateTutTransition(targetStep, direction) {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }

  const outY = direction === 'forward' ? '-20px' : '20px';
  const inY  = direction === 'forward' ? '20px'  : '-20px';

  // Ocultar actual
  document.querySelectorAll('.tut-step').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = `translateY(${outY})`;
    setTimeout(() => {
      el.style.display = 'none';
      el.classList.remove('active');
    }, 350);
  });

  // Mostrar siguiente
  setTimeout(() => {
    const nextEl = document.getElementById('tut-step-' + targetStep);
    if (!nextEl) return;
    nextEl.style.display   = 'block';
    nextEl.style.opacity   = '0';
    nextEl.style.transform = `translateY(${inY})`;
    void nextEl.offsetWidth; // reflow
    nextEl.style.opacity   = '1';
    nextEl.style.transform = 'translateY(0)';
    nextEl.classList.add('active');

    tutCurrentStep = targetStep;
    _updateTutProgress(targetStep);

    // Scroll al inicio del contenido en cada step
    const container = document.querySelector('#view-tutorial > div:last-of-type');
    if (container) container.scrollTop = 0;
  }, 380);
}

// ── ACTUALIZAR INDICADOR ──────────────────────────────────
function _updateTutProgress(step) {
  // Dots
  for (let i = 0; i < TUT_TOTAL; i++) {
    const dot = document.getElementById('tut-dot-' + i);
    if (!dot) continue;
    if (i === step) {
      dot.style.background  = 'var(--gold)';
      dot.style.transform   = 'scale(1.3)';
    } else if (i < step) {
      dot.style.background  = 'rgba(212,168,67,0.5)';
      dot.style.transform   = 'scale(1)';
    } else {
      dot.style.background  = 'rgba(255,255,255,0.15)';
      dot.style.transform   = 'scale(1)';
    }
  }

  // Etiqueta paso X/N
  const lbl = document.getElementById('tut-step-label');
  if (lbl) lbl.textContent = `${step + 1}/${TUT_TOTAL}`;

  // Botón atrás — visible desde step 1
  const backBtn = document.getElementById('tut-back-btn');
  if (backBtn) {
    if (step > 0) {
      backBtn.style.opacity       = '1';
      backBtn.style.pointerEvents = 'auto';
    } else {
      backBtn.style.opacity       = '0';
      backBtn.style.pointerEvents = 'none';
    }
  }
}

// ── FINALIZAR TUTORIAL ────────────────────────────────────
function finishTutorial() {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
  localStorage.removeItem('laorden_first_visit');
  localStorage.setItem('laorden_tutorial_done', '1');

  // Restaurar nav
  const nav = document.getElementById('bottomNav');
  if (nav) {
    nav.style.pointerEvents = '';
    nav.style.opacity       = '';
    nav.style.filter        = '';
  }

  if (typeof startConfetti === 'function') startConfetti();
  setTimeout(() => { if (typeof stopConfetti === 'function') stopConfetti(); }, 3500);

  navigateTo('command_center');
}

// ── FRICCIÓN AL SALIR ─────────────────────────────────────
function _mostrarFriccionTutorial() {
  if (window.Telegram?.WebApp?.showPopup) {
    window.Telegram.WebApp.showPopup({
      title: '⚠️ ¿Abandonar la iniciación?',
      message: 'Los miembros que no completan el briefing inicial tienen 3x menos probabilidad de mantener su membresía activa los primeros 30 días.\n\n¿Seguro que quieres salir ahora?',
      buttons: [
        { id: 'exit',     type: 'destructive', text: 'Salir (arriesgar mi inversión)' },
        { id: 'continue', type: 'default',      text: '¡Continuar la iniciación!' }
      ]
    }, (btnId) => {
      if (btnId === 'exit') {
        finishTutorial(); // lo marcamos como visto y salimos
      }
    });
  } else {
    const ok = confirm('¿Abandonar la iniciación?\n\nLos miembros que no completan el briefing tienen 3x menos probabilidad de mantenerse activos.\n\n¿Salir?');
    if (ok) finishTutorial();
  }
}
