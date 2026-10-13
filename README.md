# 🧪 Alchemist's Cauldron

A browser puzzle game built with **TypeScript** without frameworks or libraries.
Mix ingredients from the shelf, hit three target ranges of a recipe, and brew potions before the time or your lives run out.

> 🚧 The project is in progress. Sections marked _TBD_ will be filled in as the stories are completed.

## 🎯 Game goal

Brew as many potions as possible and get the highest score.

Each recipe sets three target ranges:

- **Temperature**
- **Density**
- **Magic Power**

Every ingredient changes these three values. Add ingredients to the cauldron so that all three values land inside the recipe ranges, then press **Brew**.

A successful brew gives points and bonus time. A failed brew costs a life. The game ends when:

- the time is over;
- all lives are lost;
- the ingredients run out (every ingredient has a limited stock).

## 🗂 Task structure

The project is split into stories. Each level builds on the previous one.

| Stage                      | What is added                                                                           | Points   |
| -------------------------- | --------------------------------------------------------------------------------------- | -------- |
| 🟣 **Precondition 1**      | Repository setup, tooling, folder structure and quality checks                          | 58       |
| 🟢 **Level 1 — Basic**     | One full playable game: shelf, cauldron, bars, recipes, timer, lives, pause, Top-10     | 170 + 30 |
| 🟡 **Level 2 — Extended**  | Difficulty selection, auto-save and Continue Game                                       | 50       |
| 🔴 **Level 3 — Full game** | Drag & drop, tooltip, chemical reactions, Pour Out, keyboard shortcuts, visual feedback | 115      |

Maximum score: **393**.

Task description: [Alchemist's Cauldron — RS School](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)

## 🛠 Tech stack

- TypeScript
- HTML / CSS (icons and shapes are made with CSS, SVG or text symbols)
- No frameworks, game engines or third-party libraries in the game code

## 📁 Project structure

```
src/
├── data/      # static game data: ingredients, recipes, difficulty settings, reactions
├── logic/     # game rules as pure functions (no DOM access)
├── state/     # game state object and functions that update it
├── storage/   # localStorage helpers: save / continue, leaderboard
├── ui/        # DOM rendering and event handlers
├── styles/    # CSS styles and animations
├── assets/    # static assets (fonts, SVG) if needed
└── main.ts    # entry point: connects modules and starts the game
```

Game logic (`logic/`, `state/`, `data/`) is kept separate from rendering (`ui/`), so the rules can be changed and checked without touching the markup.

## 🚀 How to run

_TBD_

## 🎮 How to play

_TBD_

## ✅ Implemented features

_TBD_

## 🔗 Deploy

_TBD_
