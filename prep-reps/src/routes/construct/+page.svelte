<script lang="ts">
    import ChessgroundAnalysis from "../../components/ChessgroundAnalysis.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

	let chessGroundSize = "512px";

</script>

<br /><br />

<ChessgroundAnalysis board="blue" pieces="merida" postPuzzleMessage={data.postPuzzleMessage} --chessgroundSize={chessGroundSize}/>