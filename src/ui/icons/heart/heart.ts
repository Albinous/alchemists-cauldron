import './heart.scss';
const SVG_NS = 'http://www.w3.org/2000/svg';
const HEART_PATH = 'M12 21s-9-5.6-9-12.2A5 5 0 0 1 12 5.6a5 5 0 0 1 9 3.2C21 15.4 12 21 12 21z';

export function createHeartIcon(isLost: boolean): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 22');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('heart');
  svg.classList.toggle('heart--lost', isLost);

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', HEART_PATH);
  svg.append(path);

  return svg;
}
