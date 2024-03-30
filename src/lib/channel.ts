import { goto } from '$app/navigation';
import { chatServerHttpBaseURL } from './config';
import contactStore, { type Contact } from './stores/contactStore';
import type { ChatMessage } from './chat';
import type { ChatHistory } from './stores/chatHistories';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function getContactsAndStoreThem(currentUserId: string, authToken: string, fetch: Function): Promise<Contact[]> {

	const channelResponse = await fetch(`${chatServerHttpBaseURL}/rooms?limit=20`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});
	const userResponse = await fetch(`${chatServerHttpBaseURL}/users?limit=20`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});

	if (channelResponse.status == 401 || userResponse.status == 401) {
		await goto('/login');
	}

	const users = await userResponse.json();
	// Remove the currently logged-in user from the contact list
	const userContacts = users?.data?.filter((user: { id: string; }) => user?.id !== currentUserId);

	const channels = await channelResponse.json();

	const filteredContacts: {[k: string]: Contact} = {};
	const contacts: Contact[] = [...channels.data, ...userContacts];
	for (const contact of contacts) {
			contact.name = await getContactName(contact, currentUserId, authToken);

		const name = contact.name.toLowerCase();
		const filteredContact = filteredContacts[name];

		if (filteredContact) {
			if (!filteredContact?.type) {
				delete filteredContacts[name];

				filteredContacts[name] = contact
			}
		} else {
			filteredContacts[name] = contact;
		}
	}

	contactStore.setContact(Object.values(filteredContacts));

	return contacts;
}


export async function getContactName(contact: Contact, currentUserId: string, authToken: string): Promise<string> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	let otherUser: typeof User.data = null;
	let otherUserId = '';
	let contactName = '';
	switch (contact?.type) {
		case 'group':
			contactName = contact?.name as string;
			break;
		case 'private':
			otherUserId = contact.participants.find(memberId => memberId !== currentUserId) as string;

			otherUser = await findUserById(otherUserId, authToken);
			contactName = `${otherUser?.firstName} ${otherUser?.lastName}`;
			break;
		default:
			contactName = `${contact?.firstName} ${contact?.lastName}`;
			break;
	}

	return contactName;
}

async function findUserById(userId: string, authToken: string) {
	const userResponse = await fetch(`${chatServerHttpBaseURL}/users/${userId}`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});

	const userData = await userResponse.json();

	return userData.data;
}

export async function fetchActiveContactAndChatHistories(
	channelId: string, currentUserId: string, authToken: string
): Promise<ChatHistory> {

	const msgResponse = await fetch(`${chatServerHttpBaseURL}/messages?roomId=${channelId}&limit=100`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	});

	if (msgResponse?.status === 401) {
		await goto("/login")
	}

	const activeContactResponse = await fetch(`${chatServerHttpBaseURL}/rooms/${channelId}`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	})

	const messages = await msgResponse?.json()
	const activeContactData = await activeContactResponse?.json()
	const activeContact = activeContactData.data
	activeContact.name = await getContactName(activeContact, currentUserId, authToken);

	return {
		activeContact,
		activeMessages: messages?.data || []
	}
}
