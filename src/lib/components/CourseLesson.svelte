<script lang="ts">
	export let id: number;
	export let title: string;
	export let imageUrl: string | undefined;
	export let description: string | undefined | null;
</script>

<div class="carousel-item">
	<div class="card w-72 bg-neutral">
		<figure>
			<img src={imageUrl} alt="" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			<p>{@html description?.replace(/\n/g, '<br>') || ''}</p>
			<div class="card-actions justify-end">
				<a href={`/lessons/reader/${id}`} class="btn btn-primary">Читать</a>
			</div>
		</div>
	</div>
</div>
