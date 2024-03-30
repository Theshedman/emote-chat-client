import { writable } from 'svelte/store';

export type Channel = {
	id: string;
	name: string;
}

export type Contact = {
	id: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	type: 'private' | 'group';
	participants: string[];
}

function createChatContact() {
		const { subscribe, set, update } = writable<Contact[]|null>(null);

		return {
			subscribe,
			setContact: (contact: Contact[]) => {
				set(contact);
			},
			deleteContact: (contactId: string) => {
				update(val => {
					if (val) {
						return val.filter(v => v.id != contactId);
					}

					return val;
				})
			},
			updateContact: (contact: Contact[]) => {
				update(val => {
					if (val) {
						val = [...contact, ...val]
					} else {
						val = [...contact]
					}

					return val
				})
			},
			clearUser: () => {
				set(null);
			}
		};
}

const contactStore = createChatContact();

export default contactStore;
