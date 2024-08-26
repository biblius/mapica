<script lang="ts">
	import { LatLng } from 'leaflet';
	import LowMidHigh from './LowMidHigh.svelte';

	// Initial values for the form, useful when updating markers.
	export let init: {
		name: string;
		latlng?: LatLng;
		type?: string;
		desc?: string;
		wa?: string;
		waNote?: string;
		va?: string;
		vaNote?: string;
	};
	export let onSubmit: (e: SubmitEvent) => void;
	export let onTypeChange: (e: Event) => void;

	let selectedType = init.type;
	$: latLng = init.latlng;
</script>

<section class="card">
	<header class="card__header">
		<h2 class="card__title">Add marker</h2>
	</header>

	<section class="card__content">
		<form on:submit|preventDefault={onSubmit} id="add-marker-form">
			<div class="form__container" role="presentation">
				<div class="form__input" role="presentation">
					<label for="lat">Latitude</label>
					<input type="text" readonly name="lat" value={latLng?.lat.toFixed(6) ?? 'n/a'} />
				</div>

				<div class="form__input" role="presentation">
					<label for="lat">Longitude</label>
					<input type="text" readonly name="lng" value={latLng?.lng.toFixed(6) ?? 'n/a'} />
				</div>

				<div class="form__input" role="presentation">
					<label for="name">Name</label>
					<input name="name" type="text" value={init.name} />
				</div>

				<div class="form__input" role="presentation">
					<label for="description">Description</label>
					<textarea name="description" rows="5" placeholder="This place rules!" value={init.desc} />
				</div>

				<div class="form__input" role="presentation">
					<label for="location-type">Type</label>
					<select
						name="location-type"
						id="location-type"
						bind:value={selectedType}
						on:change={onTypeChange}
					>
						<option value="leggiero">Leggiero</option>
						<option value="adventure">Adventure</option>
					</select>
				</div>

				<div class="form__input" role="presentation">
					<LowMidHigh
						legend="Water availability"
						tooltip="How easy it is to restock on water on the location. None means there is no water available, while High means that there is plenty of water sources available in the vicinity."
					/>
				</div>

				<div class="form__input" role="presentation">
					<label for="wa-note">Water availability note</label>
					<textarea
						name="wa-note"
						rows="5"
						placeholder="Additional notes for water availability, e.g. directions to source."
					/>
				</div>

				<div class="form__input" role="presentation">
					<LowMidHigh
						legend="Vehicle accessibility"
						tooltip="How easy it is to access the location with a vehicle. None means a vehicle has to be parked far away, while High means the vehicle can be in the near vicinity."
					/>
				</div>

				<div class="form__input" role="presentation">
					<label for="va-note">Vehicle accessibility note</label>
					<textarea
						name="va-note"
						rows="5"
						placeholder="Additional notes for vehicle accessibility, e.g. directions to a nice parking location."
					/>
				</div>
			</div>
		</form>
	</section>

	<footer class="card__footer">
		<button type="submit" form="add-marker-form">Add</button>
	</footer>
</section>

<style>
	form input,
	label {
		display: block;
	}

	.card {
		background-color: var(--color-white);
		color: var(--color-primary);
		padding-block: 1.5rem;
		padding-inline: 1.5rem;
		border-radius: var(--border-radius);

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card__title {
		margin: 0;
	}

	.form__container {
		display: flex;
		flex-direction: column;
		row-gap: 0.75rem;
	}

	.form__input {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
	}
</style>
