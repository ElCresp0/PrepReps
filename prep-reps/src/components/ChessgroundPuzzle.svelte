<script lang="ts">
    import { Chessground } from "@lichess-org/chessground";
    import { Puzzle } from "../utils/Puzzle";
    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";
    import { ChessgroundPuzzleController } from "../utils/controllers/ChessgroundPuzzleController.svelte";
    import type { Api } from "@lichess-org/chessground/api";


    let {board="blue", pieces="merida", puzzle}: {board: string, pieces: string, puzzle: Puzzle} = $props();
    let chessDiv: HTMLElement;
    let puzzleController: ChessgroundPuzzleController | undefined = $state();
    let ground: Api;

    $effect(() => {
        ground = Chessground(chessDiv!);
        puzzleController = new ChessgroundPuzzleController(puzzle, ground);
    })

</script>

<h2>{puzzle.title}</h2>

<div class="chessground-puzzle-horizontal-box">
    <div bind:this={chessDiv} class="{board} {pieces}" id="chessDiv"></div>
</div>
<div class="chessground-puzzle-horizontal-box">
    <p>{puzzleController?.currentPgn}</p>
</div>

<style>
    #chessDiv {
		width: var(--chessgroundSize);
		height: var(--chessgroundSize);
        margin-bottom: 20px;
	}

    .chessground-puzzle-horizontal-box {
        display: inline-block;
        vertical-align: top;
        padding-right: 2em;
    }
</style>