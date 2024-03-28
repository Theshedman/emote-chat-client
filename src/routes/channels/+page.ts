import { goto } from '$app/navigation';
import { chatServerHttpBaseURL } from '$lib/config';
import contactStore from '$lib/stores/contactStore';
import userStore, { type User } from '$lib/stores/userStore';

export const ssr = false

export async function load({ fetch }) {
	let user: User | null;
	const unsubscribed = userStore.subscribe(val => user = val);

	const channelResponse = await fetch(`${chatServerHttpBaseURL}/rooms`, {
		headers: {
			Authorization: `Bearer ${user?.token}`
		}
	});

	if (channelResponse.status >= 400) {
		await goto("/login")
	}

	const channels = await channelResponse.json();
	const contacts = [...channels.data]

	contactStore.setContact(contacts)

	unsubscribed();
}
