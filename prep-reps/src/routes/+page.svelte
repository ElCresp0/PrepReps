<script lang="ts">
	import { Chess, type Square, type Piece } from 'chess.js';
	import { Chessground, type Api } from 'svelte5-chessground';
	import 'svelte5-chessground/style.css';

	const chessgroundAPI = {} as Api;
	const chess = new Chess();
	var fen = chess.fen();

	function handleMove(_from: string, _to: string) {
		const from = <Square>_from;
		const to = <Square>_to;
		const piece = chess.get(from);
		const turn = chess.turn();

		const moves = chess.moves({ square: from });

		console.log(from, to, piece, turn);
		if (
			piece?.type === 'p' &&
			((turn === 'w' && from.charAt(from.length - 1) === '7') ||
				(turn === 'b' && from.charAt(from.length - 1) === '2'))
		) {
			console.log('promotion!');
			chessgroundAPI.cancelMove();
		}

		chess.move({ from: from, to: to });
		console.log('Move:', from, 'to', to);
	}

	function handlePredropSet(role: string, key: string) {}

	// Chessground(document.getElementById('chessboard'), {}, );
</script>

<div id="chessboard">
	<Chessground {fen} onMove={handleMove} api={chessgroundAPI} />
</div>

<style>
	#chessboard :global(.cg-wrap) {
		width: 512px;
		height: 512px;
	}
</style>
