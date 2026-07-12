# Prep Reps - Repertoire Repetition Training

## Summary

The idea of this project is to provide a simple web chess application, built mostly on available modules, showcasing technical skills of integrating and building on solutions and giving chess players a single place to focus specifically on memorizing chess openings

## components

- [chessground](https://github.com/lichess-org/chessground)
  - or [chessboard.js](https://chessboardjs.com/)?
- [chess.js](https://www.npmjs.com/package/chess.js?activeTab=readme)
- (?) [scalachess](https://github.com/lichess-org/scalachess)

## ideas

- online games importer/analyser to semi-automize prep building

## tech stack

- Svelte (lightweight frontend framework with typescript support), SvelteKit

## setup

```bash
cd prep-reps
npm i
npm run dev
```

# TODO

* navigating through played moves
  * bind move tree navigation buttons with keyboard arrows
  * make currentPgn a list (tree) of clickable nodes
* move tree logic with sidelines
* DB with puzzle library (Create-Read for starters)
* side panel to navigate through puzzles
