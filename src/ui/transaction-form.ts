import { CATEGORY_INFO, categoriesFor } from '../models/categories.ts'
import type { NewTransaction, TransactionType } from '../models/transaction.ts'
import { parseTransactionForm } from '../services/validation.ts'
import { todayISO } from '../utils/format.ts'
import { el, getElement } from './dom.ts'

export function setupTransactionForm(
  form: HTMLFormElement,
  onSubmit: (transaction: NewTransaction) => void,
): void {
  const categorySelect = getElement<HTMLSelectElement>('select[name="category"]', form)
  const dateInput = getElement<HTMLInputElement>('input[name="date"]', form)
  const errorList = getElement<HTMLUListElement>('.form-errors', form)

  const currentType = () => new FormData(form).get('type') as TransactionType

  const fillCategories = () => {
    categorySelect.replaceChildren(
      ...categoriesFor(currentType()).map((c) =>
        el('option', { value: c, textContent: `${CATEGORY_INFO[c].icon}  ${CATEGORY_INFO[c].label}` }),
      ),
    )
  }

  const reset = () => {
    form.reset()
    dateInput.value = todayISO()
    fillCategories()
  }

  form.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).name === 'type') fillCategories()
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const result = parseTransactionForm({
      type: String(data.get('type')),
      description: String(data.get('description') ?? ''),
      amount: String(data.get('amount') ?? ''),
      category: String(data.get('category') ?? ''),
      date: String(data.get('date') ?? ''),
    })

    if (!result.ok) {
      errorList.replaceChildren(...result.error.map((msg) => el('li', { textContent: msg })))
      return
    }
    errorList.replaceChildren()
    onSubmit(result.value)
    reset()
  })

  reset()
}
