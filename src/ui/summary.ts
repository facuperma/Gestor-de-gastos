import type { Balance } from '../services/transactions.ts'
import { formatCurrency } from '../utils/format.ts'
import { capitalize, el } from './dom.ts'

export function renderSummary(
  container: HTMLElement,
  balance: Balance,
  byCategory: [string, number][],
): void {
  const stat = (label: string, cents: number, modifier: string) =>
    el('div', { className: `stat stat--${modifier}` }, [
      el('span', { className: 'stat__label', textContent: label }),
      el('strong', { className: 'stat__value', textContent: formatCurrency(cents) }),
    ])

  const stats = el('div', { className: 'stats' }, [
    stat('Ingresos', balance.incomeCents, 'income'),
    stat('Gastos', balance.expenseCents, 'expense'),
    stat('Balance', balance.balanceCents, balance.balanceCents >= 0 ? 'positive' : 'negative'),
  ])

  // TODO: reemplazar estas barras por un gráfico (Canvas/SVG o Chart.js).
  const max = byCategory[0]?.[1] ?? 0
  const bars = el(
    'ul',
    { className: 'category-bars' },
    byCategory.map(([category, cents]) => {
      const bar = el('span', { className: 'category-bars__fill' })
      bar.style.width = `${(cents / max) * 100}%`
      return el('li', {}, [
        el('span', { textContent: capitalize(category) }),
        el('span', { className: 'category-bars__track' }, [bar]),
        el('span', { textContent: formatCurrency(cents) }),
      ])
    }),
  )

  container.replaceChildren(
    stats,
    el('h3', { textContent: 'Gastos por categoría' }),
    byCategory.length > 0 ? bars : el('p', { className: 'muted', textContent: 'Todavía no hay gastos.' }),
  )
}
