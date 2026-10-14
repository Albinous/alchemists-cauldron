type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string | boolean>;
  children?: Node[];
};

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    for (const [name, value] of Object.entries(options.attributes)) {
      if (typeof value === 'boolean') {
        element.toggleAttribute(name, value);
      } else {
        element.setAttribute(name, value);
      }
    }
  }

  if (options.children) {
    element.append(...options.children);
  }

  return element;
}

export function createContainer(className: string, children?: Node[]): HTMLDivElement {
  return createElement('div', {
    className: className,
    children: children,
  });
}

export const createZone = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  label: string,
  content?: HTMLElement,
): HTMLElementTagNameMap[K] =>
  createElement(tag, {
    className,
    attributes: { 'aria-label': label },
    children: content ? [content] : [],
  });
