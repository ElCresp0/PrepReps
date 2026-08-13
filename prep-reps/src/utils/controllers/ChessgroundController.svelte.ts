import type { Key } from "@lichess-org/chessground/types";
import type { Config } from "@lichess-org/chessground/config";
import type { Api } from "@lichess-org/chessground/api";
import { Chess, type NormalMove } from "chessops";
import { INITIAL_FEN, makeFen, parseFen } from "chessops/fen";
import { parseSquare } from "chessops/util";
import { chessgroundMove } from "chessops/compat";

import "$lib/assets/Chessground/chessground.css";
import "$lib/assets/Chessground/theme.css";
import { makeSan } from "chessops/san";
import {
  ChildNode,
  Node,
  defaultGame,
  makePgn,
  type Game,
  type PgnNodeData,
} from "chessops/pgn";
import { SvelteMap } from "svelte/reactivity";

export class ChessgroundController {
  private ground: Api;
  private currentLine: NormalMove[] = [];
  private initialFen: string;
  private config: Config;
  private chessGame: Game<PgnNodeData>;
  private chessLogic: Chess;
  public currentPgn: string = $state("");
  private currentMoveNode: Node<PgnNodeData> | null = null;

  constructor(ground: Api, fen: string = INITIAL_FEN) {
    this.initialFen = fen;
    this.chessGame = defaultGame<PgnNodeData>(
      () => new SvelteMap<string, string>([["FEN", this.initialFen]]),
    );
    this.chessLogic = Chess.fromSetup(
      parseFen(this.initialFen).unwrap(),
    ).unwrap();

    this.config = {
      fen: makeFen(this.chessLogic.toSetup()),
      events: {
        move: this.userMove,
      },
      movable: { color: this.chessLogic.turn },
    };
    this.ground = ground;
    this.ground.set(this.config);
  }

  reloadAllObjects() {
    // updates everything based on this.currentLine
    this.chessLogic = Chess.fromSetup(
      parseFen(this.initialFen).unwrap(),
    ).unwrap();
    this.currentMoveNode = this.chessGame.moves;

    for (const move of this.currentLine) {
      this.currentMoveNode = this.currentMoveNode!.children.find((child) => {
        return child.data.san === makeSan(this.chessLogic, move);
      })!;
      this.chessLogic.play(move);
    }

    this.currentPgn = makePgn(this.chessGame);
    this.ground.set({
      fen: makeFen(this.chessLogic.toSetup()),
      movable: { color: this.chessLogic.turn },
      turnColor: this.chessLogic.turn,
      lastMove:
        this.currentLine.length > 0
          ? chessgroundMove(this.currentLine[this.currentLine.length - 1])
          : undefined,
    });
  }

  userMove = (from: Key, to: Key) => {
    const move = { from: parseSquare(from), to: parseSquare(to) } as NormalMove;

    if (this.chessLogic.isLegal(move)) {
      console.debug("Correct move!", makeSan(this.chessLogic, move));

      const newMove = new ChildNode<PgnNodeData>({
        san: makeSan(this.chessLogic, move),
      });

      // push move to game tree
      if (this.currentMoveNode === null) {
        // first move = root
        this.chessGame.moves.children.push(newMove);
        this.currentMoveNode = newMove;
      } else {
        this.currentMoveNode!.children.push(newMove);
        this.currentMoveNode = newMove;
      }

      // update all objects
      this.chessLogic.play(move);
      this.currentLine.push(move);
      this.currentPgn = makePgn(this.chessGame);
      console.debug("turn:", this.chessLogic.turn);
      this.ground.set({
        movable: { color: this.chessLogic.turn },
      });
    } else {
      console.debug("Incorrect move!", move, { color: this.chessLogic.turn });
      this.ground.set({
        fen: makeFen(this.chessLogic.toSetup()),
        movable: { color: this.chessLogic.turn },
        turnColor: this.chessLogic.turn,
        lastMove:
          this.currentLine.length > 0
            ? chessgroundMove(this.currentLine[this.currentLine.length - 1])
            : undefined,
      });
    }
  };

  firstMove = () => {
    console.log("firstMove");
  };

  prevMove = () => {
    this.currentLine.pop();
    this.reloadAllObjects();
  };

  nextMove = () => {
    console.log("nextMove");
  };

  lastMove = () => {
    console.log("lastMove");
  };
}
