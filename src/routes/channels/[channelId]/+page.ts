import { goto } from '$app/navigation';
import { chatServerHttpBaseURL } from '$lib/config';
import { getContactsAndStoreThem } from '$lib/channel';
import { type Contact } from '$lib/stores/contactStore';
import userStore, { type User } from '$lib/stores/userStore';

export async function load({ fetch, params }) {
	let msgResponse
	let contacts: Contact[] = [];
	let activeContactResponse

	if (userStore) {
		let user: User|null;
		const unsubscribedUsers = userStore?.subscribe(value => user = value);

		msgResponse = await fetch(`${chatServerHttpBaseURL}/messages?roomId=${params.channelId}&limit=100`, {
			headers: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				Authorization: `Bearer ${user?.token}`
			}
		});

		if (msgResponse?.status === 401) {
			await goto("/login")
		}

		activeContactResponse = await fetch(`${chatServerHttpBaseURL}/rooms/${params.channelId}`, {
			headers: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				Authorization: `Bearer ${user?.token}`
			}
		})

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (user) {
			contacts = await getContactsAndStoreThem(user.data.id, user.token, fetch);
		}

		unsubscribedUsers()
	}

	const messages = await msgResponse?.json()
	const activeContact = await activeContactResponse?.json()


	return {
		activeContact: activeContact ? activeContact?.data : null,
		activeContactMessages: messages?.data || [],
		channelId: params.channelId,
		contacts
	}
}
