# Alchemist's Cauldron

A browser game about brewing potions. Pick ingredients from the shelf, drop them into the cauldron and try to hit three target ranges — **Temperature**, **Density** and **Magic Power** — before time or lives run out.

Built for the [RS School](https://github.com/rolling-scopes-school/qualifying-stage/tree/main/tasks/game-alchemists-cauldron) qualifying stage as a single-page application in plain TypeScript and SCSS, without frameworks or libraries.

- **Deploy:** https://alchemists-cauldron-albinous.netlify.app/
- **Task:** [game-alchemists-cauldron](https://github.com/rolling-scopes-school/qualifying-stage/tree/main/tasks/game-alchemists-cauldron)
- **Creative Extension:** three visual themes and synthesized sound — see [below](#creative-extension--themes--sound)

---

## Tech stack

| Area         | Tools                                                  |
| ------------ | ------------------------------------------------------ |
| Language     | TypeScript (strict mode)                               |
| Styles       | SCSS, BEM naming, design tokens, CSS custom properties |
| Sound        | Web Audio API (no audio files)                         |
| Bundler      | Vite                                                   |
| Code quality | ESLint (typescript-eslint strict, unicorn), Prettier   |
| Git hooks    | Husky, lint-staged, commitlint                         |
| Deploy       | Netlify                                                |

---

## Getting started

```bash
git clone https://github.com/Albinous/alchemists-cauldron.git
cd alchemists-cauldron
npm install
npm run dev
```

| Script                 | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server                    |
| `npm run build`        | Type-check and build to `dist/`         |
| `npm run preview`      | Preview the production build            |
| `npm run lint`         | Run ESLint                              |
| `npm run format`       | Format the code with Prettier           |
| `npm run format:check` | Check formatting without changing files |

---

## How to play

1. Open **Settings** to choose the difficulty (Easy, Medium or Hard), a theme and the sound volume, then press **Start Game**.
2. Add ingredients to the cauldron: **click** a shelf card or **drag** it onto the cauldron. Hover a card to see its Temperature, Density and Magic Power in a tooltip.
3. Watch the three bars. Get every value into the green target zone of the current recipe.
4. Press **Brew**:
   - **success** — score, extra time and a new recipe;
   - **fail** — you lose a life.
5. A wrong mix can be cleared with **Pour Out**. It costs 10 seconds but no life.
6. On Medium and Hard, some ingredient combinations trigger **chemical reactions** that change the values or cost time or a life.
7. The game ends when time runs out, lives reach zero, or the shelf and the cauldron are both empty. A Top-10 result can be saved to the leaderboard.

### Controls

| Action         | Mouse / touch              | Keyboard                  |
| -------------- | -------------------------- | ------------------------- |
| Add ingredient | Click or drag a shelf card | `1`–`9` — N-th shelf card |
| Brew           | **Brew** button            | `B`                       |
| Pour Out       | **Pour Out** button        | `O`                       |
| Pause          | **Pause** button           | `P`                       |
| Resume         | **Resume** in the dialog   | `Esc` or `Enter`          |
| Help           | **Help** button            | `H`                       |
| Sound on / off | Switch in **Settings**     | `M`                       |

- Shortcuts use the physical key (`event.code`), so they work with any keyboard layout.
- Game shortcuts work during play only. They are disabled on the start screen, in dialogs, on the pause and Game Over screens and while typing.
- `M` works anywhere except while typing.
- All shortcuts are listed in the **Help** dialog.
- Every control is a real `<button>`, so `Tab`, `Enter` and `Space` work everywhere.

---

## Implemented features

**Score: 393 / 393** + Creative Extension

### Precondition — Project setup (58)

- [x] Repository, README, `.gitignore`, folder structure, PR template
- [x] Vite, strict TypeScript, ESLint, Prettier, Husky hooks

### Level 1 — Basic (170 + 30 common)

- [x] **US 1.1** Ingredient shelf & cauldron
  - real `<button>` cards;
  - random stock 2–15;
  - the shelf locks when the cauldron is full.
- [x] **US 1.2** Parameter bars: three bars with target and tolerance zones, a marker and the real value.
- [x] **US 1.3** Recipe & brewing check
  - random recipe for the difficulty;
  - Brew check with tolerance;
  - score, time bonus and a new recipe on success.
- [x] **US 1.4** Timer & Game Over
  - the timer works from `Date.now()` timestamps;
  - lives;
  - three Game Over reasons.
- [x] **US 1.5** Pause
  - pause dialog;
  - the game also pauses when the tab is hidden;
  - the timer is frozen while paused.
- [x] **US 1.6** Leaderboard
  - Top-10 table with medals for the top 3;
  - name validation;
  - in-app confirm dialog for clearing.

### Level 2 — Extended (50)

- [x] **US 2.1** Difficulty selection
  - Easy / Medium / Hard in Settings;
  - all numbers come from one settings table.
- [x] **US 2.2** Auto-save & Continue Game
  - the game is saved to `localStorage` after every action;
  - **Continue Game** opens a valid save in the paused state;
  - broken or missing data is ignored safely.

### Level 3 — Full game (115)

- [x] **US 3.1** Drag & drop
  - shelf cards can be dragged into the cauldron;
  - drop is enabled only while playing and when the cauldron is not full.
- [x] **US 3.2** Ingredient tooltip
  - parameters in a tooltip with `+` / `−` signs;
  - opens left or up near the screen edges;
  - hidden while paused.
- [x] **US 3.3** Chemical reactions
  - a typed `IReaction[]` table;
  - 2 reactions on Medium, 3 on Hard;
  - a reaction fires only on the not active → active change.
- [x] **US 3.4** Pour Out: clears the cauldron for 10 seconds, no life lost, disabled when the cauldron is empty.
- [x] **US 3.5** Visual feedback
  - success glow;
  - explosion with a screen shake;
  - floating ingredient icons;
  - smooth bars;
  - CSS animations only.
- [x] **US 3.6** Keyboard shortcuts
  - one handler, gated by the game state;
  - ignored while typing.

---

## Creative Extension — Themes & Sound

### Themes

Three visual themes, switched in **Settings → Theme**:

| Theme         | Mood                                                         |
| ------------- | ------------------------------------------------------------ |
| **Alchemy**   | Dark workshop — the default look                             |
| **Parchment** | Old recipe book — light, warm paper tones                    |
| **Pixel**     | Arcade neon — pixel font, square corners, stepped animations |

- Each theme is a set of CSS custom properties (colors, fonts, radius, easing) on `:root[data-theme]`. Components use Sass tokens that point to these variables, so a theme changes the whole UI without extra styles in components.
- Every theme card in Settings shows a live preview rendered with that theme's own variables.
- Icons use `currentColor`, so they follow the theme too.
- The chosen theme is saved to `localStorage` and applied before the game renders.

### Sound

All sound is **synthesized in real time with the Web Audio API** — the game has no audio files.

| Event             | Sound                                                    |
| ----------------- | -------------------------------------------------------- |
| During a game     | Background music loop that speeds up in the last seconds |
| Add an ingredient | Bubble                                                   |
| Successful brew   | Rising four-note chord                                   |
| Failed brew       | Fizz and a low thud                                      |
| Reaction fires    | Shimmering chime                                         |
| Pour Out          | Draining splash                                          |
| Last seconds      | Clock tick every second                                  |
| Game over         | Falling three-note motif                                 |

- Audio graph: `effects` and `music` gain nodes → `master` gain → speakers.
- **Settings → Sound**: a mute switch and three volume sliders (Master, Music, Effects). Volume changes are smoothed, so sliders don't click.
- Background music is rendered once with `OfflineAudioContext` into a buffer and looped; in the last seconds its `playbackRate` rises smoothly.
- The audio context starts on the first click or key press, as browsers require (autoplay policy).
- Sound pauses with the game and resumes with it.
- Volume and mute state are saved to `localStorage`.

### Technical notes

- Sound effects are described as data (`SOUND_RECIPES`): each sound is a list of tone and noise steps played by a small synth (`playTone`, `playNoise`).
- Settings are read field by field and validated, so broken or outdated data in `localStorage` falls back to defaults.
- No new dependencies: TypeScript, SCSS and browser APIs only.

---

## Reactions

Values are recalculated from the ingredient list every time. Active reactions are then applied to these values in table order, and the result is rounded.

| Difficulty | Reaction     | Trigger                                                  | Effect                           |
| ---------- | ------------ | -------------------------------------------------------- | -------------------------------- |
| Medium     | Bubbling     | Fairy Dust + Caustic Acid                                | Magic Power +50%, −10 s once     |
| Medium     | Solar Frost  | Dragon Tears + Frost Lotus                               | Temperature = 0, Density +20%    |
| Hard       | Volatile Mix | Phoenix Feather + Essence of the Void                    | −1 life, the cauldron is cleared |
| Hard       | Annihilation | One ingredient with Temperature > +15 and one with < −15 | Temperature = 0, Density ×2      |
| Hard       | Steam Burst  | Dragon Tears + Caustic Acid and total Temperature ≥ 35   | Temperature +10, −5 s once       |

- **Value changes** (`apply`) are applied on every recalculation while the reaction is active, so the bars and the Brew check always use the same values.
- **One-time effects** (time, life, clearing the cauldron) are applied only when the reaction fires, i.e. changes from not active to active.

---

## Project structure

```
src/
├── app/            App — owns the game state and the timer, connects logic with UI
├── assets/         SVG icons and the cauldron image
├── audio/          Web Audio engine, synth, sound effects and background music
├── data/           static data: ingredients, recipes, difficulty settings, reactions,
│                   shortcuts, themes and sound settings, sound recipes, music
├── logic/          game rules as pure functions (no DOM)
├── state/          initial and new game state
├── storage/        localStorage: save / continue, leaderboard, user settings
├── styles/         themes, design tokens, mixins, base styles
├── types/          shared TypeScript types
├── ui/
│   ├── components/ Header, Shelf, Cauldron, Recipe, Bars, Controls,
│   │               Modal and dialogs: GameOver, Pause, Leaderboard, Confirm, Help, Settings
│   ├── dom.ts      DOM helpers (createElement, createSvgFromString, playAnimation, …)
│   ├── layout.ts   page skeleton
│   └── theme.ts    applies the selected theme
├── utils/          small helpers: formatting numbers, time and dates
└── main.ts         entry point
```

### Architecture

The app follows a one-way data flow:

```
user action → component callback → App handler → logic changes state → save → App.renderGame()
```

- **State lives in one place**, in `App.state`. The DOM never stores game data.
- **Logic** (`src/logic`) contains game rules only and never touches the DOM.
- **Components** only display what they receive and report user actions through callbacks.
- **Dialogs** are built on one `Modal` component (native `<dialog>`). The browser `alert()` and `confirm()` are not used.
- **Timer**: the end time is stored as a timestamp. Every tick recalculates the time left from `Date.now()`.
- **Audio** is a separate layer: App calls `playSound(name)` and `music.start()` / `music.stop()`, and the audio engine owns the `AudioContext` and the volume channels.

---

## Git workflow

- `main` — initial commit only
- `story-1` → `story-2` → `story-3` — one branch per level, each created from the previous one
- `creative-extension` — created from `story-3` for the Creative Extension
- `feat/*`, `fix/*`, `chore/*`, `docs/*` — task branches, merged into the current story branch through pull requests
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

---

## Author

[Albinous](https://github.com/Albinous)
