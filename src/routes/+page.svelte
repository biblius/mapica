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
	<Map locations={data.locations} />
</main>

<style>

</style>
