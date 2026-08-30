<script lang="ts">
    import ChessgroundAnalysis from "../../components/ChessgroundAnalysis/ChessgroundAnalysis.svelte";
    import PuzzleList from "../../components/PuzzleList.svelte";
    import { Puzzle } from "../../utils/Puzzle";
    import type { PageProps } from "./$types";

    import "$lib/assets/Chessground/chessground.css";
    import { chessgroundAnalysisState as _state } from "../../components/ChessgroundAnalysis/state.svelte";
    import { onMount } from "svelte";

    let { data }: PageProps = $props();

	let chessgroundSize = $derived(data.chessgroundSize);
    let sideComponentsNb = 2;
    let puzzles = $derived(data.puzzles.map(p => Puzzle.deserialize(p)));

    let puzzleIndex = $derived(_state.puzzleIndex);

    onMount(() => {
        _state.puzzleIndex = puzzles.length;
    });

</script>

<h2>Construct{puzzleIndex < puzzles.length ? ` ${puzzles[puzzleIndex].title}` : ""}</h2>
<div id="chessground-wrapper" style="--chessgroundSize:{chessgroundSize}; --sideComponentsNb:{sideComponentsNb};">
    <div class="chessground-puzzle-horizontal-box side-component">
        <PuzzleList puzzles={puzzles} bind:selectedPuzzleIndex={_state.puzzleIndex}/>
    </div>

    <ChessgroundAnalysis board="blue" pieces="merida" postPuzzleMessage={data.postPuzzleMessage}/>

</div>
