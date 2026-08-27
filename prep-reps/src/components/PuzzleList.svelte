<script lang="ts">
    import type { Puzzle } from "../utils/Puzzle";

    let {puzzles, selectedPuzzleIndex = $bindable()}: {puzzles: Puzzle[], selectedPuzzleIndex: number} = $props();

</script>

<ul>
{#each puzzles as puzzle, puzzleIndex (puzzle.id)}
    <li class={puzzleIndex === selectedPuzzleIndex ? "currentPuzzle" : ""}>
        <button onclick={() => {selectedPuzzleIndex = puzzleIndex}}>{puzzle.title}</button>
    </li>
{/each}
    <li class={selectedPuzzleIndex === puzzles.length ? "currentPuzzle" : ""}>
        <!-- TODO: implement new puzzle (or rather loading selected puzzles in ChessgroundAnalysis component) -->
        <button onclick={() => {alert("Not implemented yet!");}}>New Puzzle</button>
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