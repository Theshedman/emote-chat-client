import { writable } from 'svelte/store';
import type { ChatMessage } from '../chat';
import type { Contact } from './contactStore';

export type ChatHistory = {
	activeContact: Contact;
	activeMessages: ChatMessage[];
}


function createChatHistoryStore() {
	const { subscribe, set, update } = writable<ChatHistory | null>(null);

	return {
		subscribe,
		setChatHistory: (chatHistory: ChatHistory) => {
			set(chatHistory);
		},
		updateChatHistory: (chatHistory: ChatHistory|null) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			update(val => val = chatHistory);
		},
		clearChatHistory: () => {
			set(null);
		}
	};
}

const chatHistoryStore = createChatHistoryStore();

export default chatHistoryStore;

