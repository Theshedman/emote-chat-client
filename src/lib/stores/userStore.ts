import { writable } from 'svelte/store';

export type User = {
	data: {
		id: string,
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
		const { subscribe, set, update } = writable<User|null>(initialUser);

		return {
			subscribe,
			setUser: (user: User) => {
				localStorage.setItem('user', JSON.stringify(user));
				set(user);
			},
			updateUser: (user: User) => {
				localStorage.setItem('user', JSON.stringify(user));
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
