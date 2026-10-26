export const EXPENSE_CATEGORIES = [
  'comida',
  'transporte',
  'vivienda',
  'servicios',
  'ocio',
  'salud',
  'otros',
] as const

export const INCOME_CATEGORIES = ['sueldo', 'freelance', 'inversiones', 'otros'] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type TransactionType = 'income' | 'expense'

interface BaseTransaction {
  id: string
  description: string
  /** Monto en centavos (entero) para evitar errores de punto flotante. */
  amountCents: number
  /** Fecha en formato ISO `YYYY-MM-DD`. */
  date: string
}

export interface Income extends BaseTransaction {
  type: 'income'
  category: IncomeCategory
}

export interface Expense extends BaseTransaction {
  type: 'expense'
  category: ExpenseCategory
}

/** Unión discriminada: `type` determina qué categorías son válidas. */
export type Transaction = Income | Expense

/** Datos de una transacción antes de persistirla (sin id). */
export type NewTransaction = Omit<Income, 'id'> | Omit<Expense, 'id'>

export function categoriesFor(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.description === 'string' &&
    Number.isInteger(t.amountCents) &&
    typeof t.date === 'string' &&
    (t.type === 'income' || t.type === 'expense') &&
    categoriesFor(t.type).includes(t.category as string)
  )
}
