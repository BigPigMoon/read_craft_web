<script lang="ts">
	import { goto } from '$app/navigation';
	import { clearTokens } from '$lib/store/tokens';

	const handleLogoutButton = () => {
		clearTokens();
		goto('/signin');
	};
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<button class="btn" on:click={handleLogoutButton}>Logout</button>
