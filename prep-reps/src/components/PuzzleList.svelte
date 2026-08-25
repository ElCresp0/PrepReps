<script lang="ts">
    import type { Puzzle } from "../utils/Puzzle";

    let {puzzles, currentPuzzleId=""}: {puzzles: Puzzle[], currentPuzzleId?: string} = $props();

</script>

<ul>
{#each puzzles as puzzle (puzzle.id)}
    <li class={puzzle.id === currentPuzzleId ? "currentPuzzle" : ""}>
        {puzzle.title}
    </li>
{/each}
</ul>

<style>
    ul {
        list-style: none;
        padding: 0;
    }

    .currentPuzzle {
        color: blue;
    }
</style>