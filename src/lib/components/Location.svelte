<script lang="ts">
	import type { Location } from '$lib/types';
	export let location: Location;
</script>

<div>
	<h2>{location.name}</h2>
	<p><i>{location.type}</i></p>
	<p>{location.description}</p>
	<p>{location.water_availability}</p>
</div>
