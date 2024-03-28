<script>
	import { goto } from '$app/navigation';
	import userStore from '$lib/stores/userStore';
	import { chatServerHttpBaseURL } from '$lib/config';

	let firstName = ''
	let lastName = ''
	let username = ''
	let password = ''
	let currentError = null;

	const signup = () => {
		fetch(`${chatServerHttpBaseURL}/auth/signup`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				firstName,
				lastName,
				username,
				password
			})
		})
			.then(res => {
				if (res.status < 299) return res.json()

				currentError = "Something went wrong"
			})
			.then(data => {
				if (data) userStore.setUser(data)

				goto("/channels")
			})
			.catch(error => {
				currentError = error

				console.log("Error logging in: ", error);
			})
	}
</script>

<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="/logo.jpeg"
			alt="Emote logo"
		/>
		<h2 class="mt-3.5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Create an account
		</h2>
	</div>

	<div class="mt-3.5 sm:mx-auto sm:w-full sm:max-w-sm">
		<form on:submit|preventDefault={signup} class="space-y-4" action="#">
			<div>
				<label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">
					First Name
				</label>
				<div class="mt-1.5">
					<input
						bind:value={firstName}
						id="firstName"
						name="firstName"
						type="text"
						autoComplete="firstName"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">
					Last Name
				</label>
				<div class="mt-1.5">
					<input
						bind:value={lastName}
						id="lastName"
						name="lastName"
						type="text"
						autoComplete="lastName"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="username" class="block text-sm font-medium leading-6 text-gray-900">
					Username
				</label>
				<div class="mt-1.5">
					<input
						bind:value={username}
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900">
						Password
					</label>
				</div>
				<div class="mt-1.5">
					<input
						bind:value={password}
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Sign up
				</button>
			</div>
		</form>

		<p class="mt-3.5 text-center text-sm text-gray-500">
			Not a member?{' '}
			<a
				href="/"
				class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
				type="button">
				Sign in
			</a>
		</p>
	</div>
</div>
