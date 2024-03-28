<script>
	export let status = 'disabled';
	export let socket;
	export let channelId = ''

	let newMessage = '';

	function sendMessage() {
		// ... Send the new message to the server through the WebSocket
		const msg = { content: newMessage, roomId: channelId };

		socket.send(JSON.stringify(msg));

		newMessage = '';
	}

	function handleKeydownForChat(event) {
		if (event.key === 'Enter' || event.code === 'Enter') {
			sendMessage();
		}
	}
</script>

{#if status === 'enabled'}
	<div class="flex items-center">
		<input
			type="text"
			placeholder="Type a message..."
			class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
			bind:value={newMessage}
			on:keydown={handleKeydownForChat}
		>
		<button
			class="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
			on:click={sendMessage}
		>
			Send
		</button>
	</div>
{:else}
	<div class="flex items-center">
		<input
			type="text"
			disabled
			placeholder="Type a message..."
			class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
			bind:value={newMessage}
			on:keydown={handleKeydownForChat}
		>
		<button
			disabled
			class="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
			on:click={sendMessage}
		>
			Send
		</button>
	</div>
{/if}
