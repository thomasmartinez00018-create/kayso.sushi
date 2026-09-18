// Fuente única de horarios, zona y tiempos. Antes cada componente tenía su propia versión:
// "abierto hoy 18:30" fijo (falso los lunes), "~30 min" contra "45-60 min", y dos zonas distintas.
// Datos confirmados por Gladys (2-jul-2026) y el cierre de Gelly avisado por audio el 7-sep-2026.

export const TZ = 'America/Argentina/Buenos_Aires';

/** Día de la semana en Argentina: 0 domingo … 6 sábado. */
export const diaAR = (d: Date = new Date()): number => {
  const nombre = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(d);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nombre);
};

/** Minutos desde la medianoche en Argentina. */
export const minutosAR = (d: Date = new Date()): number => {
  const [h, m] = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d).split(':').map(Number);
  return h * 60 + m;
};

/** Fecha de hoy en Argentina como YYYY-MM-DD. */
export const fechaAR = (d: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);

// --- SUCURSALES ---

// Gelly y Obes: Gladys confirmó el 18-sep-2026 que el último día que atiende es el 30 de septiembre.
// El local sigue abierto hasta fin de octubre solo para guardar cosas, sin tomar pedidos.
export const GELLY_CIERRA = '2026-10-01';

export const PERON_DIAS_MEDIODIA = [2, 3, 4, 5, 6]; // martes a sábado, 11:30 a 14:30
export const PERON_DIAS_NOCHE = [2, 3, 4, 5, 6, 0];  // martes a domingo, 18:30 a 22:30
export const GELLY_DIAS_NOCHE = [3, 4, 5, 6, 0];     // miércoles a domingo, 18:00 a 22:30

/** Gelly ya cerró (o cierra hoy). */
export const gellyCerroDefinitivo = (d: Date = new Date()): boolean => fechaAR(d) >= GELLY_CIERRA;

/** Gelly se puede elegir hoy: sigue abierta y hoy es un día que atiende. */
export const gellyDisponibleHoy = (d: Date = new Date()): boolean =>
  !gellyCerroDefinitivo(d) && GELLY_DIAS_NOCHE.includes(diaAR(d));

const NOMBRE_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export interface EstadoHoy {
  abierto: boolean;       // está atendiendo en este momento (alguna sucursal)
  etiqueta: string;       // "Abierto hoy" | "Hoy cerrado" | "Abre a las 18:30"
  detalle: string;        // "18:30 a 22:30hs" | "Abrimos el martes 11:30"
}

/**
 * Estado real de hoy mirando las dos sucursales. Los lunes no abre ninguna.
 */
export const estadoHoy = (d: Date = new Date()): EstadoHoy => {
  const dia = diaAR(d);
  const min = minutosAR(d);
  const tramos: Array<[number, number]> = [];

  if (PERON_DIAS_MEDIODIA.includes(dia)) tramos.push([11 * 60 + 30, 14 * 60 + 30]);
  const abreNoche = PERON_DIAS_NOCHE.includes(dia) || (gellyDisponibleHoy(d) && GELLY_DIAS_NOCHE.includes(dia));
  if (abreNoche) {
    const desde = PERON_DIAS_NOCHE.includes(dia) ? 18 * 60 + 30 : 18 * 60;
    tramos.push([desde, 22 * 60 + 30]);
  }

  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const texto = tramos.map(([a, b]) => `${fmt(a)} a ${fmt(b)}hs`).join(' y ');

  if (tramos.length === 0) {
    // Buscamos el próximo día con atención (siempre hay uno dentro de la semana).
    for (let i = 1; i <= 7; i++) {
      const prox = (dia + i) % 7;
      if (PERON_DIAS_MEDIODIA.includes(prox)) return { abierto: false, etiqueta: 'Hoy cerrado', detalle: `Abrimos el ${NOMBRE_DIA[prox]} 11:30` };
      if (PERON_DIAS_NOCHE.includes(prox)) return { abierto: false, etiqueta: 'Hoy cerrado', detalle: `Abrimos el ${NOMBRE_DIA[prox]} 18:30` };
    }
    return { abierto: false, etiqueta: 'Hoy cerrado', detalle: 'Consultanos por WhatsApp' };
  }

  const adentro = tramos.some(([a, b]) => min >= a && min < b);
  if (adentro) return { abierto: true, etiqueta: 'Abierto ahora', detalle: texto };

  const siguiente = tramos.find(([a]) => min < a);
  if (siguiente) return { abierto: false, etiqueta: `Abre ${fmt(siguiente[0])}`, detalle: `${fmt(siguiente[0])} a ${fmt(siguiente[1])}hs` };

  return { abierto: false, etiqueta: 'Cerrado por hoy', detalle: texto };
};

/**
 * Una frase sola para los CTA: qué puede esperar el que escribe ahora.
 * Reemplaza al "te respondemos en 2 min", que fuera de horario no se cumple.
 */
export const fraseAtencion = (d: Date = new Date()): string => {
  const e = estadoHoy(d);
  if (e.abierto) return 'Estamos atendiendo: te respondemos por WhatsApp';
  if (e.etiqueta === 'Hoy cerrado') return `Hoy cerrado. ${e.detalle}`;
  if (e.etiqueta === 'Cerrado por hoy') return 'Cerrado por hoy. Dejanos el pedido y te respondemos mañana';
  return `Hoy atendemos de ${e.detalle}`;
};

// --- TEXTOS COMPARTIDOS (una sola versión de cada promesa) ---

/** Zona real de reparto (Gladys, 18-sep-2026). */
export const ZONA_DELIVERY = 'San Miguel, Muñiz y parte de Bella Vista';

/** Hasta dónde llega en Bella Vista, para el que duda si le llega. */
export const ZONA_DETALLE =
  'En Bella Vista llegamos al centro y la zona de la estación, hasta Ruta 8. No llegamos a la zona de Camino del Buen Aire ni a Barrio Obligado.';

/** Tiempo de entrega. Único valor en toda la web. */
export const TIEMPO_ENTREGA = '45 a 60 min';

/** Reseñas verificadas en Google Maps el 17-sep-2026: Gelly 4,8 (109) + Perón 4,7 (77). */
export const RESENAS_GOOGLE = '4,7 ★ en Google · +180 reseñas';
