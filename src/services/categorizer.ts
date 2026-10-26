import type { Category, ExpenseCategory, IncomeCategory } from '../models/categories.ts'
import type { Transaction, TransactionType } from '../models/transaction.ts'

type KeywordMap<C extends Category> = Partial<Record<C, string[]>>

// Las palabras se escriben sin tildes; igual se normalizan al construir el índice.
const EXPENSE_KEYWORDS: KeywordMap<ExpenseCategory> = {
  comida: [
    'super', 'coto', 'carrefour', 'jumbo', 'disco', 'vea', 'changomas', 'chango mas', 'la anonima',
    'verduleria', 'carniceria', 'almacen', 'panaderia', 'fiambreria', 'dietetica', 'kiosco', 'pan',
    'chino', 'feria', 'fruta', 'verdura', 'comida',
  ],
  restaurantes: [
    'restaurante', 'resto', 'bar', 'cafe', 'pizza', 'empanada', 'hamburguesa', 'burger', 'mcdonalds',
    'mc donalds', 'starbucks', 'havanna', 'rappi', 'pedidosya', 'pedidos ya', 'uber eats', 'delivery',
    'sushi', 'parrilla', 'cena', 'almuerzo', 'helado', 'cerveceria',
  ],
  vivienda: ['alquiler', 'expensas', 'hipoteca', 'inmobiliaria'],
  servicios: [
    'luz', 'edenor', 'edesur', 'gas', 'metrogas', 'naturgy', 'agua', 'aysa', 'internet', 'wifi',
    'fibertel', 'telecentro', 'movistar', 'claro', 'telefono', 'cable', 'directv',
  ],
  impuestos: [
    'afip', 'arca', 'monotributo', 'impuesto', 'ganancias', 'iibb', 'ingresos brutos', 'abl', 'arba',
    'agip', 'patente', 'rentas', 'municipal', 'tasa',
  ],
  transporte: ['sube', 'colectivo', 'bondi', 'subte', 'tren', 'uber', 'cabify', 'didi', 'taxi', 'remis', 'peaje'],
  auto: [
    'nafta', 'combustible', 'ypf', 'shell', 'axion', 'gnc', 'estacionamiento', 'cochera', 'mecanico',
    'taller', 'gomeria', 'lavadero', 'vtv', 'service del auto',
  ],
  ropa: [
    'ropa', 'remera', 'pantalon', 'jean', 'zapatilla', 'zapato', 'campera', 'buzo', 'camisa', 'vestido',
    'pollera', 'medias', 'zara', 'nike', 'adidas', 'indumentaria',
  ],
  salud: [
    'farmacia', 'farmacity', 'medic', 'prepaga', 'osde', 'swiss medical', 'galeno', 'obra social',
    'dentista', 'odontolog', 'psicolog', 'terapia', 'remedio', 'analisis', 'kinesiolog', 'oculista',
    'gimnasio', 'gym',
  ],
  educacion: [
    'curso', 'colegio', 'escuela', 'universidad', 'facultad', 'libro', 'libreria', 'udemy', 'platzi',
    'coderhouse', 'ingles', 'clases', 'matricula', 'utiles',
  ],
  ocio: [
    'cine', 'teatro', 'recital', 'concierto', 'entrada', 'boliche', 'salida', 'steam', 'playstation',
    'xbox', 'nintendo', 'futbol', 'juego',
  ],
  viajes: [
    'vuelo', 'aerolineas', 'pasaje', 'hotel', 'airbnb', 'booking', 'hostel', 'despegar', 'flybondi',
    'jetsmart', 'vacaciones', 'micro',
  ],
  tecnologia: [
    'notebook', 'computadora', 'pc', 'auriculares', 'teclado', 'mouse', 'monitor', 'tablet', 'iphone',
    'samsung', 'fravega', 'garbarino', 'musimundo', 'tecnologia',
  ],
  suscripciones: [
    'netflix', 'spotify', 'disney', 'hbo', 'prime video', 'amazon prime', 'youtube premium', 'paramount',
    'icloud', 'google one', 'chatgpt', 'claude', 'suscripcion', 'apple music',
  ],
  hogar: [
    'mueble', 'easy', 'sodimac', 'ferreteria', 'limpieza', 'detergente', 'lavandina', 'decoracion',
    'colchon', 'electrodomestico', 'heladera', 'lavarropas', 'bazar', 'ikea',
  ],
  mascotas: ['veterinari', 'mascota', 'perro', 'gato', 'petshop', 'pet shop', 'puppis', 'balanceado'],
  cuidado: [
    'peluqueria', 'barberia', 'corte de pelo', 'manicura', 'depilacion', 'perfume', 'cosmetic',
    'maquillaje', 'shampoo', 'crema', 'spa', 'masaje',
  ],
  regalos: ['regalo', 'cumpleanos', 'cumple'],
  deudas: ['tarjeta', 'visa', 'mastercard', 'amex', 'prestamo', 'deuda', 'credito'],
}

const INCOME_KEYWORDS: KeywordMap<IncomeCategory> = {
  sueldo: ['sueldo', 'salario', 'aguinaldo', 'haberes', 'recibo', 'nomina', 'bono'],
  freelance: ['freelance', 'proyecto', 'cliente', 'factura', 'honorarios', 'upwork', 'fiverr', 'workana', 'changa'],
  inversiones: [
    'plazo fijo', 'dividendo', 'interes', 'fci', 'fondo comun', 'acciones', 'cedear', 'crypto', 'cripto',
    'bitcoin', 'rendimiento', 'broker',
  ],
  ventas: ['venta', 'vendi', 'mercado libre', 'mercadolibre', 'marketplace'],
  alquileres: ['alquiler', 'inquilino', 'renta'],
  reintegros: ['reintegro', 'reembolso', 'devolucion', 'cashback'],
  regalos: ['regalo', 'cumpleanos', 'cumple'],
}

export interface CategorySuggestion {
  category: Category
  source: 'history' | 'keyword'
}

interface KeywordEntry {
  keyword: string
  category: Category
}

/** Minúsculas, sin tildes ni signos: "¡CAFÉ con Leche!" → "cafe con leche". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Ordena de la palabra más larga a la más corta: gana la coincidencia más específica. */
function buildIndex(map: KeywordMap<Category>): KeywordEntry[] {
  return Object.entries(map)
    .flatMap(([category, keywords]) =>
      (keywords ?? []).map((keyword) => ({ keyword: normalize(keyword), category: category as Category })),
    )
    .sort((a, b) => b.keyword.length - a.keyword.length)
}

const INDEX: Record<TransactionType, KeywordEntry[]> = {
  expense: buildIndex(EXPENSE_KEYWORDS),
  income: buildIndex(INCOME_KEYWORDS),
}

/**
 * Las palabras cortas (< 4 letras) tienen que coincidir enteras, para que "gas"
 * no matchee "gastos". Las largas pueden ser comienzo de palabra ("farmacia" → "farmacias").
 */
function matches(text: string, keyword: string): boolean {
  return keyword.length < 4 ? ` ${text} `.includes(` ${keyword} `) : ` ${text}`.includes(` ${keyword}`)
}

/**
 * Sugiere una categoría para la descripción. Primero busca en los movimientos
 * del usuario (así aprende de sus correcciones) y después en el diccionario.
 */
export function suggestCategory(
  description: string,
  type: TransactionType,
  history: readonly Transaction[],
): CategorySuggestion | null {
  const text = normalize(description)
  if (!text) return null

  const learned = history.findLast((t) => t.type === type && normalize(t.description) === text)
  if (learned) return { category: learned.category, source: 'history' }

  const entry = INDEX[type].find((e) => matches(text, e.keyword))
  return entry ? { category: entry.category, source: 'keyword' } : null
}
