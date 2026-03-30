/**
 * 🏛️ LA ORDEN — views/celula.js
 * Leaderboard de la Célula
 */

function renderCelula(data) {
  const { user, celula } = data;
  const sorted = [...celula].sort((a,b) => b.icd - a.icd);
  const myPos  = sorted.findIndex(m => m.yo) + 1;
  const total  = sorted.length;

  const medals = ['🥇','🥈','🥉'];
  const posColors = ['gold','silver','bronze'];

  return `
    <div class="view" id="view-celula">

      <!-- Tu posición destacada -->
      <div class="card card--glass card--gold" style="text-align:center; padding: var(--s6); cursor:pointer;" onclick="showInteractiveModal('Ley de la Hermandad Táctica', 'La Célula es presión social pura. O eres el miembro incansable que eleva al resto de los guerreros, o eres tú el ancla que empuja la integridad general al abismo.<br><br><b>🏆 El Leaderboard es implacable:</b> Ordena asimétricamente a los miembros comparando estrictamente las puntuaciones de ICD.', '⚔️')">
        <div style="font-size:11px; font-weight:600; letter-spacing:0.12em; color:var(--text-3); text-transform:uppercase; margin-bottom:8px;">
          Tu posición en la Célula
        </div>
        <div style="font-family:var(--font-head); font-size:64px; font-weight:900; color:var(--gold); line-height:1; text-shadow: var(--glow-gold);">
          #${myPos}
        </div>
        <div class="text-sm text-muted" style="margin-top:6px;">de ${total} miembros</div>
        <div style="margin-top:16px; display:flex; justify-content:center; gap:8px;">
          <span class="badge-chip badge-chip--gold">⚡ ICD ${user.icd}</span>
          <span class="badge-chip badge-chip--fire">${user.lineaActiva}🔥</span>
        </div>
      </div>

      <!-- CTA Compartir -->
      <button onclick="compartirRanking()" style="
        width:100%; padding:var(--s3) var(--s4);
        background:var(--bg-elevated); border:1px solid var(--border);
        border-radius:var(--r-md); color:var(--text-2); font-size:13px;
        font-weight:600; cursor:pointer; display:flex; align-items:center;
        justify-content:center; gap:8px; transition:all 0.2s;
        -webkit-tap-highlight-color:transparent;
      ">
        🔗 Compartir mi posición en Telegram
      </button>

      <!-- Tabla de la Célula -->
      <div class="card" style="padding:var(--s4);">
        <div class="section-title" style="margin-bottom:var(--s4);">${user.celula}</div>

        ${sorted.map((m, i) => {
          const pos = i + 1;
          const posLabel = pos <= 3 ? medals[i] : `#${pos}`;
          const posClass = pos <= 3 ? posColors[i] : '';
          const maxIcd   = sorted[0].icd;

          return `
            <div class="celula-rank-item ${m.yo ? 'me' : ''}">
              <div class="celula-pos ${posClass}">${posLabel}</div>
              <div class="celula-avatar">${m.yo ? '👤' : '👥'}</div>
              <div class="celula-info">
                <div class="celula-name">${m.nombre} ${m.yo ? '<span class="celula-me-tag">TÚ</span>' : ''}</div>
                <div class="celula-icd">ICD <span class="celula-icd-val">${m.icd}</span> · ${getZoneLabel(m.icd)}</div>
              </div>
              <div class="celula-bar">
                <div class="prog-bar-wrap">
                  <div class="prog-bar-fill" style="width:${(m.icd/maxIcd)*100}%; background: ${m.yo ? 'var(--gold)' : 'var(--electric-dim)'}"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Motivación de la célula -->
      <div class="card" style="border-color:var(--border-gold); background:linear-gradient(135deg, rgba(212,168,67,0.06), rgba(212,168,67,0.02));">
        <div class="fw-700" style="color:var(--gold); font-size:14px; margin-bottom:8px;">🤝 Ley de la Célula</div>
        <div class="text-sm text-muted" style="line-height:1.6;">
          Tu Célula ve tu progreso. Tu negligencia los afecta. Tu excelencia los eleva.
          <br><br>
          No seas el miembro que el grupo señala.
        </div>
      </div>

    </div>
  `;
}

function getZoneLabel(icd) {
  if (icd >= 85) return '🎯 Élite';
  if (icd >= 70) return '⬆️ Sólido';
  if (icd >= 50) return '🔄 Progresando';
  return '⚠️ Crítico';
}

function compartirRanking() {
  if (window.Telegram?.WebApp) {
    const data = window._appData;
    const myPos = [...data.celula].sort((a,b) => b.icd - a.icd).findIndex(m => m.yo) + 1;
    const msg = `¡Soy #${myPos} en mi Célula de La Orden con un ICD de ${data.user.icd}! 🏛️⚔️ El 1% no para.`;
    window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent('https://t.me/LaOrdenTrackingBot') + '&text=' + encodeURIComponent(msg));
  }
}
