import { writable } from 'svelte/store';

export type User = {
	data: {
		firstName: string,
		lastName: string,
		username: string
	},
	token: string
}

function createUserStore() {
	if (typeof window !== 'undefined') {
		// Only create the store if running in the browser environment
		const storedUser = localStorage.getItem('user');
		const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;
		const { subscribe, set, update } = writable(initialUser);

		return {
			subscribe,
			setUser: (user) => {
				localStorage.setItem('user', JSON.stringify(user));
				set(user);
			},
			updateUser: (user) => {
				localStorage.setItem('user', JSON.stringify(user));
				update(val => val = user)
			},
			clearUser: () => {
				localStorage.removeItem('user');
				set(null);
			}
		};
	}
}

const userStore = createUserStore();

export default userStore;
