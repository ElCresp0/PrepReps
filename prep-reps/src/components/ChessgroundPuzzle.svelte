<script lang="ts">
    import { Chessground } from "@lichess-org/chessground";
	import type { Key } from "@lichess-org/chessground/types";
    import { Puzzle } from "../utils/Puzzle";
	import type { Config } from "@lichess-org/chessground/config";
	import type { Api } from "@lichess-org/chessground/api";
    import { Chess, type Move } from "chessops";
    import { makeBoardFen, parseFen } from "chessops/fen";
    import { moveEquals, opposite, parseSquare } from "chessops/util";
    import { chessgroundMove } from "chessops/compat";

    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";


    function userMove(from: Key, to: Key):void {
        console.debug(`move ${from} -> ${to}`)
        let move = {from: parseSquare(from), to: parseSquare(to)} as Move;
        console.debug(move, puzzle.moves[currentMove]);
        if (moveEquals(puzzle.moves[currentMove], move) === false) {
            console.debug("Inorrect move!");

            // ground.cancelMove();
            ground.set({
                "fen": makeBoardFen(chess.board),
                "turnColor": chess.turn,
                "lastMove": playedMoves.length > 0 ? chessgroundMove(playedMoves[-1]) : undefined,
            })
        }
        else {
            console.debug("Correct move!");
            chess.play(move);
            currentMove++;
            console.log(chess.turn, ground.state.movable.color, ground.state.turnColor);
            if (currentMove === puzzle.moves.length) {
                console.debug("Puzzle finished!");
                // TODO: notify the parent to track progress AND/OR automatically start a new puzzle
            }
            else if (chess.turn != ground.state.movable.color) {
                let cgMove = chessgroundMove(puzzle.moves[currentMove]);
                // ground.movve doesn't seem to update the turnColor
                ground.set({"turnColor": opposite(chess.turn)});
                ground.move(cgMove[0], cgMove[1]);
                // no need to call chess.play() since ground.move() triggers the move event and goes into this function
            }
        }
    }

    let {board="blue", pieces="merida", puzzle}: {board: string, pieces: string, puzzle: Puzzle} = $props();
    let chessDiv: HTMLElement;
    let ground: Api;
    let currentMove: number;
    let playedMoves: Move[];

    let chess = $derived(Chess.fromSetup(parseFen(puzzle.fen).unwrap()).unwrap());
    let config: Config = $derived({
        "fen": puzzle.fen,
        "events": {
            "move": userMove,
        },
        "movable": {"color": chess.turn},
    });
    
    $effect(() => {
        // updating the puzzle prop triggers this event
        ground = Chessground(chessDiv!, config);
        playedMoves = [];
        currentMove = 0;
    })

</script>

<div bind:this={chessDiv} class="{board} {pieces}" id="chessDiv"></div>

<style>
    #chessDiv { /* :global(.cg-wrap) */
		width: 512px;
		height: 512px;
        margin-bottom: 20px;
	}
</style>