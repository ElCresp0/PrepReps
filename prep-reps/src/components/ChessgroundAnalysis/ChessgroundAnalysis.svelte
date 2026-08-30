<script lang="ts">
    import { Chessground } from "@lichess-org/chessground";
	import type { Api } from "@lichess-org/chessground/api";
    import ChessgroundControls from "../ChessgroundControls.svelte";

    import "$lib/assets/Chessground/chessground.css";
    import "$lib/assets/Chessground/theme.css";
    import { ChessgroundController } from "../../utils/controllers/ChessgroundController.svelte";
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import type { IButtonLabel } from "../../utils/interfaces/IButtonLabel";
    import ChessopsPgnView from "../ChessopsPgnView/ChessopsPgnView.svelte";
    import { chessgroundAnalysisState as _state } from "./state.svelte";
    import { NEW_PUZZLE_ID } from "../../utils/constants";


    let {board="blue", pieces="merida", postPuzzleMessage=""}: {board: string, pieces: string, postPuzzleMessage: string|null} = $props();
    let chessDiv: HTMLElement;
    let ground: Api;
    let chessgroundController: ChessgroundController | undefined = $state();
    let chessgroundButtons: IButtonLabel[] = $state([]);

    onMount(() => {
        ground = Chessground(chessDiv!);
        chessgroundController = new ChessgroundController(ground);
        chessgroundButtons.push({label: "<<", onclick: chessgroundController.firstMove});
        chessgroundButtons.push({label: "<", onclick: chessgroundController.prevMove});
        chessgroundButtons.push({label: ">", onclick: chessgroundController.nextMove});
        chessgroundButtons.push({label: ">>", onclick: chessgroundController.lastMove});
    });

</script>

<div class="chessground-puzzle-horizontal-box">
    <div bind:this={chessDiv} class="{board} {pieces}" id="chessDiv"></div>
    <div><ChessgroundControls buttonDefs={chessgroundButtons} --buttonsCount={chessgroundButtons.length}/></div>
    <div>
        <form method="POST" class="chessground-analysis-form" use:enhance>
            <div class="form-group">
                <label for="title">Title</label>
                <input name="title" type="title" id="title">
                <!-- <button>Reset</button> -->
            </div>
            <div class="form-group">
                <label for="pgn">Pgn</label>
                <input name="pgn" type="pgn" id="pgn" value={chessgroundController?.currentPgn}>
            </div>
            
            {#if _state.currentPuzzleId === NEW_PUZZLE_ID}
                <button type="submit" formaction="?/postPuzzle">Save</button>
            {:else}
                <button type="submit" formaction="?/patchPuzzle">Update</button>
            {/if}
            
            <!-- TODO: PATCH -->
            <!-- <button type="submit" formaction="?/postPuzzle">Update</button> -->
        </form>
        <p class="error_message">{postPuzzleMessage}</p>
    </div>
</div>
<div class="chessground-puzzle-horizontal-box side-component">
    {#if chessgroundController !== undefined}
        <ChessopsPgnView currNode={chessgroundController.currentInteractivePgn} indent={1}/>
    {/if}
</div>

<style lang="css">
    label {display: block;}

    .form-group {
        margin-bottom: 5px;
    }

    .chessground-analysis-form {
        border-radius: 5px;
        background-color: #f2f2f2;

        /* padding + box-sizing applies the padding inside the specified width
            instead of widening the container
        */
        padding: 20px;
        box-sizing: border-box;
        width: var(--chessgroundSize);
    }

    .error_message {
        font-style: italic;
        color: #f00;
    }
</style>