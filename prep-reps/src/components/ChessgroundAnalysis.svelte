<script lang="ts">
    import { Chessground } from "@lichess-org/chessground";
	import type { Key } from "@lichess-org/chessground/types";
	import type { Config } from "@lichess-org/chessground/config";
	import type { Api } from "@lichess-org/chessground/api";
    import { Chess, defaultSetup, type NormalMove } from "chessops";
    import { makeBoardFen, makeFen } from "chessops/fen";
    import { parseSquare } from "chessops/util";
    import { chessgroundMove } from "chessops/compat";
    import ChessgroundControls from "./ChessgroundControls.svelte";
    import { firstMove, lastMove, nextMove, prevMove } from "../utils/ChessUtils";

    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";
    import { makeSan } from "chessops/san";
    import { onMount } from "svelte";
    import { ChildNode, defaultGame, makePgn, type PgnNodeData } from "chessops/pgn";
    import { enhance } from "$app/forms";

    function userMove(from: Key, to: Key):void {

        let move = {from: parseSquare(from), to: parseSquare(to)} as NormalMove;

        if (chessLogic.isLegal(move)) {
            console.debug("Correct move!", makeSan(Chess.fromSetup(chess).unwrap(), move));

            const newMove = new ChildNode<PgnNodeData>({
                san: makeSan(chessLogic, move),
            });

            // push move to game tree
            if (currentMoveNode === null) {
                // first move = root
                chessGame.moves.children.push(newMove);
                currentMoveNode = newMove;
            }
            else {
                currentMoveNode!.children.push(newMove);
                currentMoveNode = newMove;
            }

            // update all objects
            chessLogic.play(move);
            playedMoves.push(move);
            fenHistory.push(makeFen(chessLogic.toSetup()));
            currentPgn = makePgn(chessGame);
            console.debug("turn:", chessLogic.turn);
            ground.set({
                "movable": {"color": chessLogic.turn},
            });

        }
        else {
            console.debug("Incorrect move!", move, {"color": chessLogic.turn});
            ground.set({
                "fen": makeFen(chessLogic.toSetup()),
                "movable": {"color": chessLogic.turn},
                "turnColor": chessLogic.turn,
                "lastMove": playedMoves.length > 0 ? chessgroundMove(playedMoves[playedMoves.length - 1]) : undefined,
            })
        }
    }

    let {board="blue", pieces="merida", postPuzzleMessage=""}: {board: string, pieces: string, postPuzzleMessage: string|null} = $props();
    let chessDiv: HTMLElement;
    let ground: Api;
    let playedMoves: NormalMove[] = $state([]);
    let fenHistory: string[] = [];
    let currentMoveNode: ChildNode<PgnNodeData>|null = $state(null);

    // TODO: set FEN from text field
    // TODO: set PGN from text field
    let chess = $state(defaultSetup());
    let chessLogic = $derived(Chess.fromSetup(chess).unwrap());
    let chessGame = defaultGame<PgnNodeData>();

    let config: Config = $derived({
        "fen": makeBoardFen(chess.board),
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
    ]);

    let currentPgn = $state("");

    onMount(() => {
        playedMoves = [];
        fenHistory = [makeFen(chess)];
        ground = Chessground(chessDiv!, config);
    })

    $effect(() => {
        // updating the puzzle prop triggers this event
        ground.set(config);
    })

</script>

<div bind:this={chessDiv} class="{board} {pieces}" id="chessDiv"></div>
<ChessgroundControls buttonDefs={chessgroundButtons} --buttonsCount={chessgroundButtons.length}/>

<br/>

<form method="POST" use:enhance>
    <div class="form-group">
        <label for="title">title</label>
        <input name="title" type="title" id="title">
    </div>
    <div class="form-group">
        <label for="pgn">pgn</label>
        <input name="pgn" type="pgn" id="pgn" value={currentPgn}>
    </div>
    <button type="submit" formaction="?/postPuzzle">Save</button>
</form>

<p class="error_message">{postPuzzleMessage}</p>

<style>
    #chessDiv {
		width: var(--chessgroundSize);
		height: var(--chessgroundSize);
        margin-bottom: 20px;
	}

    form {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    }

    label {display: block;}

    .form-group {
        margin-bottom: 5px;
    }

    .error_message {
        font-style: italic;
        color: #f00;
    }
</style>