<script lang="ts">
	import { page } from '$app/stores';
	import api, { API_URL } from '$lib/http';
	import { onMount } from 'svelte';

	import snarkdown from 'snarkdown';
	import type { Lesson } from '$lib/types/lesson';

	const lessonId = $page.params.slug;

	let lessonText: string | undefined;
	let lesson: Lesson;

	onMount(async () => {
		try {
			lesson = (await api.get(`/api/lesson/get/${lessonId}`)).data;
		} catch (err) {
			console.error(err);
		}
		try {
			lessonText = (await api.get(`/api/lesson/text/${lessonId}`)).data;
		} catch (err) {
			lessonText = 'В данный момент тут пусто :(';
			console.error(err);
		}
	});
</script>

<div class="mx-64 mb-16">
	<div class="prose w-full min-w-full prose-headings:m-0">
		{#if lesson}
			<h1 class="text-center">{lesson.title}</h1>

			<div class="flex justify-center my-0">
				<img class="w-fit" src="{API_URL}/api/image/{lesson.cover_path}" alt="" />
			</div>
		{/if}
		{@html snarkdown(lessonText || '')}
	</div>
</div>
<div class="p-8"></div>
