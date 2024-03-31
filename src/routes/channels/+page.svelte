<svelte:head>
	<title>Emote:Channel</title>
</svelte:head>

<script lang="ts">
	import ChatInput from '$lib/ChatInput.svelte';
	import ChatHeader from '$lib/ChatHeader.svelte';
	import contactStore, { type Contact } from '$lib/stores/contactStore';
	import ContactList from '$lib/ContactList.svelte';
	import Chat from '$lib/Chat.svelte';

	let contacts: Contact[] = [];

	$: {
		contacts = $contactStore as Contact[];
	}

	const voidSocket: WebSocket = {} as WebSocket;

	let showContacts = false;

	function toggleContacts() {
		showContacts = !showContacts;
	}
	function resetToggle() {
		showContacts = false;
	}
</script>

<div class="flex h-screen overflow-hidden">
	<!-- Sidebar -->
	<ContactList {contacts} {showContacts} {toggleContacts} />

	<!-- Main Chat Area -->
	<div class="flex-1">
		<!-- Chat Header -->
		<ChatHeader {toggleContacts} name="Select contact" />

		<!-- Chat Messages -->
		<div class="h-screen overflow-y-auto p-4 pb-36" on:keydown={resetToggle} on:click={resetToggle} role="button" tabindex=0>
			<Chat
				username=''
				message=''
				sender=''
				timestamp=''
			/>
		</div>

		<!-- Chat Input -->
		<footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-screen md:w-3/4">
			<ChatInput
				socket={voidSocket}
				status="disabled"
				channelId=""
			/>
		</footer>
	</div>
</div>
