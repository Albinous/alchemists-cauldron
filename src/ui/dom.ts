type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string | boolean>;
  children?: Node[];
};

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] => {
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
};

export const createContainer = (className: string, children?: Node[]): HTMLDivElement =>
  createElement('div', { className, children });

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

export const createSvgFromString = (svg: string, className?: string): SVGSVGElement => {
  const parsedDocument = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const element = parsedDocument.documentElement;

  if (!(element instanceof SVGSVGElement)) {
    throw new TypeError('Invalid SVG markup');
  }

  if (className) {
    element.classList.add(className);
  }
  element.setAttribute('aria-hidden', 'true');

  return element;
};

export const playAnimation = (element: HTMLElement, className: string): void => {
  const handleEnd = (event: AnimationEvent): void => {
    if (event.target !== element) return;
    element.classList.remove(className);
    element.removeEventListener('animationend', handleEnd);
  };

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  element.addEventListener('animationend', handleEnd);
};

export const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLElement && target.isContentEditable);
