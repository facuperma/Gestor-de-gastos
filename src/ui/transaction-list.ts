import type { Transaction } from '../models/transaction.ts'
import { formatCurrency, formatDate } from '../utils/format.ts'
import { capitalize, el } from './dom.ts'

// Ícono estático (no contiene datos del usuario), por eso es seguro usar innerHTML.
const TRASH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>`

export function renderTransactionList(container: HTMLElement, transactions: Transaction[]): void {
  if (transactions.length === 0) {
    container.replaceChildren(
      el('div', { className: 'empty' }, [
        el('p', { className: 'empty__title', textContent: 'No hay movimientos para mostrar' }),
        el('p', { textContent: 'Agregá tu primera transacción o cambiá los filtros.' }),
      ]),
    )
    return
  }

  const items = transactions.map((t) => {
    const sign = t.type === 'income' ? '+' : '−'
    const deleteButton = el('button', {
      type: 'button',
      className: 'transaction__delete',
      title: 'Eliminar',
      ariaLabel: `Eliminar ${t.description}`,
      dataset: { id: t.id },
    })
    deleteButton.innerHTML = TRASH_ICON

    return el('li', { className: `transaction transaction--${t.type}`, dataset: { category: t.category } }, [
      el('span', { className: 'transaction__avatar', textContent: t.category.charAt(0).toUpperCase(), ariaHidden: 'true' }),
      el('div', { className: 'transaction__info' }, [
        el('span', { className: 'transaction__description', textContent: t.description }),
        el('span', {
          className: 'transaction__meta',
          textContent: `${capitalize(t.category)} · ${formatDate(t.date)}`,
        }),
      ]),
      el('span', {
        className: 'transaction__amount',
        textContent: `${sign} ${formatCurrency(t.amountCents)}`,
      }),
      deleteButton,
    ])
  })

  container.replaceChildren(el('ul', { className: 'transactions' }, items))
}

/** Delegación de eventos: un solo listener para todos los botones de borrar. */
export function onDeleteClick(container: HTMLElement, handler: (id: string) => void): void {
  container.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('.transaction__delete')
    if (button?.dataset.id) handler(button.dataset.id)
  })
}
