<script lang="ts">
    import ChessgroundAnalysis from "../../components/ChessgroundAnalysis.svelte";
    import { Puzzle } from "../../utils/Puzzle";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

	let chessGroundSize = "512px";

</script>

<br /><br />

<center>
    <ChessgroundAnalysis board="blue" pieces="merida" postPuzzleMessage={data.postPuzzleMessage} puzzles={data.puzzles.map(p => Puzzle.deserialize(p))} --chessgroundSize={chessGroundSize}/>
</center>
