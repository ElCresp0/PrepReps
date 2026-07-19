import type { Transport } from '@sveltejs/kit';
import { Puzzle } from './utils/Puzzle';

export const transport: Transport = {
	Puzzle: {
		encode: (value) => value instanceof Puzzle && value.serialize(),
		decode: ({moves, fen}: {moves: string[], fen: string}) => new Puzzle(fen, moves)
	}
};