<script lang="ts">
	import { goto } from '$app/navigation';
	import { API_URL } from '$lib/http';
	import { setLastLesson } from '$lib/store/lesson';

	export let id: number;
	export let title: string;
	export let imageUrl: string | undefined;
	export let description: string | undefined | null;

	const readCourse = () => {
		setLastLesson(id);
		goto(`/lessons/reader/${id}`);
	};
</script>

<div class="carousel-item">
	<div class="card w-72 bg-neutral">
		<figure>
			<img class="w-full" src="{API_URL}/api/image/{imageUrl}" alt="" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			<p>{@html description?.replace(/\n/g, '<br>') || ''}</p>
			<div class="card-actions justify-end">
				<button on:click={readCourse} class="btn btn-primary">Читать</button>
			</div>
		</div>
	</div>
</div>
