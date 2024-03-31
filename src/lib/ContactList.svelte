<script lang="ts">
	import Channel from '$lib/Channel.svelte';
import type { Contact } from './stores/contactStore';
	import ContactHeader from '$lib/ContactHeader.svelte';

export let contacts: Contact[];
export let showContacts = false;
export let toggleContacts: Function;
</script>

<div class="{showContacts ? '' : 'hidden'} absolute overflow-hidden h-full md:relative md:block w-2/4 md:w-1/4 bg-white border-r border-gray-300">
	<ContactHeader />

	<!-- Contact/Channel List -->
	<div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
		{#each contacts as contact (contact?.id)}
			<Channel
				{toggleContacts}
				chatType={contact?.type}
				channelId={contact?.id}
				roomName={contact?.name}
				lastMessage="Open to chat" />
		{/each}
	</div>
</div>
