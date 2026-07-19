import{ PUBLIC_BACKEND_HOST as BACKEND_HOST, PUBLIC_BACKEND_PORT as BACKEND_PORT, PUBLIC_BACKEND_HOST } from "$env/static/public"
import { Puzzle } from "./Puzzle";


const TEST_PUZZLES = 	[
    new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["e4", "c5", "Nf3"]),
	new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["e4", "c5", "Nh3"])
];

export async function signIn(credentials: {name: string, password: string}): Promise<Response> {
    const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/auth/sign_in`, {
        method: "POST",
        headers: [['Content-Type', 'application/json'], ['charset', 'UTF-8']], // [["Content-Type", "application/x-www-urlencoded"]],
        body: JSON.stringify(credentials), // new URLSearchParams(data).toString()
    });
    return response;
}

export function getUsers() {
    let u = fetch(`${BACKEND_HOST}:${BACKEND_PORT}/users`)
        .then(d => d.text());
    console.debug(u);
}

export async function getPuzzles(): Promise<Puzzle[]> { // Puzzle[]
    return TEST_PUZZLES;
}