<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	export let name = '';
	export let toggleContacts: MouseEventHandler<HTMLButtonElement>;
</script>

<header class="bg-white p-4 text-gray-700 flex gap-x-6">
	<button class="md:hidden" on:click={toggleContacts}>
		<img class="w-10" src="/burger-menu.svg" alt="menu">
	</button>
	<h1 class="align-middle text-2xl font-semibold">{name}</h1>
</header>
