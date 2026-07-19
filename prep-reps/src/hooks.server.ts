import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    console.debug("hook triggered");
	event.locals.token = event.cookies.get('token') || null;
	event.locals.username = event.cookies.get('username') || null;
	event.locals.login_message = event.cookies.get('login_message') || null;
	
	// remove login_message on page reload
	event.cookies.set('login_message', '', { path: '/' });
	return resolve(event);
};