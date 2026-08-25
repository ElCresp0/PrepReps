import { Puzzle } from "./Puzzle";

export const CHESSBOARD_SIZE = "512px";

export const DEMO_PUZZLES = [
  new Puzzle(
    "Puzzle1",
    '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]\n\n 1. e4 c5 2. Nf3',
    "0",
  ).serialize(),
  new Puzzle(
    "Puzzle2",
    '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]\n\n 1. e4 c5 2. Nh3',
    "1",
  ).serialize(),
];
