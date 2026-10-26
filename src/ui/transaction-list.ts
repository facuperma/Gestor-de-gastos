import type { Transaction } from '../models/transaction.ts'
import { formatCurrency, formatDate } from '../utils/format.ts'
import { capitalize, el } from './dom.ts'

export function renderTransactionList(container: HTMLElement, transactions: Transaction[]): void {
  if (transactions.length === 0) {
    container.replaceChildren(el('p', { className: 'muted', textContent: 'No hay movimientos.' }))
    return
  }

  const items = transactions.map((t) => {
    const sign = t.type === 'income' ? '+' : '−'
    return el('li', { className: `transaction transaction--${t.type}` }, [
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
      el('button', {
        type: 'button',
        className: 'transaction__delete',
        textContent: '✕',
        title: 'Eliminar',
        ariaLabel: `Eliminar ${t.description}`,
        dataset: { id: t.id },
      }),
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
