<script lang="ts">
	import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";
    import ChessgroundControls from "../../components/ChessgroundControls.svelte";
    import { goto } from "$app/navigation";


	let { data }: PageProps = $props();

	let puzzleIndex = $state(0);
	let puzzle = $derived((data.puzzles.length > puzzleIndex) ? new Puzzle(data.puzzles[puzzleIndex].title, data.puzzles[puzzleIndex].pgn, data.puzzles[puzzleIndex].id) : null);
	let chessGroundSize = "512px";
	let move = $state(0);

	function nextPuzzle() {
		puzzleIndex++;
		console.debug("next puzzle");
	}

    function deletePuzzle() {
        goto(resolve(puzzle ? `/train?delete=1&puzzle_id=${puzzle.id}` : '/train'));
        nextPuzzle();
    }

	function firstMove() {
		move = 0;
	}

	function prevMove() {
		move = move <= 0 ? 0 : move - 1;
	}

	function nextMove() {
		if (puzzle !== null && move >= puzzle.moves.length) {
			move = puzzle.moves.length;
		}
		else {
			move++;
		}
	}

	function lastMove() {
		if (puzzle !== null) {
			move = puzzle.moves.length;
		}
	}

	let chessgroundButtons = $derived(
        data.signed_in ? [
            {onclick: firstMove, label: "<<"}, // &laquo;
            {onclick: prevMove, label: "<"}, //&#8249;
            {onclick: nextMove, label: ">"}, // &#8250;
            {onclick: lastMove, label: ">>"}, // &raquo;
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
            {onclick: firstMove, label: "<<"}, // &laquo;
            {onclick: prevMove, label: "<"}, //&#8249;
            {onclick: nextMove, label: ">"}, // &#8250;
            {onclick: lastMove, label: ">>"}, // &raquo;
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
	<ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle!} --chessgroundSize={chessGroundSize}/>
	<ChessgroundControls buttonDefs={chessgroundButtons} --chessgroundSize={chessGroundSize} --buttonsCount={chessgroundButtons.length}/>
{/if}

<!-- TODO: all puzzles view -->
<!-- TODO: interactive pgn view -->
