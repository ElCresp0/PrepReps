import { redirect, type Cookies } from "@sveltejs/kit";
import { createUser, signIn } from "../../utils/BackendController";
import type { Actions, PageServerLoad } from "./$types";
import { signOutOnError } from "$lib";

enum STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NOT_MODIFIED = 304,
  FOUND = 302,
}

export const load: PageServerLoad = (event) => {
  if (event.url.searchParams.get("signOut") !== null) {
    signOut(event.cookies);
  }

  if (event.cookies.get("token")) {
    // Redirect to the profile page
    throw redirect(STATUS.FOUND, "/profile");
  }

  return {
    login_message: event.locals.login_message,
  };
};

export const actions = {
  signIn: async ({ cookies, request }) => {
    console.info("signIn action");
    const data = await request.formData();

    if (!data.get("username") || !data.get("password")) {
      cookies.set("login_message", "Missing username or password", {
        path: "/",
      });
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    const response = await signIn({
      name: data.get("username")!.toString(),
      password: data.get("password")!.toString(),
    });

    if (response === undefined) {
      signOutOnError(cookies, "Server error occured during sign in call");
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    const responseJson = await response.json();

    // If there was an error, return an invalid response
    if (response.status !== STATUS.ACCEPTED) {
      const login_message =
        responseJson.message ?? "Failed to sign in: unknown error";
      cookies.set("login_message", login_message, { path: "/" });
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    cookies.set("token", responseJson["token"], { path: "/" });
    cookies.set("username", responseJson["user"]["name"], { path: "/" });

    // Redirect to the login page
    throw redirect(STATUS.FOUND, "/profile");
  },
  signUp: async ({ cookies, request }) => {
    console.info("signUp action");
    const data = await request.formData();

    if (!data.get("username") || !data.get("password")) {
      cookies.set("login_message", "Missing username or password", {
        path: "/",
      });
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    const response = await createUser({
      name: data.get("username")!.toString(),
      password: data.get("password")!.toString(),
    });

    if (response === undefined) {
      signOutOnError(cookies, "Server error occured during sign up call");
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    const responseJson = await response.json();

    console.debug("responseJson:", responseJson);

    // If there was an error, return an invalid response
    if (response.status !== STATUS.CREATED) {
      const login_message =
        responseJson.message ?? "Failed to create user: unknown error";
      cookies.set("login_message", login_message, { path: "/" });
      throw redirect(STATUS.NOT_MODIFIED, "auth");
    }

    cookies.set("token", responseJson["token"], { path: "/" });
    cookies.set("username", responseJson["user"]["name"], { path: "/" });

    // Redirect to the login page
    throw redirect(STATUS.FOUND, "/profile");
  },
} satisfies Actions;

function signOut(cookies: Cookies) {
  console.info("signing out");
  cookies.set("token", "", { path: "/" });
  cookies.set("username", "", { path: "/" });
  cookies.set("login_message", "Signed out.", { path: "/" });
  throw redirect(STATUS.FOUND, "auth");
}
