import type { Transaction, TransactionType } from '../models/transaction.ts'

export interface Balance {
  incomeCents: number
  expenseCents: number
  balanceCents: number
}

export interface TransactionFilter {
  type: TransactionType | 'all'
  /** Mes en formato `YYYY-MM`, o `null` para todos. */
  month: string | null
}

export function getBalance(transactions: readonly Transaction[]): Balance {
  let incomeCents = 0
  let expenseCents = 0
  for (const t of transactions) {
    if (t.type === 'income') incomeCents += t.amountCents
    else expenseCents += t.amountCents
  }
  return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents }
}

/** Total gastado por categoría, ordenado de mayor a menor. */
export function expensesByCategory(transactions: readonly Transaction[]): [string, number][] {
  const totals = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amountCents)
  }
  return [...totals].sort((a, b) => b[1] - a[1])
}

export function filterTransactions(
  transactions: readonly Transaction[],
  filter: TransactionFilter,
): Transaction[] {
  return transactions.filter(
    (t) =>
      (filter.type === 'all' || t.type === filter.type) &&
      (filter.month === null || t.date.startsWith(filter.month)),
  )
}

export function sortByDateDesc(transactions: readonly Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date))
}
