<script lang="ts">
	import { resolve } from "$app/paths";
    import type { PageProps } from "./$types";
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";
    import { goto } from "$app/navigation";
    import PuzzleList from "../../components/PuzzleList.svelte";
    import { chessgroundPuzzleState as _state } from "../../components/ChessgroundPuzzle/state.svelte";
    import { NEW_PUZZLE_ID } from "../../utils/constants";


	let { data }: PageProps = $props();

	// let puzzleIndex = $state(0);
	let puzzle = $derived((data.puzzles.length > _state.puzzleIndex) ? Puzzle.deserialize(data.puzzles[_state.puzzleIndex]) : null);
	let chessgroundSize = $derived(data.chessgroundSize);
    let sideComponentsNb = 2;

	function nextPuzzle() {
		_state.puzzleIndex++;
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

    $effect(() => {
        _state.currentPuzzleId = data.puzzles.at(_state.puzzleIndex)?.id ?? NEW_PUZZLE_ID;
    });

</script>

<h2>{puzzle?.title}</h2>
<div id="chessground-wrapper" style="--chessgroundSize:{chessgroundSize}; --sideComponentsNb:{sideComponentsNb};">

{#if puzzles.length === 0}
	<p>You haven't uploaded any puzzles yet! Head over to <a href={resolve("/construct")}>Construct page</a> to build your repertoire!</p>
	
{:else if _state.puzzleIndex === puzzles.length}
    <p>
        That was your last puzzle!<br/>
        <a href={resolve("/train")} onclick={()=>{_state.puzzleIndex = 0;}}>Start over</a>    
    </p>
{/if}

<div class="chessground-puzzle-horizontal-box side-component">
    <PuzzleList puzzles={puzzles} bind:selectedPuzzleIndex={_state.puzzleIndex}/>
    <!-- puzzleState={_state} -->
</div>

{#if _state.puzzleIndex < puzzles.length}
    <ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle!} buttonDefs={chessgroundButtons} />
{/if}
</div>