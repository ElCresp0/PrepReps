<script lang="ts">
	import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";


	let { data }: PageProps = $props();

	let puzzleIndex = $state(0);
	let puzzle = $derived((data.puzzles.length > puzzleIndex) ? new Puzzle(data.puzzles[puzzleIndex].title, data.puzzles[puzzleIndex].pgn) : null);
	let chessGroundSize = "512px";

	function nextPuzzle() {
		puzzleIndex++;
		console.debug("next puzzle");
	}

</script>

<br /><br />

{#if data.puzzles.length === 0}
	<p>You haven't uploaded any puzzles yet! Head over to <a href={resolve("/construct")}>Construct page</a> to build your repertoire!</p>
{:else if puzzleIndex === data.puzzles.length}
	<p>That was your last puzzle! Refresh the page to start over.</p>
{:else}
	<ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle!} nextPuzzleFoo={nextPuzzle} --chessgroundSize={chessGroundSize}/>
{/if}

