import { createElement, createSvgFromString } from '@/ui/dom';
import { Modal } from '../modal';
import type { ILeaderboardEntry } from '@/types';
import { formatDate } from '@/utils';

import './leaderboard.scss';
import { trashSvg, trophySvg } from '@/assets';

const TITLE_TEXT = 'Top Alchemists';
const TITLE_ID = 'leaderboard-title';
const COLUMNS = [
  { label: 'Rank', modifier: 'rank' },
  { label: 'Name', modifier: 'name' },
  { label: 'Score', modifier: 'score' },
  { label: 'Date', modifier: 'date' },
  { label: 'Difficulty', modifier: 'difficulty' },
] as const;
const CLEAR_BUTTON_TEXT = 'Clear Leaderboard';
const BACK_BUTTON_TEXT = 'Back';
const EMPTY_TABLE_TEXT = 'No results yet';
const MEDALS = ['gold', 'silver', 'bronze'] as const;

export class Leaderboard {
  private readonly modal: Modal;
  private readonly table = createElement('table', {
    className: 'leaderboard__table',
  });
  private readonly tbody = createElement('tbody', {
    className: 'leaderboard__table-values',
  });
  private readonly emptyText = createElement('p', {
    className: 'leaderboard__empty',
    text: EMPTY_TABLE_TEXT,
  });

  constructor(onClear: () => void, onBack: () => void) {
    const tableHeadTitle = COLUMNS.map((column) =>
      createElement('th', {
        className: `leaderboard__table-title leaderboard__table-title--${column.modifier}`,
        text: column.label,
        attributes: {
          scope: 'col',
        },
      }),
    );
    const tableRow = createElement('tr', {
      className: 'leaderboard__head-row',
      children: tableHeadTitle,
    });
    const tableHead = createElement('thead', {
      className: 'leaderboard__table-head',
      children: [tableRow],
    });

    this.table.append(tableHead, this.tbody);

    const clearButton = createElement('button', {
      className: 'leaderboard__clear',
      attributes: {
        type: 'button',
      },
    });

    const clearIcon = createSvgFromString(trashSvg);
    clearButton.append(clearIcon, CLEAR_BUTTON_TEXT);

    const backButton = createElement('button', {
      className: 'leaderboard__back',
      text: BACK_BUTTON_TEXT,
      attributes: {
        type: 'button',
      },
    });

    this.modal = new Modal({
      className: 'leaderboard',
      title: TITLE_TEXT,
      titleId: TITLE_ID,
      content: [this.table, this.emptyText],
      actions: [clearButton, backButton],
      onCancel: onBack,
      icon: trophySvg,
    });

    this.emptyText.hidden = true;

    clearButton.addEventListener('click', onClear);
    backButton.addEventListener('click', onBack);
  }

  private createRow(entry: ILeaderboardEntry, index: number): HTMLTableRowElement {
    const rowValues = [
      index + 1,
      entry.name,
      entry.score,
      formatDate(entry.date),
      entry.difficulty,
    ];
    const tableData = rowValues.map((value, columnIndex) =>
      createElement('td', {
        className: `leaderboard__table-data leaderboard__table-data--${COLUMNS[columnIndex].modifier}`,
        text: String(value),
      }),
    );
    return createElement('tr', {
      className: 'leaderboard__table-row',
      children: tableData,
    });
  }

  public show(entries: ILeaderboardEntry[], highlightIndex?: number): void {
    if (entries.length === 0) {
      this.table.hidden = true;
      this.tbody.replaceChildren();
      this.emptyText.hidden = false;
    } else {
      this.table.hidden = false;
      this.emptyText.hidden = true;
      const tableRows = entries.map((entry, index) => {
        const row = this.createRow(entry, index);
        row.classList.toggle(
          `leaderboard__table-row--${MEDALS[index]}`,
          MEDALS[index] !== undefined,
        );
        row.classList.toggle('leaderboard__table-row--active', highlightIndex === index);
        return row;
      });
      this.tbody.replaceChildren(...tableRows);
    }

    this.modal.show();
  }

  public hide(): void {
    this.modal.hide();
  }

  public render(): HTMLElement {
    return this.modal.render();
  }
}
