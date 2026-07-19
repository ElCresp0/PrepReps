import { getPuzzles } from '../../utils/BackendController';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
        token: event.locals.token,
		username: event.locals.username,
        puzzles: (await getPuzzles()).map((puzzle) => {return puzzle.serialize()})
	};
};
