<script lang="ts">
	import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";
    import { goto } from "$app/navigation";


	let { data }: PageProps = $props();

	let puzzleIndex = $state(0);
	let puzzle = $derived((data.puzzles.length > puzzleIndex) ? new Puzzle(data.puzzles[puzzleIndex].title, data.puzzles[puzzleIndex].pgn, data.puzzles[puzzleIndex].id) : null);
	let chessGroundSize = "512px";

	function nextPuzzle() {
		puzzleIndex++;
		console.debug("next puzzle");
	}

    function deletePuzzle() {
        goto(resolve(puzzle ? `/train?delete=1&puzzle_id=${puzzle.id}` : '/train'));
        nextPuzzle();
    }

	// TODO: move navigation
	let chessgroundButtons = $derived(
        data.signed_in ? [
            {dropdown:
                [
                    {onclick: deletePuzzle, label: "Delete"},
                    // {onclick: editPuzzle, label: "Edit"},
                ],
                label: "mdi-settings",
            },
            {onclick: nextPuzzle, label: "Next"},
        ]
        : [
            {onclick: nextPuzzle, label: "Next"}
        ]
    );

</script>

<br /><br />

{#if data.puzzles.length === 0}
	<p>You haven't uploaded any puzzles yet! Head over to <a href={resolve("/construct")}>Construct page</a> to build your repertoire!</p>
{:else if puzzleIndex === data.puzzles.length}
	<p>That was your last puzzle! Refresh the page to start over.</p>
{:else}
	<ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle!} buttonDefs={chessgroundButtons} --chessgroundSize={chessGroundSize}/>
{/if}

<!-- TODO: all puzzles view -->
<!-- TODO: interactive pgn view -->
