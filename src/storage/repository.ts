export interface Repository<T extends { id: string }> {
  getAll(): T[]
  add(item: T): void
  remove(id: string): void
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

/**
 * Repositorio genérico sobre `localStorage`. Valida cada elemento al leer,
 * así datos corruptos o de versiones viejas no rompen la app.
 */
export class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  private readonly key: string
  private readonly isValid: (value: unknown) => value is T
  private readonly storage: KeyValueStorage

  constructor(
    key: string,
    isValid: (value: unknown) => value is T,
    storage: KeyValueStorage = localStorage,
  ) {
    this.key = key
    this.isValid = isValid
    this.storage = storage
  }

  getAll(): T[] {
    const raw = this.storage.getItem(this.key)
    if (!raw) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(this.isValid) : []
    } catch {
      return []
    }
  }

  add(item: T): void {
    this.save([...this.getAll(), item])
  }

  remove(id: string): void {
    this.save(this.getAll().filter((item) => item.id !== id))
  }

  private save(items: T[]): void {
    this.storage.setItem(this.key, JSON.stringify(items))
  }
}
