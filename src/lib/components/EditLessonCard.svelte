<script lang="ts">
	import { goto } from '$app/navigation';
	import EditIcon from '$lib/Icons/EditIcon.svelte';
	import LoadIcon from '$lib/Icons/LoadIcon.svelte';
	import TrashIcon from '$lib/Icons/TrashIcon.svelte';
	import api from '$lib/http';
	import { createEventDispatcher } from 'svelte';

	export let id: number;
	export let title: string;
	export let cover: string | undefined | null;
	export let subject: string | null | undefined;

	let newTitle = title;
	let newSubject = subject;

	const dispatch = createEventDispatcher();

	const saveChanges = () => {
		api
			.put('/api/lesson/update', {
				id,
				title: newTitle,
				cover_path: cover,
				subject: newSubject
			})
			.then((res) => {
				(title = newTitle), (subject = newSubject);
			});
	};

	const editTextLesson = () => {
		goto(`/lessons/editor/${id}`);
	};

	const removeLesson = async () => {
		await api.delete(`/api/lesson/delete/${id}`);

		dispatch('remove', id);
	};

	$: showSaveButton = title !== newTitle || newSubject !== subject;
</script>

<div class="card card-side h-fit bg-neutral">
	<figure>
		<img class="object-cover w-full h-full" src={cover} alt="" />
	</figure>
	<div class="card-body">
		<div>
			<div class="label">
				<span class="label-text">Название урока</span>
			</div>
			<input class="input input-bordered w-full" bind:value={newTitle} />
		</div>
		<div>
			<div class="label">
				<span class="label-text">Описание урока</span>
			</div>
			<textarea bind:value={newSubject} class="textarea textarea-bordered h-52 w-full resize-none"
			></textarea>
		</div>
		<div class="flex flex-row">
			<button class="btn btn-primary btn-outline" on:click={removeLesson}
				><TrashIcon /> Удалить</button
			>
			<div class="flex justify-end w-full space-x-4">
				{#if showSaveButton}
					<button class="btn btn-primary" on:click={saveChanges}>Сохранить <LoadIcon /></button>
				{/if}
				<a class="btn btn-secondary" href={`/lessons/editor/${id}`}>
					Редактировать текст урока <EditIcon /></a
				>
			</div>
		</div>
	</div>
</div>
