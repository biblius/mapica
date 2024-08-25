<script lang="ts">
	import '../app.css';
	import Map from '$lib/components/Map.svelte';

	// All the stuff from +page.server.ts is brought
	// to here via this variable. It has to be called
	// `data`.
	export let data;
</script>

<header>
	<h1>Mapica</h1>
</header>
<main>
	<Map markers={data.markers} />
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin: 0.5rem;
		height: 60%;
		width: 100%;
	}
</style>
