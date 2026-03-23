/**
 * 🏛️ LA ORDEN — api.js
 * Capa de comunicación con el backend GAS
 */

const GAS_API_URL = window.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwoKZ_Rol4ZwncndruxX96syz7UDSG1C6L4B9H-UHVwkuTczL3B7YPZJBmjmxAcqNX1lQ/exec';

const DEMO_DATA = {
  user: {
    nombre: 'DEMO — No conectado', rango: '🌱 Aspirante', rangoId: 'ASPIRANTE',
    icd: 0, lineaActiva: 0, pcTotal: 0, diasActivos: 0, escudos: 0,
    tendencia: '→', celula: 'Célula Demo', estadoPago: 'PENDIENTE',
  },
  compromisos: [],
  contrato: { numero:1, inicio:'2026-03-23', fin:'2026-04-23', diasTotales:30, diasRestantes:30, renovaciones:0 },
  celula: [],
  historial: Array(28).fill(0),
  semana: [0,0,0,0,0,0,0],
};

/* ─── DEBUG HELPER ─────────────────────────────────────── */
function _showDebug(msg, color) {
  var el = document.getElementById('debugBanner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'debugBanner';
    el.style.cssText = 'position:fixed;bottom:80px;left:0;right:0;z-index:9999;padding:10px 14px;font-size:12px;font-family:monospace;word-break:break-all;line-height:1.4;max-height:220px;overflow-y:auto;';
    document.body.appendChild(el);
  }
  el.style.background = color || '#1a0a0a';
  el.style.color = color ? '#fff' : '#ff9';
  el.style.borderTop = '2px solid ' + (color || '#ff0');
  el.innerHTML = '🔍 DEBUG:<br>' + msg;
}

/* ─── FETCH PRINCIPAL ───────────────────────────────────── */
async function fetchUserData() {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  // Detectar si estamos en Telegram
  if (!tg) {
    _showDebug('Sin objeto Telegram.WebApp — abierto en navegador');
    return DEMO_DATA;
  }

  // Recopilar identificadores disponibles
  const initData   = tg.initData || '';
  const unsafe     = tg.initDataUnsafe || {};
  const tgUser     = unsafe.user || null;
  const tid        = tgUser ? String(tgUser.id) : '';

  _showDebug(
    'Telegram detectado<br>' +
    'initData: ' + (initData ? initData.substring(0,40)+'…' : '⚠️ VACÍO') + '<br>' +
    'tid: ' + (tid || '⚠️ NO DISPONIBLE') + '<br>' +
    'nombre: ' + (tgUser ? tgUser.first_name : '—')
  );

  if (!initData && !tid) {
    _showDebug('❌ Sin initData ni tid', '#700');
    return DEMO_DATA;
  }

  // Enviar SIEMPRE initData + tid como respaldo
  // GAS usa tid si no puede parsear initData
  var url = GAS_API_URL
    + '?initData=' + encodeURIComponent(initData)
    + (tid ? '&tid=' + tid : '');

  try {
    _showDebug('Llamando GAS…');
    const resp = await fetch(url, { method: 'GET' });


    if (!resp.ok) {
      _showDebug('❌ HTTP ' + resp.status + ': ' + resp.statusText, '#700');
      return DEMO_DATA;
    }

    const text = await resp.text();
    _showDebug('GAS raw response: ' + text.substring(0, 200));

    let data;
    try {
      data = JSON.parse(text);
    } catch(pe) {
      _showDebug('❌ No es JSON válido: ' + text.substring(0, 100), '#700');
      return DEMO_DATA;
    }

    if (data.error) {
      _showDebug('❌ Error del backend: ' + data.error, '#700');
      return DEMO_DATA;
    }

    if (!data.user) {
      _showDebug('❌ Respuesta sin campo user: ' + JSON.stringify(data).substring(0,100), '#700');
      return DEMO_DATA;
    }

    _showDebug('✅ OK — ' + data.user.nombre + ' | ICD: ' + data.user.icd, '#050');
    return data;

  } catch (e) {
    _showDebug('❌ Fetch exception: ' + e.message, '#700');
    return DEMO_DATA;
  }
}

/* ─── POST REPORTE ──────────────────────────────────────── */
async function postReport(compromisoId, valor) {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (!tg || (!tg.initData && !(tg.initDataUnsafe && tg.initDataUnsafe.user))) {
    return { ok: true, pcGanados: 28, cumplimiento: 100, esCritico: false };
  }
  try {
    const body = { action: 'REPORT', compromisoId, valor };
    if (tg.initData) {
      body.initData = tg.initData;
    } else {
      body.tid = String(tg.initDataUnsafe.user.id);
    }
    const resp = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await resp.json();
  } catch (e) {
    console.error('[LaOrden] postReport falló:', e.message);
    return { ok: false };
  }
}
