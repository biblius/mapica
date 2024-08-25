<script lang="ts">
	import { LatLng } from 'leaflet';
	import LowMidHigh from './LowMidHigh.svelte';

	export let namePlaceholder: string;
	export let onSubmit: (e: SubmitEvent) => void;
	export let onTypeChange: (e: Event) => void;
	export let latLng: LatLng | undefined;
</script>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>Add marker</legend>

		<p>Lat*: {latLng ? latLng.lat.toFixed(6) : ''}</p>
		<p>Lng*: {latLng ? latLng.lng.toFixed(6) : ''}</p>

		<div class="input-container">
			<label for="name">Name*</label>
			<input name="name" type="text" value={namePlaceholder} />
		</div>

		<div class="input-container">
			<label for="description">Description</label>
			<textarea name="description" rows="5" placeholder="This place rules!" />
		</div>

		<div>
			<label for="location-type">Type</label>
			<select name="location-type" id="location-type" on:change={onTypeChange}>
				<option value="leggiero">Leggiero</option>
				<option value="adventure">Adventure</option>
			</select>
		</div>

		<div class="lmh-container">
			<LowMidHigh
				legend="Water availability"
				tooltip="How easy it is to restock on water on the location. For example, None means there is no water available, while High means that there is plenty of water sources available in the vicinity."
			/>
			<label for="wa-note">Water availability note</label>
			<textarea
				name="wa-note"
				rows="5"
				placeholder="Additional notes for water availability, e.g. directions to source."
			/>
		</div>

		<div class="lmh-container">
			<LowMidHigh
				legend="Vehicle accessibility"
				tooltip="How easy it is to access the location with a vehicle. A None means a vehicle has to be parked far away, while High means the vehicle can be in the near vicinity."
			/>
			<label for="va-note">Vehicle accessibility note</label>
			<textarea
				name="va-note"
				rows="5"
				placeholder="Additional notes for vehicle accessibility, e.g. directions to a nice parking location."
			/>
		</div>

		<input type="hidden" name="lat" value={latLng?.lat.toFixed(6)} />
		<input type="hidden" name="lng" value={latLng?.lng.toFixed(6)} />
	</fieldset>

	<button type="submit">Add</button>
</form>

<style>
	form {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 100%;
	}

	form fieldset {
		width: 100%;
	}

	form input,
	label {
		display: block;
	}
</style>
