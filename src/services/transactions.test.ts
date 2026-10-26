import { describe, expect, it } from 'vitest'
import type { Transaction } from '../models/transaction.ts'
import { expensesByCategory, filterTransactions, getBalance, sortByDateDesc } from './transactions.ts'

const sample: Transaction[] = [
  { id: '1', type: 'income', category: 'sueldo', description: 'Sueldo', amountCents: 500_000, date: '2026-09-01' },
  { id: '2', type: 'expense', category: 'comida', description: 'Súper', amountCents: 45_050, date: '2026-09-05' },
  { id: '3', type: 'expense', category: 'vivienda', description: 'Alquiler', amountCents: 200_000, date: '2026-10-01' },
  { id: '4', type: 'expense', category: 'comida', description: 'Verdulería', amountCents: 10_000, date: '2026-10-03' },
]

describe('getBalance', () => {
  it('suma ingresos y gastos por separado', () => {
    expect(getBalance(sample)).toEqual({
      incomeCents: 500_000,
      expenseCents: 255_050,
      balanceCents: 244_950,
    })
  })

  it('devuelve todo en cero sin transacciones', () => {
    expect(getBalance([])).toEqual({ incomeCents: 0, expenseCents: 0, balanceCents: 0 })
  })
})

describe('expensesByCategory', () => {
  it('agrupa solo gastos y ordena de mayor a menor', () => {
    expect(expensesByCategory(sample)).toEqual([
      ['vivienda', 200_000],
      ['comida', 55_050],
    ])
  })
})

describe('filterTransactions', () => {
  it('filtra por tipo', () => {
    const result = filterTransactions(sample, { type: 'income', month: null })
    expect(result.map((t) => t.id)).toEqual(['1'])
  })

  it('filtra por mes', () => {
    const result = filterTransactions(sample, { type: 'all', month: '2026-10' })
    expect(result.map((t) => t.id)).toEqual(['3', '4'])
  })
})

describe('sortByDateDesc', () => {
  it('ordena de más reciente a más antigua sin mutar el original', () => {
    const sorted = sortByDateDesc(sample)
    expect(sorted.map((t) => t.id)).toEqual(['4', '3', '2', '1'])
    expect(sample[0].id).toBe('1')
  })
})
