import { getPuzzles } from "../../utils/BackendController";
import { Puzzle } from "../../utils/Puzzle";
import type { PageServerLoad } from "./$types";

const DEMO_PUZZLES = [
  new Puzzle(
    "Puzzle1",
    '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]\n\n 1. e4 c5 2. Nf3',
  ).serialize(),
  new Puzzle(
    "Puzzle1",
    '[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]\n\n 1. e4 c5 2. Nh3',
  ).serialize(),
];

export const load: PageServerLoad = async (event) => {
  return {
    puzzles: event.locals.token
      ? await getPuzzles(event.locals.token!)
      : DEMO_PUZZLES,
  };
};
