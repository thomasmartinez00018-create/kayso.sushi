// Antes de cada build baja el menú de la planilla y actualiza data/menu-snapshot.json,
// que es lo que la web muestra mientras carga la planilla. Así el respaldo nunca queda
// con precios viejos (Gladys, 18-sep-2026: clientes mandaban capturas con $18.500 cuando ya era $20.500).
// Si la planilla no responde, se queda el snapshot que ya está y el build sigue.
import { readFileSync, writeFileSync } from 'node:fs';

const SHEET = 'https://script.google.com/macros/s/AKfycbwyL6GFaL9NKAdQbbuyENSRiqxzfY13cXiclzjykKy2UzhiY9BNv3xu8Kf0GVAfdgPdSg/exec?type=Menu';
const DESTINO = new URL('../data/menu-snapshot.json', import.meta.url);

const limpiar = v => String(v ?? '').replace(/ /g, ' ').trim();

try {
  const res = await fetch(SHEET, { signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 10) throw new Error(`respuesta rara (${Array.isArray(data) ? data.length : typeof data})`);

  const items = data.map(x => ({
    id: String(x.id),
    name: limpiar(x.name),
    description: limpiar(x.description),
    price: Number(String(x.price ?? '').replace(/[^0-9]/g, '')) || 0,
    category: limpiar(x.category),
    image: String(x.image ?? '').replace(/\s/g, ''),
    popular: String(x.popular).toLowerCase() === 'true',
  }));

  const anterior = readFileSync(DESTINO, 'utf8');
  const nuevo = JSON.stringify(items, null, 1);
  if (anterior.trim() !== nuevo.trim()) writeFileSync(DESTINO, nuevo);
  console.log(`[menu] snapshot ${anterior.trim() === nuevo.trim() ? 'sin cambios' : 'actualizado'}: ${items.length} productos`);
} catch (e) {
  console.warn(`[menu] no se pudo bajar la planilla (${e.message}); se usa el snapshot existente`);
}
