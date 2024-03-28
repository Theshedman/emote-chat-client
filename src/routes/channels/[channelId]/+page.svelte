<svelte:head>
	<title>Emote:Chat</title>
</svelte:head>

<script>
	import Channel from '$lib/Channel.svelte';
	import ChatHeader from '$lib/ChatHeader.svelte';
	import Chat from '$lib/Chat.svelte';
	import userStore from '$lib/stores/userStore';
	import contactStore from '$lib/stores/contactStore';
	import { formatDistanceToNow } from 'date-fns';
	import { chatServerWebsocketBaseURL } from '$lib/config';
	import ContactHeader from '$lib/ContactHeader.svelte';
	import ChatInput from '$lib/ChatInput.svelte';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let newMessage = '';
	let messages = []
	let socket;

	$: {
		data = { ...data, contacts: $contactStore };
		messages = [...data.activeContactMessages]
	}

	onMount(() => {
		socket = new WebSocket(`wss://${chatServerWebsocketBaseURL}/chat?auth=` + $userStore?.token);

		socket.addEventListener('open', () => {
			console.log('Opened');
		});

		socket.addEventListener('message', (event) => {
			const message = JSON.parse(event.data); // Assuming server sends JSON data

			messages = [...messages, message]; // Add new message to the array
		});

		socket.addEventListener('error', (error) => {
			console.log('Error occurred: ', error);
		});
	});
</script>

<div class="flex h-screen overflow-hidden">
	<!-- Sidebar -->
	<div class="w-1/4 bg-white border-r border-gray-300">
		<!-- Sidebar Header -->
		<ContactHeader />

		<!-- Contact/Channel List -->
		<div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
			{#if data?.contacts?.length > 0}
				{#each data.contacts as contact (contact?.id)}
					<Channel
						channelId={contact?.id}
						roomName={contact?.name}
						lastMessage="Open to chat" />
				{/each}
			{/if}
		</div>
	</div>

	<!-- Main Chat Area -->
	<div class="flex-1">
		<!-- Chat Header -->
		<ChatHeader name={data?.activeContact?.name} />

		<!-- Chat Messages -->
		<div class="h-screen overflow-y-auto p-4 pb-36">
			{#each messages as message (message.id)}
				<Chat
					username={$userStore?.data?.username}
					message={message?.content}
					sender={message?.username}
					timestamp={
						formatDistanceToNow(message?.timestamp, {
							addSuffix: true
						})
				}
				/>
			{/each}
		</div>

		<!-- Chat Input -->
		<footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
			<ChatInput
				socket={socket}
				status="enabled"
				channelId={data.channelId}
			/>
		</footer>
	</div>
</div>
