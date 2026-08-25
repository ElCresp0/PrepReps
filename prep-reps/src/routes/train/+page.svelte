<script lang="ts">
	import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";
    import { goto } from "$app/navigation";
    import PuzzleList from "../../components/PuzzleList.svelte";


	let { data }: PageProps = $props();

	let puzzleIndex = $state(0);
	let puzzle = $derived((data.puzzles.length > puzzleIndex) ? Puzzle.deserialize(data.puzzles[puzzleIndex]) : null);
	let chessgroundSize = $derived(data.chessgroundSize);
    let sideComponentsNb = 2;

	function nextPuzzle() {
		puzzleIndex++;
		console.debug("next puzzle");
	}

    function deletePuzzle() {
        goto(resolve(puzzle ? `/train?delete=1&puzzle_id=${puzzle.id}` : '/train'));
        nextPuzzle();
    }

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

    let puzzles = $derived(data.puzzles.map(p => Puzzle.deserialize(p)));

</script>

{#if data.puzzles.length === 0}
	<p>You haven't uploaded any puzzles yet! Head over to <a href={resolve("/construct")}>Construct page</a> to build your repertoire!</p>
{:else if puzzleIndex === data.puzzles.length}
	<p>That was your last puzzle! Refresh the page to start over.</p>
{:else}
    <h2>{puzzle?.title}</h2>
    <div id="chessground-wrapper" style="--chessgroundSize:{chessgroundSize}; --sideComponentsNb:{sideComponentsNb};">
        <div class="chessground-puzzle-horizontal-box side-component">
            <PuzzleList puzzles={puzzles} currentPuzzleId={puzzle!.id}/>
        </div>
        <ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle!} buttonDefs={chessgroundButtons} />
    </div>
{/if}
