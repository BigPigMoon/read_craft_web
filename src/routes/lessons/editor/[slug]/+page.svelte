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

	let newTitle: string;
	let newSubject: string | undefined;

	onMount(async () => {
		try {
			lesson = (await api.get(`/api/lesson/get/${lessonId}`)).data;
			newTitle = lesson.title;
			newSubject = lesson.subject;
			lessonText = (await api.get(`/api/lesson/text/${lessonId}`)).data;
		} catch (err) {
			console.error(err);
		}
	});

	const handleKeyDown = (event: any) => {
		if ((event.ctrlKey && event.key === 's') || event.key === 'ы') {
			event.preventDefault();
			saveText(); // Здесь вызывайте вашу функцию сохранения
		}
	};

	const saveChanges = async () => {
		console.log(newSubject);

		try {
			await api.put('/api/lesson/update', {
				id: parseInt(lessonId),
				title: newTitle,
				cover_path: lesson.cover_path,
				subject: newSubject
			});

			(lesson.title = newTitle), (lesson.subject = newSubject);
		} catch (err) {
			console.error(err);
		}
	};

	const saveText = async () => {
		await api.post(`api/lesson/upload/${lessonId}`, lessonText);

		await saveChanges();

		alert('Изменения сохранены!');
	};
</script>

<div class="flex flex-row space-x-4 mb-4">
	<input class="input input-bordered font-bold text-lg max-w-fit" bind:value={newTitle} />
	<textarea class="textarea textarea-bordered resize-none w-full" bind:value={newSubject} />
</div>

<div class="grid grid-cols-2 grid-rows-1 w-full gap-16 h-[calc(100vh-224px)]">
	<div class="h-full flex flex-col space-y-2">
		<textarea
			class="resize-none textarea textarea-bordered w-full h-full"
			bind:value={lessonText}
			on:keydown={handleKeyDown}
		/>
		<button class="btn w-full btn-primary" on:click={saveText}><LoadIcon /> Сохранить</button>
	</div>
	<div class="prose w-full min-w-full h-full prose-headings:m-0 overflow-y-scroll">
		{#if lesson}
			<div class="flex flex-col justify-center my-0 items-center">
				<h1 class="">{newTitle}</h1>
				<figure>
					<img src={lesson.cover_path} alt="" />
				</figure>
			</div>
		{/if}
		{@html snarkdown(lessonText || '')}
	</div>
</div>
