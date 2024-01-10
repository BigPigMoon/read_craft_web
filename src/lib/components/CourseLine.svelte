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
	export let language: string;

	let dispatch = createEventDispatcher();

	let lessons: Lesson[] = [];

	onMount(() => {
		api.get<Lesson[]>(`/api/lesson/all?course=${courseId}`).then((res) => {
			lessons = res.data;
		});
	});

	const deleteCourse = () => {
		api.delete(`/api/course/delete/${courseId}`);

		dispatch('remove', courseId);
	};
</script>

<div class="w-full p-4 my-7 rounded-box">
	<div class="flex justify-between">
		<div>
			<h1 class="font-bold text-lg justify-start">{courseTitle}</h1>
			<span class="text-sm"><span class="font-bold">Язык курса:</span> {language}</span>
		</div>
		{#if author}
			<div class="flex space-x-4">
				<button class="btn btn-outline btn-primary" on:click={deleteCourse}
					><TrashIcon /> удалить</button
				>
				<a href={`/courses/${courseId}`} class="btn btn-secondary font-bold">
					<span>Редактировать</span>
					<EditIcon />
				</a>
				<div class="btn btn-secondary font-bold">
					<span>Ссылка</span>
					<CopyIcon />
				</div>
			</div>
		{/if}
	</div>
	<div class="carousel carousel-center w-full space-x-5 mt-3">
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
