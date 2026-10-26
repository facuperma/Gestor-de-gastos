export const LOCALE = 'es-AR'
export const CURRENCY = 'ARS'

const currencyFormatter = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY })
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' })

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}

/** Formatea una fecha ISO `YYYY-MM-DD` sin que la zona horaria la corra un día. */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}

/** Convierte un texto como "1234,56" o "1234.56" a centavos. Devuelve NaN si no es válido. */
export function parseAmountToCents(input: string): number {
  const normalized = input.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return NaN
  return Math.round(Number(normalized) * 100)
}

/** Fecha local de hoy en formato ISO (no UTC, que puede adelantarse un día). */
export function todayISO(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
