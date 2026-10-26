import { categoriesFor, type ExpenseCategory, type IncomeCategory } from './categories.ts'

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

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.description === 'string' &&
    Number.isInteger(t.amountCents) &&
    typeof t.date === 'string' &&
    (t.type === 'income' || t.type === 'expense') &&
    (categoriesFor(t.type) as readonly unknown[]).includes(t.category)
  )
}
