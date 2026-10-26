import { beforeEach, describe, expect, it } from 'vitest'
import { isTransaction, type Transaction } from '../models/transaction.ts'
import { LocalStorageRepository } from './repository.ts'

class MemoryStorage {
  private data = new Map<string, string>()
  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }
}

const KEY = 'test:transactions'
const tx: Transaction = {
  id: 'a',
  type: 'expense',
  category: 'ocio',
  description: 'Cine',
  amountCents: 8_000,
  date: '2026-10-20',
}

describe('LocalStorageRepository', () => {
  let storage: MemoryStorage
  let repo: LocalStorageRepository<Transaction>

  beforeEach(() => {
    storage = new MemoryStorage()
    repo = new LocalStorageRepository(KEY, isTransaction, storage)
  })

  it('empieza vacío', () => {
    expect(repo.getAll()).toEqual([])
  })

  it('agrega y elimina elementos', () => {
    repo.add(tx)
    expect(repo.getAll()).toEqual([tx])
    repo.remove('a')
    expect(repo.getAll()).toEqual([])
  })

  it('ignora JSON corrupto', () => {
    storage.setItem(KEY, '{no es json')
    expect(repo.getAll()).toEqual([])
  })

  it('descarta elementos que no pasan la validación', () => {
    storage.setItem(KEY, JSON.stringify([tx, { id: 'b', type: 'expense' }]))
    expect(repo.getAll()).toEqual([tx])
  })
})
