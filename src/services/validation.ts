import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../models/categories.ts'
import type { NewTransaction } from '../models/transaction.ts'
import { err, ok, type Result } from '../models/result.ts'
import { parseAmountToCents } from '../utils/format.ts'

export interface TransactionFormData {
  type: string
  description: string
  amount: string
  category: string
  date: string
}

const MAX_DESCRIPTION_LENGTH = 80

/** Valida los datos crudos del formulario y los convierte en una transacción tipada. */
export function parseTransactionForm(data: TransactionFormData): Result<NewTransaction> {
  const errors: string[] = []
  const description = data.description.trim()
  const amountCents = parseAmountToCents(data.amount)

  if (!description) errors.push('La descripción es obligatoria.')
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`La descripción no puede superar ${MAX_DESCRIPTION_LENGTH} caracteres.`)
  }
  if (Number.isNaN(amountCents) || amountCents <= 0) {
    errors.push('El monto debe ser un número positivo (máximo 2 decimales).')
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push('La fecha no es válida.')

  const base = { description, amountCents, date: data.date }
  let transaction: NewTransaction | null = null

  if (data.type === 'income') {
    const category = INCOME_CATEGORIES.find((c) => c === data.category)
    if (category) transaction = { ...base, type: 'income', category }
  } else if (data.type === 'expense') {
    const category = EXPENSE_CATEGORIES.find((c) => c === data.category)
    if (category) transaction = { ...base, type: 'expense', category }
  } else {
    errors.push('El tipo debe ser ingreso o gasto.')
  }
  if (!transaction && (data.type === 'income' || data.type === 'expense')) {
    errors.push('La categoría no es válida para este tipo.')
  }

  return errors.length > 0 || !transaction ? err(errors) : ok(transaction)
}
