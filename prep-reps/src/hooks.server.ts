import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.token = event.cookies.get("token") || null;
  event.locals.username = event.cookies.get("username") || null;
  event.locals.login_message = event.cookies.get("login_message") || null;

  // remove form feedback messages on page reload
  event.cookies.delete("login_message", { path: "/" });
  return resolve(event);
};
