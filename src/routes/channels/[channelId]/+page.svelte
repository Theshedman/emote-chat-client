<svelte:head>
	<title>Emote:Chat</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import Chat from '$lib/Chat.svelte';
	import Channel from '$lib/Channel.svelte';
	import type { ChatMessage } from '$lib/chat';
	import userStore from '$lib/stores/userStore';
	import ChatInput from '$lib/ChatInput.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import ChatHeader from '$lib/ChatHeader.svelte';
	import ContactHeader from '$lib/ContactHeader.svelte';
	import contactStore, { type Contact } from '$lib/stores/contactStore';
	import { chatServerWebsocketBaseURL, websocketProtocol } from '$lib/config';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data: {
		activeContact: Contact;
		contacts: Contact[];
		channelId: string ,
		activeContactMessages: ChatMessage[]
	};

	let messages: ChatMessage[] = []

	let socket: WebSocket;
	let reconnectAttempts = 0;
	const MAX_RECONNECT_ATTEMPTS = 6;
	const RECONNECT_INTERVAL = 3000; // 3 seconds

	$: {
		data = { ...data, contacts: $contactStore as Contact[] };
		messages = [...data.activeContactMessages]
	}

	onMount(() => {
		connectToWebsocket();

		return () => {
			// Cleanup on component unmount
			socket.close();
		};
	});

	function connectToWebsocket() {
		const url = `${websocketProtocol}://${chatServerWebsocketBaseURL}/chat?auth=${$userStore?.token}`;
		socket = new WebSocket(url);

		socket.addEventListener('open', () => {
			console.log('Websocket connection successful...');

			reconnectAttempts = 0; // Reset attempts on success
		});

		socket.addEventListener('message', event => {
			const message = JSON.parse(event.data); // Assuming server sends JSON data

			messages = [...messages, message]; // Add new message to the array
		});

		socket.addEventListener('error', () => {
			console.error('Websocket connection error occurred...');
		});

		socket.addEventListener('close', () => {
			console.log('WebSocket closed, attempting to reconnect...');

			scheduleReconnect();
		});
	}

	function scheduleReconnect() {
		if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
			setTimeout(() => {
				connectToWebsocket();
				reconnectAttempts++;
			}, RECONNECT_INTERVAL);
		} else {
			console.error('Maximum reconnect attempts reached for websocket');
			goto("/login")
			// (Optional) - Notify the user about the issue
		}
	}
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
						chatType={contact?.type}
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
