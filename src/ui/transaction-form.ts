import { CATEGORY_INFO, categoriesFor } from '../models/categories.ts'
import type { NewTransaction, Transaction, TransactionType } from '../models/transaction.ts'
import { suggestCategory } from '../services/categorizer.ts'
import { parseTransactionForm } from '../services/validation.ts'
import { todayISO } from '../utils/format.ts'
import { el, getElement } from './dom.ts'

export function setupTransactionForm(
  form: HTMLFormElement,
  onSubmit: (transaction: NewTransaction) => void,
  getHistory: () => readonly Transaction[],
): void {
  const descriptionInput = getElement<HTMLInputElement>('input[name="description"]', form)
  const categorySelect = getElement<HTMLSelectElement>('select[name="category"]', form)
  const dateInput = getElement<HTMLInputElement>('input[name="date"]', form)
  const hint = getElement<HTMLParagraphElement>('#category-hint', form)
  const errorList = getElement<HTMLUListElement>('.form-errors', form)

  /** Si el usuario eligió la categoría a mano, dejamos de sugerir. */
  let categoryChosenManually = false

  const currentType = () => new FormData(form).get('type') as TransactionType

  const fillCategories = () => {
    categorySelect.replaceChildren(
      ...categoriesFor(currentType()).map((c) =>
        el('option', { value: c, textContent: `${CATEGORY_INFO[c].icon}  ${CATEGORY_INFO[c].label}` }),
      ),
    )
  }

  const hideHint = () => {
    hint.hidden = true
    categorySelect.classList.remove('is-suggested')
  }

  const applySuggestion = () => {
    if (categoryChosenManually) return
    const suggestion = suggestCategory(descriptionInput.value, currentType(), getHistory())
    if (!suggestion) {
      hideHint()
      return
    }
    const { icon, label } = CATEGORY_INFO[suggestion.category]
    categorySelect.value = suggestion.category
    categorySelect.classList.add('is-suggested')
    hint.textContent =
      `✨ Sugerido: ${icon} ${label}` +
      (suggestion.source === 'history' ? ' · según tus movimientos' : ' · por palabras clave')
    hint.hidden = false
  }

  const reset = () => {
    form.reset()
    dateInput.value = todayISO()
    categoryChosenManually = false
    fillCategories()
    hideHint()
  }

  descriptionInput.addEventListener('input', applySuggestion)

  form.addEventListener('change', (event) => {
    const { name } = event.target as HTMLInputElement | HTMLSelectElement
    if (name === 'type') {
      categoryChosenManually = false
      fillCategories()
      hideHint()
      applySuggestion()
    } else if (name === 'category') {
      categoryChosenManually = true
      hideHint()
    }
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
