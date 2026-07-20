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
    import ChessgroundControls from "./ChessgroundControls.svelte";
    import { firstMove, lastMove, nextMove, prevMove } from "../utils/ChessUtils";

    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";
    import { makeSan } from "chessops/san";


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
                "lastMove": playedMoves.length > 0 ? chessgroundMove(playedMoves[playedMoves.length - 1]) : undefined,
            })
        }
        else {
            console.debug("Correct move!", makeSan(chess, move));
            chess.play(move);
            playedMoves.push(move);
            fenHistory.push(makeBoardFen(chess.board));
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

    let {board="blue", pieces="merida", puzzle, nextPuzzleFoo}: {board: string, pieces: string, puzzle: Puzzle, nextPuzzleFoo: CallableFunction} = $props();
    let chessDiv: HTMLElement;
    let ground: Api;
    let currentMove: number;
    let playedMoves: Move[] = $state([]);
    let fenHistory: string[] = [];

    let chess = $derived(Chess.fromSetup(parseFen(puzzle.fen).unwrap()).unwrap());
    let config: Config = $derived({
        "fen": puzzle.fen,
        "events": {
            "move": userMove,
        },
        "movable": {"color": chess.turn},
    });
    
    let chessgroundButtons = $derived([
        {onclick: firstMove, label: "<<"}, // &laquo;
        {onclick: prevMove, label: "<"}, //&#8249;
        {onclick: nextMove, label: ">"}, // &#8250;
        {onclick: lastMove, label: ">>"}, // &raquo;
        {onclick: nextPuzzleFoo, label: "Next Puzzle"},
    ]);

    let currentPgn = $derived(
        // makePgn(chess);
        playedMoves.map((move: Move, i: number): string => makeSan(Chess.fromSetup(parseFen(fenHistory[i]).unwrap()).unwrap(), move)).join(" ")
    );

    $effect(() => {
        // updating the puzzle prop triggers this event
        ground = Chessground(chessDiv!, config);
        playedMoves = [];
        fenHistory = [puzzle.fen];
        currentMove = 0;
        $inspect(playedMoves); // logging
    })

</script>

<div bind:this={chessDiv} class="{board} {pieces}" id="chessDiv"></div>
<ChessgroundControls buttonDefs={chessgroundButtons} --buttonsCount={chessgroundButtons.length}/>

<p>{currentPgn}</p>

<style>
    #chessDiv {
		width: var(--chessgroundSize);
		height: var(--chessgroundSize);
        margin-bottom: 20px;
	}
</style>