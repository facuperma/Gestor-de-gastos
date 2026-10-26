import { describe, expect, it } from 'vitest'
import { parseTransactionForm, type TransactionFormData } from './validation.ts'

const valid: TransactionFormData = {
  type: 'expense',
  description: '  Café  ',
  amount: '1500,50',
  category: 'comida',
  date: '2026-10-26',
}

describe('parseTransactionForm', () => {
  it('convierte datos válidos en una transacción tipada', () => {
    const result = parseTransactionForm(valid)
    expect(result).toEqual({
      ok: true,
      value: {
        type: 'expense',
        category: 'comida',
        description: 'Café',
        amountCents: 150_050,
        date: '2026-10-26',
      },
    })
  })

  it.each(['', '0', '-5', 'abc', '10,999'])('rechaza el monto %j', (amount) => {
    const result = parseTransactionForm({ ...valid, amount })
    expect(result.ok).toBe(false)
  })

  it('rechaza una categoría que no corresponde al tipo', () => {
    const result = parseTransactionForm({ ...valid, type: 'income', category: 'comida' })
    expect(result).toEqual({ ok: false, error: ['La categoría no es válida para este tipo.'] })
  })

  it('acumula varios errores a la vez', () => {
    const result = parseTransactionForm({ ...valid, description: ' ', amount: '', date: '' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toHaveLength(3)
  })
})
