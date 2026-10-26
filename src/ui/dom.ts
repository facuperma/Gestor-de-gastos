type Child = Node | string

/**
 * Crea un elemento del DOM. Los textos se insertan como nodos de texto
 * (nunca como HTML), así los datos del usuario no pueden inyectar código.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { dataset?: Record<string, string> } = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const { dataset, ...rest } = props
  const element = Object.assign(document.createElement(tag), rest)
  if (dataset) Object.assign(element.dataset, dataset)
  element.append(...children)
  return element
}

export function getElement<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`No se encontró el elemento: ${selector}`)
  return element
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
