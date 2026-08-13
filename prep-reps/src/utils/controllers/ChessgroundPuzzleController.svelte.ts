import type { Key } from "@lichess-org/chessground/types";
import { Puzzle } from "../Puzzle";
import type { Config } from "@lichess-org/chessground/config";
import type { Api } from "@lichess-org/chessground/api";
import { Chess, type NormalMove } from "chessops";
import { makeBoardFen, parseFen } from "chessops/fen";
import { moveEquals, opposite, parseSquare } from "chessops/util";
import { chessgroundMove } from "chessops/compat";

import "$lib/assets/Chessground/chessground.css";
import "$lib/assets/Chessground/theme.css";
import { makeSan } from "chessops/san";

export class ChessgroundPuzzleController {
  private puzzle: Puzzle;
  private ground: Api;
  private currentMove: number = $state(0);
  private playedMoves: NormalMove[] = [];
  private fenHistory: string[] = [];
  private config: Config;
  private chess: Chess;
  public currentPgn: string = $state("");

  constructor(puzzle: Puzzle, ground: Api) {
    this.puzzle = puzzle;
    console.log(this.puzzle);

    this.chess = Chess.fromSetup(parseFen(puzzle.fen).unwrap()).unwrap();
    this.config = {
      fen: puzzle.fen,
      events: {
        move: this.userMove,
      },
      movable: { color: this.chess.turn },
    };

    this.ground = ground;
    this.ground.set(this.config);
    this.playedMoves = [];
    this.fenHistory = [puzzle.fen];
    // this.currentMove = 0;
  }

  userMove = (from: Key, to: Key) => {
    const move = { from: parseSquare(from), to: parseSquare(to) } as NormalMove;
    console.debug(move, this.puzzle.moves[this.currentMove]);
    if (moveEquals(this.puzzle.moves[this.currentMove], move) === false) {
      console.debug("Inorrect move!");

      // ground.cancelMove();
      this.ground.set({
        fen: makeBoardFen(this.chess.board),
        turnColor: this.chess.turn,
        lastMove:
          this.playedMoves.length > 0
            ? chessgroundMove(this.playedMoves[this.playedMoves.length - 1])
            : undefined,
      });
    } else {
      console.debug("Correct move!", makeSan(this.chess, move));
      this.chess.play(move);
      this.playedMoves.push(move);
      this.fenHistory.push(makeBoardFen(this.chess.board));
      this.currentMove++;
      console.log(
        this.chess.turn,
        this.ground.state.movable.color,
        this.ground.state.turnColor,
      );
      if (this.currentMove === this.puzzle.moves.length) {
        console.debug("Puzzle finished!");
        this.ground.set({
          viewOnly: true,
        });
        // TODO: notify the parent to track progress AND/OR automatically start a new puzzle
      } else if (this.chess.turn != this.ground.state.movable.color) {
        const cgMove = chessgroundMove(this.puzzle.moves[this.currentMove]);
        // ground.move doesn't seem to update the turnColor
        this.ground.set({ turnColor: opposite(this.chess.turn) });
        console.debug(
          "auto playing next move, current move:",
          this.currentMove,
        );
        this.ground.move(cgMove[0], cgMove[1]);
        // no need to call chess.play() since ground.move() triggers the move event and goes into this function
      }
    }
    this.currentPgn = this.playedMoves
      .map((move: NormalMove, i: number): string =>
        makeSan(
          Chess.fromSetup(parseFen(this.fenHistory[i]).unwrap()).unwrap(),
          move,
        ),
      )
      .join(" ");
  };
}
