import type { FEN } from "@lichess-org/chessground/types";
// import type { Move } from "chessops/types";
import { Chess, type Move } from "chessops";
import { parseFen } from "chessops/fen";
// import { parsePgn } from "chessops/pgn";
import { parseSan } from "chessops/san";
// import type { Move } from "./Move";
// import assert from "assert";

export class Puzzle {
    public fen: FEN;
    public moves: Move[];

    constructor(fen: FEN, moves: string[]) {
        this.fen = fen;
        this.moves = [];

        let chess = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();
        moves.forEach((m) => {
            let parsed = parseSan(chess, m)!;
            this.moves.push(parsed);
            chess.play(parsed);
        })
    }
}