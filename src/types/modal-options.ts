export interface IModalOptions {
  className: string; // root modifier: 'game-over' | 'pause' | ...
  titleId: string; // id for <h2>, used by aria-labelledby
  title: string; // text of <h2>
  content: HTMLElement[]; // what goes between the divider and the buttons
  actions: HTMLElement[]; // buttons
  onCancel?: () => void; // what Esc does; if absent, Esc does nothing
}
