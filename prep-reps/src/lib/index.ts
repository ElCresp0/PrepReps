import type { Cookies } from "@sveltejs/kit";

export function signOutOnError(
  cookies: Cookies,
  errorMessage: string = "Unknown error occured",
) {
  cookies.delete("username", { path: "/" });
  cookies.delete("token", { path: "/" });
  cookies.set("login_message", errorMessage, { path: "/" });
}
