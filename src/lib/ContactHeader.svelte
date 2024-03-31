<script lang="ts">
	import userStore from '$lib/stores/userStore';
	import { chatServerHttpBaseURL } from '$lib/config';
	import contactStore from '$lib/stores/contactStore';

	let newChannel = '';

	async function createNewChannel() {
		const channelRes = await fetch(`${chatServerHttpBaseURL}/rooms/group/join?name=${newChannel}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${$userStore?.token}`
			}
		});
		const registeredChannel = await channelRes.json();

		if (registeredChannel?.data) {
			const contacts = [registeredChannel.data];

			contactStore.updateContact(contacts)
		}

		newChannel = '';
	}

	function handleKeydownForChannel(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.code === 'Enter') {
			createNewChannel();
		}
	}

	let showDropdown = false;

	function disableDropdown() {
		showDropdown = false;
	}

	let inputElement: HTMLInputElement

	function activateDropdown() {
		inputElement?.focus();

		if (!showDropdown){
			showDropdown = true;
		} else {
			showDropdown = false;
		}
	}
</script>


<header class="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
	<h1 class="text-2xl font-semibold">Chat Web</h1>
	<div class="relative">
		<button on:click={activateDropdown}>
			<img class="w-10 text-white" src="/burger-menu.svg" alt="menu">
		</button>
		<!-- Menu Dropdown -->
		<div id="menuDropdown"
				 on:mouseleave={disableDropdown}
				 role="button"
				 tabindex="0"
				 class="absolute right-0 mt-2 md:w-52 sm:w-fit bg-white border border-gray-300 rounded-md shadow-lg {showDropdown ? '' : 'hidden'} "
		>
			<h2 class="text-center py-2 px-3 text-gray-900">Add channel</h2>
			<input
				bind:this={inputElement}
				type="text"
				placeholder="Enter a channel name"
				class="text-gray-500 block w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
				bind:value={newChannel}
				on:keydown={handleKeydownForChannel}
			>
		</div>
	</div>
</header>
