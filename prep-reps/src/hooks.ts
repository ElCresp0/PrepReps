import type { Transport } from "@sveltejs/kit";
import { Puzzle } from "./utils/Puzzle";

export const transport: Transport = {
  Puzzle: {
    encode: (value) => value instanceof Puzzle && value.serialize(),
    decode: ({ title, pgn, id }: { title: string; pgn: string; id: string }) =>
      new Puzzle(title, pgn, id),
  },
};
