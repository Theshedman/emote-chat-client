import contactStore from '$lib/stores/contactStore';
import userStore from '$lib/stores/userStore';
import { chatServerHttpBaseURL } from '$lib/config';
import { goto } from '$app/navigation';

export async function load({ fetch, params }) {

	let msgResponse
	let contactResponse
	let activeContactResponse

	if (userStore) {
		let user;
		const unsubscribedUsers = userStore.subscribe(value => user = value);

		msgResponse = await fetch(`${chatServerHttpBaseURL}/messages?roomId=${params.channelId}&limit=100`, {
			headers: {
				Authorization: `Bearer ${user?.token}`
			}
		});

		if (msgResponse?.status >= 400) {
			await goto("/login")
		}

		activeContactResponse = await fetch(`${chatServerHttpBaseURL}/rooms/${params.channelId}`, {
			headers: {
				Authorization: `Bearer ${user?.token}`
			}
		})

		contactResponse = await fetch(`${chatServerHttpBaseURL}/rooms`, {
			headers: {
				Authorization: `Bearer ${user?.token}`
			}
		})
	}

	const messages = await msgResponse?.json()
	const contacts = await contactResponse?.json()
	const activeContact = await activeContactResponse?.json()

	contactStore.setContact(contacts?.data);

	return {
		activeContact: activeContact ? activeContact?.data : null,
		activeContactMessages: messages?.data || [],
		channelId: params.channelId,
		contacts: contacts?.data || []
	}
}
