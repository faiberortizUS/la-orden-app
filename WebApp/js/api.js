/**
 * 🏛️ LA ORDEN — api.js
 * Capa de comunicación con el backend GAS
 */

// URL base del WebApp GAS (actualizar con la URL de despliegue)
const GAS_API_URL = window.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwoKZ_Rol4ZwncndruxX96syz7UDSG1C6L4B9H-UHVwkuTczL3B7YPZJBmjmxAcqNX1lQ/exec';

// Datos demo para testing visual sin backend
const DEMO_DATA = {
  user: {
    nombre: 'Carlos M.',
    rango: '🛡️ Comprometido',
    rangoId: 'COMPROMETIDO',
    icd: 83,
    lineaActiva: 14,
    pcTotal: 2340,
    diasActivos: 28,
    escudos: 1,
    tendencia: '↑ Subiendo',
    celula: 'Célula Alfa',
    estadoPago: 'ACTIVO',
  },
  compromisos: [
    { id: 'C1', nombre: 'Ejercicio cardiovascular', emoji: '🏃', area: 'SALUD_FISICA', meta: 45, unidad: 'min', pcBase: 30, hecho: false, valorHoy: 0 },
    { id: 'C2', nombre: 'Lectura de libros',        emoji: '📚', area: 'CRECIMIENTO',  meta: 30, unidad: 'min', pcBase: 25, hecho: true,  valorHoy: 30 },
    { id: 'C3', nombre: 'Ahorro diario',             emoji: '💰', area: 'FINANZAS',     meta: 50000, unidad: '$', pcBase: 30, hecho: false, valorHoy: 0 },
    { id: 'C4', nombre: 'Meditación',                emoji: '🧠', area: 'SALUD_MENTAL', meta: 15, unidad: 'min', pcBase: 25, hecho: false, valorHoy: 0 },
    { id: 'C5', nombre: 'Deep Work',                 emoji: '⚡', area: 'PRODUCTIVIDAD',meta: 90, unidad: 'min', pcBase: 35, hecho: true,  valorHoy: 95 },
  ],
  contrato: {
    numero: 2,
    inicio: '2026-02-22',
    fin: '2026-03-23',
    diasTotales: 30,
    diasRestantes: 5,
    renovaciones: 1,
  },
  celula: [
    { nombre: 'Diego V.',  icd: 91, yo: false },
    { nombre: 'Carlos M.', icd: 83, yo: true  },
    { nombre: 'Sofía R.', icd: 79, yo: false  },
    { nombre: 'Andrés P.',icd: 71, yo: false  },
    { nombre: 'Valeria C.',icd: 62, yo: false },
  ],
  historial: [
    // últimos 28 días — nivel 0-4
    0,1,2,3,4,3,2, 4,4,3,2,4,4,3, 2,4,4,4,3,2,4, 4,4,3,0,4,4,4
  ],
  semana: [82, 90, 75, 95, 0, 88, 83], // cumplimiento % últimos 7 días (0 = no programado)
};

/**
 * Carga los datos del usuario desde GAS o devuelve demo si falla
 */
async function fetchUserData() {
  // Si no hay Telegram WebApp o initData, usar demo
  if (!window.Telegram?.WebApp?.initData) {
    return DEMO_DATA;
  }

  try {
    const initData = window.Telegram.WebApp.initData;
    const resp = await fetch(`${GAS_API_URL}?initData=${encodeURIComponent(initData)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!resp.ok) throw new Error('GAS response not ok');
    const data = await resp.json();
    return data || DEMO_DATA;
  } catch (e) {
    console.warn('[LaOrden API] Usando datos demo:', e.message);
    return DEMO_DATA;
  }
}

/**
 * Registra un reporte de compromiso
 */
async function postReport(compromisoId, valor) {
  if (!window.Telegram?.WebApp?.initData) {
    // Demo: simular éxito
    return { ok: true, pcGanados: 28, cumplimiento: Math.round((valor / 45) * 100), esCritico: valor > 45 };
  }

  try {
    const initData = window.Telegram.WebApp.initData;
    const resp = await fetch(`${GAS_API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REPORT', initData, compromisoId, valor })
    });
    return await resp.json();
  } catch (e) {
    console.warn('[LaOrden API] Error en reporte:', e.message);
    return { ok: false };
  }
}
