import { CATEGORY_INFO, type ExpenseCategory } from '../models/categories.ts'
import type { Balance } from '../services/transactions.ts'
import { formatCurrency } from '../utils/format.ts'
import { el } from './dom.ts'

export function renderBalance(container: HTMLElement, balance: Balance): void {
  const savingsRate =
    balance.incomeCents > 0 ? Math.round((balance.balanceCents / balance.incomeCents) * 100) : null

  const stat = (label: string, cents: number, modifier: 'income' | 'expense') =>
    el('div', { className: `hero__stat hero__stat--${modifier}` }, [
      el('span', { className: 'hero__stat-icon', textContent: modifier === 'income' ? '↑' : '↓', ariaHidden: 'true' }),
      el('span', { className: 'hero__stat-text' }, [
        el('span', { className: 'hero__stat-label', textContent: label }),
        el('strong', { className: 'hero__stat-value', textContent: formatCurrency(cents) }),
      ]),
    ])

  container.classList.toggle('hero--negative', balance.balanceCents < 0)
  container.replaceChildren(
    el('p', { className: 'hero__label', textContent: 'Balance total' }),
    el('p', { className: 'hero__amount', textContent: formatCurrency(balance.balanceCents) }),
    el('p', {
      className: 'hero__note',
      textContent:
        savingsRate === null
          ? 'Registrá un ingreso para ver tu tasa de ahorro.'
          : `Estás ahorrando el ${savingsRate}% de tus ingresos.`,
    }),
    el('div', { className: 'hero__stats' }, [
      stat('Ingresos', balance.incomeCents, 'income'),
      stat('Gastos', balance.expenseCents, 'expense'),
    ]),
  )
}

/** Gráfico de dona hecho solo con CSS (`conic-gradient`) más su leyenda. */
export function renderCategories(container: HTMLElement, byCategory: [ExpenseCategory, number][]): void {
  if (byCategory.length === 0) {
    container.replaceChildren(
      el('p', { className: 'empty', textContent: 'Todavía no hay gastos para analizar.' }),
    )
    return
  }

  const total = byCategory.reduce((sum, [, cents]) => sum + cents, 0)
  let start = 0
  const segments = byCategory.map(([category, cents]) => {
    const end = start + (cents / total) * 100
    const segment = `${CATEGORY_INFO[category].color} ${start}% ${end}%`
    start = end
    return segment
  })

  const donut = el('div', { className: 'donut', role: 'img', ariaLabel: 'Distribución de gastos por categoría' }, [
    el('div', { className: 'donut__hole' }, [
      el('span', { className: 'donut__label', textContent: 'Total' }),
      el('strong', { className: 'donut__value', textContent: formatCurrency(total) }),
    ]),
  ])
  donut.style.background = `conic-gradient(${segments.join(', ')})`

  const legend = el(
    'ul',
    { className: 'legend' },
    byCategory.map(([category, cents]) => {
      const { label, icon, color } = CATEGORY_INFO[category]
      const item = el('li', { className: 'legend__item' }, [
        el('span', { className: 'legend__dot', ariaHidden: 'true' }),
        el('span', { className: 'legend__name', textContent: `${icon} ${label}` }),
        el('span', { className: 'legend__percent', textContent: `${Math.round((cents / total) * 100)}%` }),
        el('span', { className: 'legend__amount', textContent: formatCurrency(cents) }),
      ])
      item.style.setProperty('--cat', color)
      return item
    }),
  )

  container.replaceChildren(el('div', { className: 'categories' }, [donut, legend]))
}
