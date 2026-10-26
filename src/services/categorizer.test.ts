import { describe, expect, it } from 'vitest'
import type { Transaction } from '../models/transaction.ts'
import { normalize, suggestCategory } from './categorizer.ts'

const expense = (description: string, category: Transaction['category'], id = description): Transaction =>
  ({ id, type: 'expense', category, description, amountCents: 1000, date: '2026-10-01' }) as Transaction

describe('normalize', () => {
  it('saca tildes, mayúsculas y signos', () => {
    expect(normalize('  ¡CAFÉ con Leche!  ')).toBe('cafe con leche')
    expect(normalize('Cumpleaños')).toBe('cumpleanos')
  })
})

describe('suggestCategory', () => {
  it.each([
    ['Compra en Coto', 'comida'],
    ['Verdulerías del barrio', 'comida'],
    ['Netflix', 'suscripciones'],
    ['Carga SUBE', 'transporte'],
    ['Nafta YPF', 'auto'],
    ['Pago monotributo', 'impuestos'],
    ['Zapatillas Nike', 'ropa'],
    ['Farmacity', 'salud'],
  ])('"%s" → %s', (description, category) => {
    expect(suggestCategory(description, 'expense', [])).toEqual({ category, source: 'keyword' })
  })

  it('prefiere la coincidencia más específica', () => {
    expect(suggestCategory('Uber al centro', 'expense', [])?.category).toBe('transporte')
    expect(suggestCategory('UBER EATS', 'expense', [])?.category).toBe('restaurantes')
  })

  it('las palabras cortas solo coinciden enteras', () => {
    expect(suggestCategory('Factura de gas', 'expense', [])?.category).toBe('servicios')
    expect(suggestCategory('Gastos varios', 'expense', [])).toBeNull()
  })

  it('usa el diccionario según el tipo de transacción', () => {
    expect(suggestCategory('Alquiler', 'expense', [])?.category).toBe('vivienda')
    expect(suggestCategory('Alquiler', 'income', [])?.category).toBe('alquileres')
  })

  it('devuelve null si no hay coincidencias o el texto está vacío', () => {
    expect(suggestCategory('xyz', 'expense', [])).toBeNull()
    expect(suggestCategory('   ', 'expense', [])).toBeNull()
  })

  describe('aprendizaje', () => {
    it('lo que eligió el usuario antes le gana al diccionario', () => {
      const history = [expense('Coto', 'hogar')]
      expect(suggestCategory('coto', 'expense', history)).toEqual({ category: 'hogar', source: 'history' })
    })

    it('reconoce descripciones que no están en el diccionario', () => {
      const history = [expense('Don Pepe', 'restaurantes')]
      expect(suggestCategory('DON PEPÉ', 'expense', history)?.category).toBe('restaurantes')
    })

    it('usa la elección más reciente', () => {
      const history = [expense('Don Pepe', 'comida', '1'), expense('Don Pepe', 'restaurantes', '2')]
      expect(suggestCategory('Don Pepe', 'expense', history)?.category).toBe('restaurantes')
    })

    it('ignora movimientos de otro tipo', () => {
      const history = [expense('Don Pepe', 'restaurantes')]
      expect(suggestCategory('Don Pepe', 'income', history)).toBeNull()
    })
  })
})
