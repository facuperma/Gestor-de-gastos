export const EXPENSE_CATEGORIES = [
  'comida',
  'restaurantes',
  'vivienda',
  'servicios',
  'impuestos',
  'transporte',
  'auto',
  'ropa',
  'salud',
  'educacion',
  'ocio',
  'viajes',
  'tecnologia',
  'suscripciones',
  'hogar',
  'mascotas',
  'cuidado',
  'regalos',
  'deudas',
  'otros',
] as const

export const INCOME_CATEGORIES = [
  'sueldo',
  'freelance',
  'inversiones',
  'ventas',
  'alquileres',
  'reintegros',
  'regalos',
  'otros',
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type Category = ExpenseCategory | IncomeCategory

export interface CategoryInfo {
  label: string
  icon: string
  color: string
}

/**
 * Nombre, ícono y color de cada categoría. Al ser un `Record<Category, …>`,
 * el compilador exige que toda categoría nueva tenga su entrada acá.
 */
export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  // Gastos
  comida: { label: 'Comida', icon: '🛒', color: '#f59e0b' },
  restaurantes: { label: 'Restaurantes y delivery', icon: '🍔', color: '#ea580c' },
  vivienda: { label: 'Vivienda', icon: '🏠', color: '#7c3aed' },
  servicios: { label: 'Servicios', icon: '💡', color: '#06b6d4' },
  impuestos: { label: 'Impuestos', icon: '🧾', color: '#dc2626' },
  transporte: { label: 'Transporte', icon: '🚌', color: '#2563eb' },
  auto: { label: 'Auto y combustible', icon: '⛽', color: '#475569' },
  ropa: { label: 'Ropa', icon: '👕', color: '#db2777' },
  salud: { label: 'Salud', icon: '💊', color: '#10b981' },
  educacion: { label: 'Educación', icon: '📚', color: '#4f46e5' },
  ocio: { label: 'Ocio', icon: '🎬', color: '#c026d3' },
  viajes: { label: 'Viajes', icon: '✈️', color: '#0d9488' },
  tecnologia: { label: 'Tecnología', icon: '💻', color: '#0ea5e9' },
  suscripciones: { label: 'Suscripciones', icon: '📺', color: '#a855f7' },
  hogar: { label: 'Hogar', icon: '🛋️', color: '#84cc16' },
  mascotas: { label: 'Mascotas', icon: '🐾', color: '#a16207' },
  cuidado: { label: 'Cuidado personal', icon: '💇', color: '#f9a8d4' },
  deudas: { label: 'Deudas y tarjetas', icon: '💳', color: '#be123c' },
  // Ingresos
  sueldo: { label: 'Sueldo', icon: '💼', color: '#16a34a' },
  freelance: { label: 'Freelance', icon: '🧑‍💻', color: '#6366f1' },
  inversiones: { label: 'Inversiones', icon: '📈', color: '#eab308' },
  ventas: { label: 'Ventas', icon: '🏷️', color: '#14b8a6' },
  alquileres: { label: 'Alquileres', icon: '🔑', color: '#8b5cf6' },
  reintegros: { label: 'Reintegros', icon: '💸', color: '#22d3ee' },
  // Compartidas
  regalos: { label: 'Regalos', icon: '🎁', color: '#facc15' },
  otros: { label: 'Otros', icon: '📦', color: '#94a3b8' },
}

export function categoriesFor(type: 'income' | 'expense'): readonly Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
