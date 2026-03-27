/**
 * 🏛️ LA ORDEN — api.js
 * Capa de comunicación con el backend GAS
 */

const GAS_API_URL = window.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwoKZ_Rol4ZwncndruxX96syz7UDSG1C6L4B9H-UHVwkuTczL3B7YPZJBmjmxAcqNX1lQ/exec';

/* ─── DEBUG HELPER ─────────────────────────────────────── */
function _showDebug(msg, color) {
  return; // Debug silencioso para producción
}

/* ─── ESTADO DE USUARIO SIN REGISTRO ──────────────────── */
// Usado cuando el usuario existe en Telegram pero no ha firmado el juramento
function _buildNoRegistradoData(tgUser) {
  const nombre = tgUser ? (tgUser.first_name || 'Aspirante') : 'Aspirante';
  return {
    _noRegistrado: true,  // flag para el UI
    user: {
      nombre:      nombre,
      rango:       '🌱 Aspirante',
      rangoId:     'ASPIRANTE',
      icd:         0,
      lineaActiva: 0,
      pcTotal:     0,
      diasActivos: 0,
      escudos:     0,
      tendencia:   '→',
      celula:      '',
      estadoPago:  'PENDIENTE',
    },
    compromisos: [],
    contrato:    null,  // null = sin juramento firmado
    celula:      [],
    historial:   Array(28).fill(0),
    semana:      Array(7).fill(0),
  };
}

/* ─── FETCH PRINCIPAL ───────────────────────────────────── */
async function fetchUserData() {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  if (!tg) {
    _showDebug('Sin Telegram.WebApp — modo navegador');
    return _buildNoRegistradoData(null);
  }

  const initData   = tg.initData || '';
  const unsafe     = tg.initDataUnsafe || {};
  const tgUser     = unsafe.user || null;
  const tid        = tgUser ? String(tgUser.id) : '';

  _showDebug(
    'Telegram OK · ' +
    'initData: ' + (initData ? '✅' : '⚠️VACÍO') +
    ' · tid: ' + (tid || '⚠️') +
    ' · nombre: ' + (tgUser ? tgUser.first_name : '—')
  );

  if (!initData && !tid) {
    _showDebug('❌ Sin identificación', '#700');
    return _buildNoRegistradoData(tgUser);
  }

  const url = GAS_API_URL
    + '?initData=' + encodeURIComponent(initData)
    + (tid ? '&tid=' + tid : '');

  try {
    const resp = await fetch(url, { method: 'GET' });

    if (!resp.ok) {
      _showDebug('❌ HTTP ' + resp.status, '#700');
      return _buildNoRegistradoData(tgUser);
    }

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); }
    catch(pe) {
      _showDebug('❌ JSON inválido: ' + text.substring(0,80), '#700');
      return _buildNoRegistradoData(tgUser);
    }

    // Usuario no encontrado en la hoja (nunca empezó el onboarding)
    if (data.error === 'Usuario no encontrado' || data.registered === false) {
      _showDebug('ℹ️ Usuario sin registro — onboarding desde cero', '#440');
      return _buildNoRegistradoData(tgUser);
    }

    if (data.error) {
      _showDebug('❌ Error backend: ' + data.error, '#700');
      return _buildNoRegistradoData(tgUser);
    }

    if (!data.user) {
      _showDebug('❌ Respuesta sin user', '#700');
      return _buildNoRegistradoData(tgUser);
    }

    // Usuario que completó compromisos/juramento pero NO pagó todavía
    // El backend devuelve _onboardingIncompleto: true para este estado
    if (data._onboardingIncompleto) {
      _showDebug('ℹ️ Onboarding incompleto — redirigir a pago', '#840');
      // Preservar los compromisos ya guardados en el estado OB del onboarding
      return data; // app.js manejará el flag _onboardingIncompleto
    }

    _showDebug('✅ ' + data.user.nombre + ' · ICD:' + data.user.icd + ' · Pago:' + data.user.estadoPago, '#050');
    return data;

  } catch (e) {
    _showDebug('❌ Fetch: ' + e.message, '#700');
    return _buildNoRegistradoData(tgUser);
  }
}

/* ─── POST REPORTE ──────────────────────────────────────── */
async function postReport(compromisoId, valor) {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (!tg) {
    return { ok: true, pcGanados: 0, cumplimiento: 100, esCritico: false };
  }
  try {
    const body = { action: 'REPORT', compromisoId, valor };
    if (tg.initData) body.initData = tg.initData;
    else if (tg.initDataUnsafe && tg.initDataUnsafe.user) body.tid = String(tg.initDataUnsafe.user.id);

    const resp = await fetch(GAS_API_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return await resp.json();
  } catch (e) {
    console.error('[LaOrden] postReport falló:', e.message);
    return { ok: false };
  }
}

/* ─── ONBOARDING API ─────────────────────────────────────── */

/** Catálogo de compromisos para un área */
async function fetchCatalog(areaId) {
  try {
    const resp = await fetch(`${GAS_API_URL}?action=catalog&area=${areaId}`, { method: 'GET' });
    const data = await resp.json();
    return data.catalog || [];
  } catch(e) { return []; }
}

/** Crea el usuario en GAS con nombre + telegramId */
async function createUser(nombre) {
  return _postOnboarding({ action: 'CREATE_USER', nombre });
}

/** Guarda la lista de compromisos del onboarding */
async function saveCompromisos(lista) {
  return _postOnboarding({ action: 'SAVE_COMPROMISOS', compromisos: lista });
}

/** Firma el juramento y crea el contrato de 30 días */
async function signUserOath() {
  return _postOnboarding({ action: 'SIGN_OATH' });
}

/** OPTIMIZACION: Ejecuta los 3 pasos de onboarding en una sola llamada de red (60% mas rapido) */
async function sealFullPact(nombre, compromisos) {
  return _postOnboarding({ action: 'SEAL_PACT', nombre, compromisos });
}


async function _postOnboarding(body) {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg && tg.initData) body.initData = tg.initData;
  else if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) body.tid = String(tg.initDataUnsafe.user.id);

  try {
    const resp = await fetch(GAS_API_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return await resp.json();
  } catch(e) {
    console.error('[LaOrden] onboarding POST falló:', e.message);
    return { ok: false, error: e.message };
  }
}
