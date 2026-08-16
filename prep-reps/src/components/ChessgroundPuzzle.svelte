<script lang="ts">
    import { Chessground } from "@lichess-org/chessground";
    import { Puzzle } from "../utils/Puzzle";
    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";
    import { ChessgroundPuzzleController } from "../utils/controllers/ChessgroundPuzzleController.svelte";
    import type { Api } from "@lichess-org/chessground/api";
    import ChessgroundControls from "./ChessgroundControls.svelte";
    import type { IButtonLabel } from "../utils/interfaces/IButtonLabel";
    import ChessopsPgnView from "./ChessopsPgnView.svelte";


    let {board="blue", pieces="merida", puzzle, buttonDefs}: {board: string, pieces: string, puzzle: Puzzle, buttonDefs: IButtonLabel[]} = $props();
    let chessDiv: HTMLElement;
    let puzzleController: ChessgroundPuzzleController | undefined = $state();
    let ground: Api;

    let chessgroundButtons: IButtonLabel[] = $derived(
        [
            {label: "<<", onclick: puzzleController?.firstMove},
            {label: "<", onclick: puzzleController?.prevMove},
            {label: ">", onclick: puzzleController?.nextMove},
            {label: ">>", onclick: puzzleController?.lastMove},
            ...buttonDefs,
        ]
    );

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
    <ChessopsPgnView chessgroundController={puzzleController!}/>
</div>

<ChessgroundControls buttonDefs={chessgroundButtons} --buttonsCount={chessgroundButtons.length}/>