<script lang="ts">
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";

	let puzzle = $state(new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["e4", "c5", "Nf3"]));

	function nextPuzzle() {
		puzzle = new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["e4", "c5", "Nh3"]);
		console.debug("next puzzle");
	}

	let chessGroundSize = "512px";
</script>

<br /><br />

<ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle} nextPuzzleFoo={nextPuzzle} --chessgroundSize={chessGroundSize}/>
