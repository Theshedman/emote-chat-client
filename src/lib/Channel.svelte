<script lang="ts">
	import { goto } from '$app/navigation';
	import userStore from './stores/userStore';
	import { chatServerHttpBaseURL } from './config';
	import contactStore from './stores/contactStore';

	export let roomName;
	export let lastMessage = '';
	export let channelId = '';
	export let chatType: 'private' | 'group';

	async function activateChat() {
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
					contactStore.deleteContact(channelId);
					contactStore.updateContact([privateGroupChat.data]);

					channelId = privateGroupChat.data.id;
				}
			} catch (e: unknown) {
				console.log('Unable to join private chat: ', e);
			}
		}

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
