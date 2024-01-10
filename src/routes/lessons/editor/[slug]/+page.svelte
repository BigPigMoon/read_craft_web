<script lang="ts">
	import { page } from '$app/stores';
	import api from '$lib/http';
	import { onMount } from 'svelte';

	import snarkdown from 'snarkdown';
	import LoadIcon from '$lib/Icons/LoadIcon.svelte';
	import type { Lesson } from '$lib/types/lesson';

	const lessonId = $page.params.slug;

	let lessonText: string | undefined;
	let lesson: Lesson;

	onMount(async () => {
		try {
			lesson = (await api.get(`/api/lesson/get/${lessonId}`)).data;
			lessonText = (await api.get(`/api/lesson/text/${lessonId}`)).data;
		} catch (err) {
			console.error(err);
		}
	});

	const handleKeyDown = (event: any) => {
		if (event.ctrlKey && event.key === 's') {
			event.preventDefault();
			saveText(); // Здесь вызывайте вашу функцию сохранения
		}
	};

	const saveText = async () => {
		await api.post(`api/lesson/upload/${lessonId}`, lessonText);
	};
</script>

<div class="grid grid-cols-2 grid-rows-1 h-5/6 w-full gap-16">
	<textarea
		bind:value={lessonText}
		on:keydown={handleKeyDown}
		class="resize-none textarea textarea-bordered h-full w-full"
	/>
	<div class="prose w-full min-w-full prose-headings:m-0 overflow-auto">
		{#if lesson}
			<h1 class="text-center">{lesson.title}</h1>

			<div class="flex justify-center my-0">
				<img src={lesson.cover_path} alt="" />
			</div>
		{/if}
		{@html snarkdown(lessonText || '')}
	</div>
	<!-- <iframe srcdoc={snarkdown(lessonText || '')} title="title" class="w-full h-full" /> -->
</div>
<button class="btn w-full btn-primary m-8" on:click={saveText}><LoadIcon /> Сохранить</button>
