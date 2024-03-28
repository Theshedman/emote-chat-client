<script>
import { goto } from '$app/navigation';
import contactStore from '$lib/stores/contactStore';

export let roomName = '';
export let lastMessage = '';
export let channelId = '';

let contacts = $contactStore

function activateChat() {
	goto(`/channels/${channelId}`)
}

function handleKeyboardEvent(event) {
	if (event.key === 'Enter' || event.code === 'Enter') {
		activateChat();
	}
}
</script>

<div role="button" tabindex=0 on:click={activateChat} on:keydown={handleKeyboardEvent} class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
	<div class="w-6 h-6 bg-gray-300 rounded-full mr-3">
		<img src="/channel-icon.png" alt="User Avatar" class="w-6 h-6 rounded-full">
	</div>
	<div class="flex-1">
		<h2 class="text-lg font-semibold">{roomName}</h2>
		<p class="text-gray-600">{lastMessage}</p>
	</div>
</div>
