import { redirect } from "@sveltejs/kit";
import {
  getPuzzles,
  postPuzzle,
} from "../../utils/controllers/BackendController";
import type { Actions, PageServerLoad } from "./$types";
import { signOutOnError } from "$lib";

enum STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NOT_MODIFIED = 304,
  FOUND = 302,
}

export const load: PageServerLoad = async (event) => {
  return {
    postPuzzleMessage: event.locals.postPuzzleMessage,
    puzzles: event.locals.token
      ? (await getPuzzles(event.locals.token!)) || []
      : [],
  };
};

export const actions = {
  postPuzzle: async ({ cookies, request, locals }) => {
    console.info("postPuzzle action");
    const data = await request.formData();

    if (!data.get("title") || !data.get("pgn")) {
      cookies.set("postPuzzleMessage", "Missing title or pgn", {
        path: "/",
      });
      throw redirect(STATUS.NOT_MODIFIED, "construct");
    }

    if (!locals.token) {
      cookies.set(
        "postPuzzleMessage",
        "You must sign in to upload your puzzles",
        {
          path: "/",
        },
      );
      throw redirect(STATUS.NOT_MODIFIED, "construct");
    }

    const response = await postPuzzle(
      {
        title: data.get("title")!.toString(),
        pgn: data.get("pgn")!.toString(),
      },
      locals.token!,
    );

    if (response === undefined) {
      signOutOnError(cookies, "Server error occured during sign up call");
      throw redirect(STATUS.NOT_MODIFIED, "construct");
    }

    const responseJson = await response.json();

    console.debug("responseJson:", responseJson);

    // If there was an error, return an invalid response
    if (response.status !== STATUS.CREATED) {
      const postPuzzleMessage =
        responseJson.error ??
        responseJson.message ??
        "Failed to post puzzle: unknown error";
      cookies.set("login_message", postPuzzleMessage, { path: "/" });
      throw redirect(STATUS.NOT_MODIFIED, "construct");
    }

    // Redirect to the login page
    throw redirect(STATUS.FOUND, "/construct");
  },
} satisfies Actions;
