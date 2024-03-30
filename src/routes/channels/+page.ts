import { getContactsAndStoreThem } from '$lib/channel';
import userStore, { type User } from '$lib/stores/userStore';

export const ssr = false;

export async function load({ fetch }) {
	let currentUser: User | null;
	const unsubscribeUser = userStore?.subscribe(val => currentUser = val);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	if (currentUser) {
		await getContactsAndStoreThem(currentUser.data.id, currentUser.token, fetch);
	}

	if (unsubscribeUser) unsubscribeUser();
}

