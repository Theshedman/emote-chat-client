<svelte:head>
	<title>Emote:Channel</title>
</svelte:head>

<script>
	import Channel from '$lib/Channel.svelte';
	import ChatHeader from '$lib/ChatHeader.svelte';
	import ChatInput from '$lib/ChatInput.svelte';
	import ContactHeader from '$lib/ContactHeader.svelte';
	import contactStore from '$lib/stores/contactStore';

	let contacts = []

	$: {
		contacts = $contactStore
	}
</script>

<div class="flex h-screen overflow-hidden">
	<!-- Sidebar -->
	<div class="w-1/4 bg-white border-r border-gray-300">
		<ContactHeader />

		<!-- Contact/Channel List -->
		<div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
			{#each contacts as contact (contact.id)}
				<Channel
					channelId={contact?.id}
					roomName={contact?.name}
					lastMessage="Open to chat" />
			{/each}
		</div>
	</div>

	<!-- Main Chat Area -->
	<div class="flex-1">
		<!-- Chat Header -->
		<ChatHeader name="Select a contact" />

		<!-- Chat Messages -->
		<div class="h-screen overflow-y-auto p-4 pb-36">

		</div>

		<!-- Chat Input -->
		<footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
			<ChatInput
				socket={()=> {}}
				status="disabled"
				channelId=""
			/>
		</footer>
	</div>
</div>
