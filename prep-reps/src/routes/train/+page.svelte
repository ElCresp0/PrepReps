<script lang="ts">
	import ChessgroundPuzzle from "../../components/ChessgroundPuzzle.svelte";
	import { Puzzle } from "../../utils/Puzzle";

	let puzzle = $state(new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["e4", "c5", "Nf3"]));
</script>

<h1>This is a chessboard</h1>

<ChessgroundPuzzle board="blue" pieces="merida" puzzle={puzzle}/>
