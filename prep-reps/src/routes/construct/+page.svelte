<script lang="ts">
    import ChessgroundAnalysis from "../../components/ChessgroundAnalysis.svelte";
    import PuzzleList from "../../components/PuzzleList.svelte";
    import { Puzzle } from "../../utils/Puzzle";
    import type { PageProps } from "./$types";

    import "$lib/assets/Chessground/chessground.css";

    let { data }: PageProps = $props();

	let chessgroundSize = $derived(data.chessgroundSize);
    let sideComponentsNb = 2;
    let puzzles = $derived(data.puzzles.map(p => Puzzle.deserialize(p)));

</script>

<h2>Construct</h2>
<div id="chessground-wrapper" style="--chessgroundSize:{chessgroundSize}; --sideComponentsNb:{sideComponentsNb};">
    <div class="chessground-puzzle-horizontal-box side-component">
        <PuzzleList puzzles={puzzles}/>
    </div>

    <ChessgroundAnalysis board="blue" pieces="merida" postPuzzleMessage={data.postPuzzleMessage}/>

</div>
