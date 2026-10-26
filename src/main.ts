import './style.css'
import { isTransaction, type Transaction } from './models/transaction.ts'
import {
  expensesByCategory,
  filterTransactions,
  getBalance,
  sortByDateDesc,
  type TransactionFilter,
} from './services/transactions.ts'
import { LocalStorageRepository } from './storage/repository.ts'
import { getElement } from './ui/dom.ts'
import { renderBalance, renderCategories } from './ui/summary.ts'
import { setupTransactionForm } from './ui/transaction-form.ts'
import { onDeleteClick, renderTransactionList } from './ui/transaction-list.ts'

const repository = new LocalStorageRepository<Transaction>('gestor-gastos:transactions', isTransaction)

const balanceEl = getElement<HTMLElement>('#balance')
const categoriesEl = getElement<HTMLElement>('#categories')
const listEl = getElement<HTMLElement>('#transaction-list')
const formEl = getElement<HTMLFormElement>('#transaction-form')
const filtersEl = getElement<HTMLFormElement>('#filters')

function readFilter(): TransactionFilter {
  const data = new FormData(filtersEl)
  return {
    type: data.get('type') as TransactionFilter['type'],
    month: (data.get('month') as string) || null,
  }
}

function render(): void {
  const visible = filterTransactions(repository.getAll(), readFilter())
  renderBalance(balanceEl, getBalance(visible))
  renderCategories(categoriesEl, expensesByCategory(visible))
  renderTransactionList(listEl, sortByDateDesc(visible))
}

setupTransactionForm(
  formEl,
  (transaction) => {
    repository.add({ ...transaction, id: crypto.randomUUID() })
    render()
  },
  () => repository.getAll(),
)

onDeleteClick(listEl, (id) => {
  repository.remove(id)
  render()
})

filtersEl.addEventListener('input', render)

render()
