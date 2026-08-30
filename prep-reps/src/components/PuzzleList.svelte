<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { NEW_PUZZLE_ID } from "../utils/constants";
    import type { Puzzle } from "../utils/Puzzle";
    import { chessgroundAnalysisState } from "./ChessgroundAnalysis/state.svelte";

    let {puzzles, selectedPuzzleIndex = $bindable()}: {puzzles: Puzzle[], selectedPuzzleIndex: number} = $props();

</script>

<ul>
{#each puzzles as puzzle, puzzleIndex (puzzle.id)}
    <li class={puzzleIndex === selectedPuzzleIndex ? "currentPuzzle" : NEW_PUZZLE_ID}>
        <button onclick={() => {selectedPuzzleIndex = puzzleIndex;}}>{puzzle.title}</button>
    </li>
{/each}
    <li class={selectedPuzzleIndex === puzzles.length ? "currentPuzzle" : NEW_PUZZLE_ID}>
        <button onclick={() => {chessgroundAnalysisState.puzzleIndex = puzzles.length; goto(resolve("/construct"));}}>New Puzzle</button>
    </li>
</ul>

<style>
    ul {
        list-style: none;
        padding: 0;
    }

    .currentPuzzle > *{
        color: blue;
    }
</style>