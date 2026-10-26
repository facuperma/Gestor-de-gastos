import { describe, expect, it } from 'vitest'
import { CATEGORY_INFO, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './categories.ts'

describe('CATEGORY_INFO', () => {
  it('cada categoría de gasto tiene un color distinto (para que el gráfico se distinga)', () => {
    const colors = EXPENSE_CATEGORIES.map((c) => CATEGORY_INFO[c].color.toLowerCase())
    expect(new Set(colors).size).toBe(colors.length)
  })

  it('todas las categorías tienen nombre, ícono y un color hexadecimal válido', () => {
    for (const category of [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]) {
      const { label, icon, color } = CATEGORY_INFO[category]
      expect(label).not.toBe('')
      expect(icon).not.toBe('')
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
