/**
 * 🏛️ LA ORDEN — api.js
 * Capa de comunicación con el backend GAS
 */

// URL base del WebApp GAS
const GAS_API_URL = window.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwoKZ_Rol4ZwncndruxX96syz7UDSG1C6L4B9H-UHVwkuTczL3B7YPZJBmjmxAcqNX1lQ/exec';

// Datos demo para cuando no hay Telegram o falla la conexión
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
  ],
  contrato: {
    numero: 2, inicio: '2026-02-22', fin: '2026-03-23',
    diasTotales: 30, diasRestantes: 5, renovaciones: 1,
  },
  celula: [
    { nombre: 'Diego V.',  icd: 91, yo: false },
    { nombre: 'Carlos M.', icd: 83, yo: true  },
    { nombre: 'Sofía R.',  icd: 79, yo: false },
  ],
  historial: [0,1,2,3,4,3,2, 4,4,3,2,4,4,3, 2,4,4,4,3,2,4, 4,4,3,0,4,4,4],
  semana: [82, 90, 75, 95, 0, 88, 83],
};

/**
 * Carga los datos del usuario desde GAS.
 * Usa DEMO_DATA solo si no hay Telegram abierto (prueba en navegador).
 */
async function fetchUserData() {
  const tg = window.Telegram?.WebApp;

  // Sin Telegram: solo en browser directo → mostrar demo
  if (!tg || !tg.initData) {
    console.log('[LaOrden] Sin Telegram detectado — mostrando datos demo');
    return DEMO_DATA;
  }

  try {
    const initData = tg.initData;

    // ⚠️ CRÍTICO: NO usar headers en GET — causa preflight CORS que GAS no maneja
    const url  = `${GAS_API_URL}?initData=${encodeURIComponent(initData)}`;
    const resp = await fetch(url, { method: 'GET' });

    if (!resp.ok) {
      console.error('[LaOrden] HTTP error:', resp.status);
      return DEMO_DATA;
    }

    const data = await resp.json();

    // Si GAS devuelve error explícito, loggear y caer a demo
    if (data.error) {
      console.error('[LaOrden] Error del backend:', data.error);
      return DEMO_DATA;
    }

    // Validar que al menos venga el usuario
    if (!data.user) {
      console.error('[LaOrden] Respuesta sin datos de usuario');
      return DEMO_DATA;
    }

    console.log('[LaOrden] Datos reales cargados para:', data.user.nombre);
    return data;

  } catch (e) {
    console.error('[LaOrden] Fetch falló:', e.message);
    return DEMO_DATA;
  }
}

/**
 * Registra un reporte de compromiso en GAS
 */
async function postReport(compromisoId, valor) {
  const tg = window.Telegram?.WebApp;

  if (!tg || !tg.initData) {
    // Demo: simular éxito
    return { ok: true, pcGanados: 28, cumplimiento: 100, esCritico: false };
  }

  try {
    // POST sí puede tener Content-Type porque GAS doPost lo espera
    const resp = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REPORT', initData: tg.initData, compromisoId, valor }),
    });
    const data = await resp.json();
    return data || { ok: false };
  } catch (e) {
    console.error('[LaOrden] postReport falló:', e.message);
    return { ok: false };
  }
}
