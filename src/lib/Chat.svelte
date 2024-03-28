<script>
	export let message = '';
	export let timestamp = '';
	export let sender = '';
	export let username = '';
</script>

{#if sender === username}
	<!-- Outgoing Message -->
	<div class="flex justify-end mb-4 cursor-pointer">
		<div class="flex-col">
			<div class="flex">
				<div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
					<p>{message}</p>
				</div>
				<div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
					<img src="/placeholder-user-pics.png" alt="My Avatar"
							 class="w-8 h-8 rounded-full">
				</div>
			</div>
			<span class=" block text-sm font-normal text-gray-500 dark:text-gray-400">{timestamp}</span>
		</div>
	</div>
{:else}
	<!-- Incoming Message -->
	<div class="flex mb-4 cursor-pointer">
		<div class="flex-col">
			<div class="flex">
				<div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
					<img src="/placeholder-user-pics.png" alt="User Avatar"
							 class="w-8 h-8 rounded-full">
				</div>
				<div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
					<p class="text-gray-700">{message}</p>
				</div>
			</div>
			<div class="flex justify-end">
				<span class="block text-sm font-normal text-gray-500 dark:text-gray-400">{timestamp}</span>
			</div>
		</div>
	</div>
{/if}
