import type { FEN } from "@lichess-org/chessground/types";
import { Chess, defaultSetup, type NormalMove } from "chessops";
import { makeFen, parseFen } from "chessops/fen";
import {
  ChildNode,
  defaultGame,
  makePgn,
  parsePgn,
  type PgnNodeData,
} from "chessops/pgn";
import { makeSan, parseSan } from "chessops/san";

export class Puzzle {
  public title: string;
  public fen: FEN;
  public moves: NormalMove[];
  public id: string;

  constructor(title: string, pgn: string, id: string) {
    const game = parsePgn(pgn)[0];

    this.title = title;
    this.fen = game.headers.get("FEN") || makeFen(defaultSetup());
    this.moves = [];
    this.id = id;

    const chess = Chess.fromSetup(parseFen(this.fen).unwrap()).unwrap();
    let currentMove = game.moves.children[0];
    while (currentMove) {
      const parsedSan = parseSan(chess, currentMove.data.san) as NormalMove;
      this.moves.push(parsedSan);
      chess.play(parsedSan);
      currentMove = currentMove.children[0];
    }
  }

  public serialize(): { title: string; pgn: string; id: string } {
    const game = defaultGame<PgnNodeData>();
    game.headers.set("FEN", this.fen);

    const chess = Chess.fromSetup(parseFen(this.fen).unwrap()).unwrap();
    let currMoveNode = new ChildNode<PgnNodeData>({
      san: makeSan(chess, this.moves[0]),
    });
    const rootMove = currMoveNode;

    for (let i = 1; i < this.moves.length; i++) {
      chess.play(this.moves[i - 1]);
      const childNode = new ChildNode({ san: makeSan(chess, this.moves[i]) });
      currMoveNode.children.push(childNode);
      currMoveNode = currMoveNode.children[0];
    }
    game.moves.children.push(rootMove);

    const pgn = makePgn(game);
    return { title: this.title, pgn: pgn, id: this.id };
  }

  public static deserialize({
    title,
    pgn,
    id,
  }: {
    title: string;
    pgn: string;
    id: string;
  }): Puzzle {
    return new Puzzle(title, pgn, id);
  }
}
