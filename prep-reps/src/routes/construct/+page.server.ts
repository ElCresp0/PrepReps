import { fail } from "@sveltejs/kit";
import {
  getPuzzles,
  postPuzzle,
} from "../../utils/controllers/BackendController";
import type { Actions, PageServerLoad } from "./$types";
import { signOutOnError } from "$lib";
import { CHESSBOARD_SIZE, DEMO_PUZZLES } from "../../utils/constants";

enum STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NOT_MODIFIED = 304,
  FOUND = 302,
}

export const load: PageServerLoad = async (event) => {
  return {
    puzzles: event.locals.token
      ? (await getPuzzles(event.locals.token!)) || DEMO_PUZZLES
      : DEMO_PUZZLES,
    chessgroundSize: event.cookies.get("chessgroundSize") || CHESSBOARD_SIZE,
  };
};

export const actions = {
  postPuzzle: async ({ cookies, request, locals }) => {
    const data = await request.formData();

    if (!data.get("title") || !data.get("pgn")) {
      return fail(
        STATUS.NOT_MODIFIED,
        {error: "Missing title or pgn"}
      );
    }

    if (!locals.token) {
      return fail(
        STATUS.NOT_MODIFIED,
        {error: "You must sign in to upload your puzzles"}
      );
    }

    const response = await postPuzzle(
      {
        title: data.get("title")!.toString(),
        pgn: data.get("pgn")!.toString(),
      },
      locals.token!,
    );

    if (response === undefined) {
      signOutOnError(cookies, "Server error occurred during sign up call");
      return fail(
        STATUS.NOT_MODIFIED,
        {error: "Server error occurred during sign up call"}
      );
    }

    const responseJson = await response.json();

    console.debug("responseJson:", responseJson);

    // If there was an error, return an invalid response
    if (response.status !== STATUS.CREATED) {
      const error =
        responseJson.error ??
        responseJson.message ??
        "Failed to post puzzle: unknown error";
      return fail(
        STATUS.NOT_MODIFIED,
        {error: error}
      );
    }

    // Redirect to the login page
    // throw redirect(STATUS.FOUND, "/construct");
    return {
      message: `successfully uploaded: ${data.get("title")}`,
      success: true,
    };
  },
} satisfies Actions;
