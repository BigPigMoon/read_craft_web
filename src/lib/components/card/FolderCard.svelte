<script lang="ts">
	import FolderIcon from '$lib/Icons/FolderIcon.svelte';
	import api from '$lib/http';
	import { createEventDispatcher } from 'svelte';

	export let id: number;
	export let title: string;

	const dispatch = createEventDispatcher();

	const handleDragStart = (event: DragEvent) => {
		event.dataTransfer?.setData(
			'text/plain',
			JSON.stringify({
				id: id,
				title,
				type: 'folder'
			})
		);
	};

	const moveItemHere = async (event: DragEvent) => {
		event.preventDefault();

		const data = event.dataTransfer?.getData('text/plain');

		if (data === undefined) return;

		const item = JSON.parse(data);

		if (item.type === 'card') {
			await api.put('/api/card/update', {
				id: item.id,
				word: item.word,
				translation: item.translation,
				group_id: id
			});

			dispatch('removeItem', { id: item.id, type: 'card' });
		} else if (item.type === 'folder') {
			if (id === item.id) return;

			await api.put('/api/group/update', {
				id: item.id,
				title: item.title,
				group_id: id
			});

			dispatch('removeItem', { id: item.id, type: 'folder' });
		}
	};
</script>

<div
	class="flex flex-row items-center card bg-base-200 py-2 px-5 w-fit h-16 space-x-3 m-1"
	id="folder-{id.toString()}"
	draggable="true"
	on:dragstart={handleDragStart}
	role="dialog"
	on:drop={moveItemHere}
	ondragover="return false"
>
	<div>
		<FolderIcon />
	</div>
	<div class="flex flex-col items-start">
		<span class="font-normal text-base-content">{title}</span>
	</div>
</div>
