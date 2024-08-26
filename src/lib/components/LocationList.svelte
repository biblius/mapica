<script lang="ts">
	import type { Location } from '$lib/types';
	export let location: Location;
	export let onClick: () => void;
</script>

<div on:click={onClick}>
	<h3>{location.name}</h3>
	<p>{location.description}</p>
</div>

<style>
</style>
