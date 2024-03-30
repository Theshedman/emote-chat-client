import { goto } from '$app/navigation';
import { chatServerHttpBaseURL } from '$lib/config';
import { getContactsAndStoreThem } from '$lib/channel';
import { type Contact } from '$lib/stores/contactStore';
import userStore, { type User } from '$lib/stores/userStore';

export async function load({ fetch, params }) {
	let contacts: Contact[] = [];

	if (userStore) {
		let user: User|null;
		const unsubscribedUsers = userStore?.subscribe(value => user = value);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (user) {
			contacts = await getContactsAndStoreThem(user.data.id, user.token, fetch);
		}

		unsubscribedUsers()
	}


	return {
		channelId: params.channelId,
		contacts
	}
}
