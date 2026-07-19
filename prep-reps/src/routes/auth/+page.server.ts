import { redirect, type Cookies } from '@sveltejs/kit'; // , type Actions
import { signIn } from '../../utils/BackendController';
import type { Actions, PageServerLoad } from './$types';


enum STATUS {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NOT_MODIFIED = 304,
    FOUND = 302
}

export const load: PageServerLoad = (event) => {
    console.info("page server load", event.url.searchParams);
    if (event.url.searchParams.get("signOut") !== null) {
        signOut(event.cookies);
    }

	return {
        token: event.locals.token,
		username: event.locals.username,
        login_message: event.locals.login_message
	};
};

export const actions = {
	signIn: async ({ cookies, request }) => {
        console.info("signIn action");
		const data = await request.formData();
        console.info("username", data.get('username'));

        if (!data.get("username") || !data.get("password")) {
            cookies.set('login_message', 'Missing username or password', { path: '/' });
            throw redirect(STATUS.NOT_MODIFIED, 'auth');
        }

        const response = await signIn({ name: data.get("username")!.toString(), password: data.get("password")!.toString() });
        const responseJson = await response.json();
        console.debug("response", responseJson);

        // If there was an error, return an invalid response
        if (response.status !== STATUS.ACCEPTED) {
            let login_message = responseJson.message ?? "Failed to sign in: unknown error";
            cookies.set('login_message', login_message, { path: '/' });
            throw redirect(STATUS.NOT_MODIFIED, 'auth');
        }

        cookies.set('token', responseJson["token"], { path: '/' });
        cookies.set('username', responseJson["user"]["name"], { path: '/' });

        // Redirect to the login page
        throw redirect(STATUS.FOUND, '/profile');

        // return { success: true };
	},
	signUp: async (event) => {
		// TODO register the user
	}
} satisfies Actions;

function signOut(cookies: Cookies) {
        console.info("signing out");
        cookies.set('token', '', { path: '/' });
        cookies.set('username', '', { path: '/' });
        cookies.set('login_message', 'Signed out.', { path: '/' });
        throw redirect(STATUS.FOUND, 'auth');
    }