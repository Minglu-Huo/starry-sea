export function getBoundingClientRect(element: HTMLElement): DOMRect | null {
  if (!element || !element.getBoundingClientRect) {
    return null;
  }
  return element.getBoundingClientRect();
}
