import {
  PUBLIC_BACKEND_HOST as BACKEND_HOST,
  PUBLIC_BACKEND_PORT as BACKEND_PORT,
} from "$env/static/public";
import { Puzzle } from "./Puzzle";

const TEST_PUZZLES = [
  new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [
    "e4",
    "c5",
    "Nf3",
  ]),
  new Puzzle("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [
    "e4",
    "c5",
    "Nh3",
  ]),
];

export async function createUser(credentials: {
  name: string;
  password: string;
}): Promise<Response> {
  // curl -X POST localhost:3000/auth/sign_up -H "Content-Type: application/json" -d '{"name": "qbxtest", "password": "password"}'
  const response = await fetch(
    `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/sign_up`,
    {
      method: "POST",
      // NOTE: both formats (x-www-urlencoded and json) require HTTPS to prevent eavesdropping
      // headers: [["Content-Type", "application/x-www-urlencoded"]],
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(credentials),
    },
  );
  return response;
}

export async function signIn(credentials: {
  name: string;
  password: string;
}): Promise<Response> {
  const response = await fetch(
    `http://${BACKEND_HOST}:${BACKEND_PORT}/auth/sign_in`,
    {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["charset", "UTF-8"],
      ],
      body: JSON.stringify(credentials),
    },
  );
  return response;
}

// export function getUsers() {
//   let u = fetch(`${BACKEND_HOST}:${BACKEND_PORT}/users`).then((d) => d.text());
//   console.debug(u);
// }

export async function getPuzzles(): Promise<Puzzle[]> {
  // Puzzle[]
  return TEST_PUZZLES;
}
