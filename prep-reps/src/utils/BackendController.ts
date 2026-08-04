import {
  PUBLIC_BACKEND_HOST as BACKEND_HOST,
  PUBLIC_BACKEND_PORT as BACKEND_PORT,
} from "$env/static/public";


export enum STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NOT_MODIFIED = 304,
  FOUND = 302,
  SEE_OTHER = 303
}

export async function createUser(credentials: {
  name: string;
  password: string;
}): Promise<Response | undefined> {
  try {
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
  } catch (error) {
    console.debug(
      "The following error occured during signup fetch call:",
      error,
    );
    return undefined;
  }
}

export async function signIn(credentials: {
  name: string;
  password: string;
}): Promise<Response | undefined> {
  try {
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
  } catch (error) {
    console.debug(
      "The following error occured during signIn fetch call:",
      error,
    );
    return undefined;
  }
}

export async function postPuzzle(
  puzzle: { title: string; pgn: string },
  token: string,
): Promise<Response | undefined> {
  try {
    const response = await fetch(
      `http://${BACKEND_HOST}:${BACKEND_PORT}/puzzles`,
      {
        method: "POST",
        headers: [
          ["Content-Type", "application/json"],
          ["charset", "UTF-8"],
          ["Authorization", `Bearer ${token}`],
        ],
        body: JSON.stringify(puzzle),
      },
    );
    return response;
  } catch (error) {
    console.debug(
      "The following error occured during postPuzzle fetch call:",
      error,
    );
    return undefined;
  }
}

export async function getPuzzles(
  token: string,
): Promise<{ title: string; pgn: string }[] | undefined> {
  try {
    const response = await fetch(
      `http://${BACKEND_HOST}:${BACKEND_PORT}/puzzles`,
      {
        method: "GET",
        headers: [
          ["Content-Type", "application/json"],
          ["charset", "UTF-8"],
          ["Authorization", `Bearer ${token}`],
        ],
      },
    );
    const responseJson = await response.json();
    console.debug(responseJson);
    return responseJson["puzzles"];
  } catch (error) {
    console.debug(
      "The following error occured during getPuzzles fetch call:",
      error,
    );
    return undefined;
  }
}

export async function deletePuzzle(token: string, title: string): Promise<Response> {
    const response = await fetch(
      // TODO: check title for unexpected characters
      `http://${BACKEND_HOST}:${BACKEND_PORT}/puzzles/${title}`,
      {
        method: "DELETE",
        headers: [
          ["Content-Type", "application/json"],
          ["charset", "UTF-8"],
          ["Authorization", `Bearer ${token}`],
        ]
      },
    );

    return response;
}