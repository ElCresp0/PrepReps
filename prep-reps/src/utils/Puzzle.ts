import type { FEN } from "@lichess-org/chessground/types";
import { Chess, type Move } from "chessops";
import { parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";

export class Puzzle {
    public fen: FEN;
    public moves: Move[];
    // TODO: public title: string

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

    public serialize(): {moves: string[], fen: string} {
        return {moves: ["1", "2"], fen: ""};
    }
}