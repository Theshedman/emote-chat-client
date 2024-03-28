import { writable } from 'svelte/store';

export type Channel = {
	id: string;
	name: string;
}

export type User = {
	data: {
		id: string;
		firstName: string;
		lastName: string;
		username: string;
	}
}

function createChatContact() {
		const { subscribe, set, update } = writable(null);

		return {
			subscribe,
			setContact: (contact) => {
				set(contact);
			},
			updateContact: (contact) => {
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
