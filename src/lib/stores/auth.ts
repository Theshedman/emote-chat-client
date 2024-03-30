import userStore from './userStore';
import { goto } from '$app/navigation';
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);

export async function checkTokenExpiration() {
	let authUser;
	const unsubscribe = userStore?.subscribe(user => authUser = user);

	if (authUser) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (isTokenExpired(authUser?.token)) {
			// Token is expired, log the user out
			userStore?.clearUser()
			isAuthenticated.set(false);

			// ... optionally, redirect to login page
			await goto("/login")
		} else {
			isAuthenticated.set(true);
			// (Optional) Schedule the next expiration check
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			scheduleExpirationCheck(extractExpTimeFromToken(authUser?.token));
		}
	}

	if (unsubscribe) {
		unsubscribe();
	}
}

function extractExpTimeFromToken(token: string) {
	const payload = JSON.parse(atob(token.split('.')[1]));

	return payload.exp;
}

function isTokenExpired(token: string) {
	try {
		// Decode the payload (assuming JWT)
		const exp = extractExpTimeFromToken(token);

		// Extract expiration time and check against the current time
		return exp < Date.now() / 1000;
	} catch (error) {
		// Handle potential decoding errors
		console.error('Error decoding token:', error);
		return true; // Assume expired if decoding fails
	}
}

function scheduleExpirationCheck(expirationTime: number) {
	const now = Date.now();
	const delay = expirationTime - now; // Calculate time till expiration

	setTimeout(async () => {
		await checkTokenExpiration();
	}, delay);
}

checkTokenExpiration().then(() => {})
