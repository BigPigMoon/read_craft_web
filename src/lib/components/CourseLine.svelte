<script lang="ts">
	import CopyIcon from '$lib/Icons/CopyIcon.svelte';
	import CourseLesson from './CourseLesson.svelte';
	import EditIcon from '$lib/Icons/EditIcon.svelte';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Lesson } from '$lib/types/lesson';
	import api from '$lib/http';
	import TrashIcon from '$lib/Icons/TrashIcon.svelte';

	export let courseTitle: string;
	export let author: boolean = false;
	export let courseId: number;

	let dispatch = createEventDispatcher();

	let lessons: Lesson[] = [];

	onMount(() => {
		api.get<Lesson[]>(`/api/lesson/all?course=${courseId}`).then((res) => {
			lessons = res.data;
		});
	});

	const handleEditButton = () => {
		goto(`/courses/${courseId}`);
	};

	const deleteCourse = () => {
		api.delete(`/api/course/delete/${courseId}`);

		dispatch('remove', courseId);
	};
</script>

<div class="w-full p-4 my-7 rounded-box">
	<div class="flex mb-6 justify-between">
		<h1 class="font-bold text-lg justify-start">{courseTitle}</h1>
		{#if author}
			<div class="flex space-x-4">
				<button class="btn btn-outline btn-primary" on:click={deleteCourse}
					><TrashIcon /> удалить</button
				>
				<button class="btn btn-secondary font-bold" on:click={handleEditButton}>
					<span>Редактировать</span>
					<EditIcon />
				</button>
				<div class="btn btn-secondary font-bold">
					<span>Ссылка</span>
					<CopyIcon />
				</div>
			</div>
		{/if}
	</div>
	<div class="carousel carousel-center w-full space-x-5">
		{#each lessons as lesson}
			<CourseLesson
				id={lesson.id}
				imageUrl={lesson.cover_path}
				title={lesson.title}
				description={lesson.subject}
			/>
		{/each}
	</div>
</div>
