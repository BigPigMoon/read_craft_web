<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import api from '$lib/http';
	import { onMount } from 'svelte';

	const inviteCode = $page.params.slug;

	onMount(async () => {
		try {
			await api.post(`api/course/subscribe/${inviteCode}`);
		} catch (err) {
			console.error(err);
		} finally {
			goto('/courses');
		}
	});
</script>
