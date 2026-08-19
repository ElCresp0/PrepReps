import type { Key } from "@lichess-org/chessground/types";
import { Puzzle } from "../Puzzle";
import type { Api } from "@lichess-org/chessground/api";
import { type NormalMove } from "chessops";
import { makeFen } from "chessops/fen";
import { moveEquals, parseSquare } from "chessops/util";
import { chessgroundMove } from "chessops/compat";

import "$lib/assets/Chessground/chessground.css";
import "$lib/assets/Chessground/theme.css";
import { ChessgroundController } from "./ChessgroundController.svelte";

export class ChessgroundPuzzleController extends ChessgroundController {
  private puzzle: Puzzle;
  public currentPgn: string = $state("");
  private playerColor: "white" | "black" | "both" | undefined;

  constructor(puzzle: Puzzle, ground: Api) {
    super(ground, puzzle.fen);
    this.puzzle = puzzle;
    this.userMove = this.userMove.bind(this);
    this.ground.set({
      events: {
        move: this.userMove,
      },
    });
    this.playerColor = this.ground.state.movable.color;
  }

  userMove = (from: Key, to: Key) => {
    const move = { from: parseSquare(from), to: parseSquare(to) } as NormalMove;
    if (moveEquals(this.puzzle.moves[this.currentLine.length], move)) {
      // correct move
      super.userMove(from, to);

      if (this.currentLine.length === this.puzzle.moves.length) {
        console.debug("Puzzle finished!");
        this.ground.set({
          viewOnly: true,
        });
        // TODO: notify the parent to track progress AND/OR automatically start a new puzzle
      } else if (this.chessLogic.turn !== this.playerColor) {
        const cgMove = chessgroundMove(
          this.puzzle.moves[this.currentLine.length],
        );
        this.ground.move(cgMove[0], cgMove[1]);
      }
    } else {
      // incorrect move
      console.debug("Inorrect move!");

      // ground.cancelMove();
      this.ground.set({
        fen: makeFen(this.chessLogic.toSetup()),
        turnColor: this.chessLogic.turn,
        lastMove:
          this.currentLine.length > 0
            ? chessgroundMove(this.currentLine[this.currentLine.length - 1])
            : undefined,
      });
    }
  };
}
