<svelte:head>
	<title>Emote</title>
</svelte:head>

<script>
	import { goto } from '$app/navigation';
	import { checkTokenExpiration, isAuthenticated } from '$lib/stores/auth';


	function loadInitialPage() {
		if($isAuthenticated) {
			goto("/channels")
		} else {
			goto("/login")
		}
	}

	if (typeof window !== 'undefined') {
		loadInitialPage();
	}

	// Auto check for token expiration and redirect the user to login
	checkTokenExpiration()
</script>
