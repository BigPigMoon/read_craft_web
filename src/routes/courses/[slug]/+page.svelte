<script lang="ts">
	import PlusIcon from '$lib/Icons/PlusIcon.svelte';
	import CloseIcon from '$lib/Icons/CloseIcon.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Lesson } from '$lib/types/lesson';
	import api from '$lib/http';
	import EditLessonCard from '$lib/components/course/EditLessonCard.svelte';

	const courseId = $page.params.slug;

	let lessons: Lesson[] = [];
	let loading = false;

	onMount(async () => {
		loading = true;
		try {
			const res = await api.get<Lesson[]>(`/api/lesson/all?course=${courseId}`);

			lessons = res.data;
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	let createLessonTitle = '';
	let createLessonDesc = '';
	let createLessonCover =
		'https://sun9-53.userapi.com/impg/j9ucAouuIb4M0QCPW1j_U5tuT9fD-G2KOUOWmQ/l6JXJsGsc54.jpg?size=510x518&quality=96&sign=b86a49f053a93b42a66233e5dc39d8fc&type=album';

	const createLesson = async () => {
		if (createLessonError) return;

		const res = await api.post<number>('/api/lesson/create', {
			title: createLessonTitle,
			subject: createLessonDesc.length === 0 ? null : createLessonDesc,
			cover_path: createLessonCover, // FIXME: cover doesn't set by user
			course_id: Number.parseInt(courseId)
		});

		const newLesson: Lesson = {
			id: res.data,
			title: createLessonTitle,
			cover_path: createLessonCover,
			subject: createLessonDesc,
			course_id: Number.parseInt(courseId)
		};

		lessons.push(newLesson);
		lessons = lessons;

		// @ts-ignore
		document.getElementById('create_lesson')?.close();

		createLessonTitle = '';
		createLessonDesc = '';
	};

	const removeItem = (event: any) => {
		const id = event.detail;

		lessons = lessons.filter((item) => item.id !== id);
	};

	$: createLessonError = createLessonTitle.length === 0;
</script>

<div>
	<button
		class="btn btn-primary"
		on:click={() => {
			// @ts-ignore
			document.getElementById('create_lesson')?.showModal();
		}}
	>
		<PlusIcon /> Создать новый урок
	</button>
	<dialog id="create_lesson" class="modal">
		<div class="modal-box">
			<form method="dialog" class="mt-4">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
					<CloseIcon />
				</button>
				<div class="form-control w-full space-y-6">
					<div>
						<div class="label">
							<span class="label-text">Название урока</span>
						</div>
						<input
							type="text"
							placeholder="Название урока..."
							class="input input-bordered w-full"
							bind:value={createLessonTitle}
						/>
					</div>

					<div>
						<div class="label">
							<span class="label-text">Превью курса</span>
						</div>
						<input type="file" class="file-input file-input-bordered w-full max-w-xs" disabled />
					</div>

					<div>
						<div class="label">
							<span class="label-text">Описание урока</span>
						</div>
						<textarea
							class="textarea textarea-bordered w-full"
							placeholder="Описание урока"
							bind:value={createLessonDesc}
						/>
					</div>
					{#if createLessonError}
						<span class="label-text-alt text-error">Имя курса не указано</span>
					{/if}
				</div>
			</form>
			<button class="btn btn-primary mt-12 w-full" on:click={createLesson}> Создать </button>
		</div>
	</dialog>
</div>

{#if loading}
	<div class="h-64 w-full flex justify-center items-center">
		<span class="loading loading-spinner loading-md"></span>
	</div>
{:else}
	<div class="my-16 flex flex-col space-y-4">
		{#each lessons as lesson, index}
			<EditLessonCard
				title={lesson.title}
				id={lesson.id}
				index={index + 1}
				on:remove={removeItem}
			/>
		{/each}
	</div>
{/if}
