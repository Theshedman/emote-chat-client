<script lang="ts">
	import { goto } from '$app/navigation';
	import userStore from './stores/userStore';
	import { fetchActiveContactAndChatHistories, getContactName } from './channel';
	import { chatServerHttpBaseURL } from './config';
	import contactStore, { type Contact } from './stores/contactStore';
	import chatHistoryStore from './stores/chatHistories';

	export let roomName;
	export let channelId = '';
	export let lastMessage = '';
	export let chatType: 'private' | 'group';
	export let toggleContacts: Function;

	async function activateChat() {
		toggleContacts && toggleContacts();

		if (chatType !== 'private' && chatType !== 'group') {
			try {
				const response = await fetch(`${chatServerHttpBaseURL}/rooms/private/join?targetParticipant=${channelId}`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${$userStore?.token}`
					}
				});
				const privateGroupChat = await response.json();

				if (privateGroupChat?.data) {
					const newPrivateContact: Contact = privateGroupChat.data;
					newPrivateContact.name = await getContactName(newPrivateContact, $userStore?.data?.id as string, $userStore?.token as string);

					contactStore.deleteContact(channelId);
					contactStore.updateContact([newPrivateContact]);

					channelId = newPrivateContact.id;
				}
			} catch (e: unknown) {
				console.log('Unable to join private chat: ', e);
			}
		}

		const chatHistories = await fetchActiveContactAndChatHistories(
			channelId,
			$userStore?.data?.id as string,
			$userStore?.token as string
		);

		chatHistoryStore.setChatHistory(chatHistories);

		await goto(`/channels/${channelId}`);
	}

	function handleKeyboardEvent(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.code === 'Enter') {
			activateChat();
		}
	}
</script>

<div role="button" tabindex=0 on:click={activateChat} on:keydown={handleKeyboardEvent}
		 class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
	<div class="w-6 h-6 bg-gray-300 rounded-full mr-3">
		<img src="/channel-icon.png" alt="User Avatar" class="w-6 h-6 rounded-full">
	</div>
	<div class="flex-1">
		<h2 class="text-lg font-semibold">{roomName}</h2>
		<p class="text-gray-600">{lastMessage}</p>
	</div>
</div>
