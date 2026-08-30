import { redirect } from "@sveltejs/kit";
import {
  getPuzzles,
  deletePuzzle,
  STATUS,
} from "../../utils/controllers/BackendController";
import type { PageServerLoad } from "./$types";
import { resolve } from "$app/paths";
import { CHESSBOARD_SIZE, DEMO_PUZZLES } from "../../utils/constants";

export const load: PageServerLoad = async (event) => {
  if (
    event.url.searchParams.get("delete") !== null &&
    event.url.searchParams.get("puzzle_id") !== null
  ) {
    const response = await deletePuzzle(
      event.cookies.get("token")!,
      event.url.searchParams.get("puzzle_id")!,
    );
    if (response.status === STATUS.OK) {
      console.info("redirect");
      throw redirect(STATUS.SEE_OTHER, resolve("/train"));
    } else {
      console.info(`another status: ${response.status}`);
      throw redirect(STATUS.SEE_OTHER, resolve("/train"));
    }

    // TODO: feedback in GUI
  }
  return {
    puzzles: event.locals.token
      ? (await getPuzzles(event.locals.token!)) || DEMO_PUZZLES
      : DEMO_PUZZLES,
    signed_in: (event.cookies.get("token") || "").length !== 0,
    chessgroundSize: event.cookies.get("chessgroundSize") || CHESSBOARD_SIZE,
  };
};
