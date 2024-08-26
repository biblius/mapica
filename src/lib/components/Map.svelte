<script lang="ts">
	import { fetchJson } from '$lib/utils';
	import { iconFor } from '$lib/utils/leaflet';
	import L, { LatLng, Marker as LMarker, type LeafletMouseEvent } from 'leaflet';
	import { onMount } from 'svelte';
	import type { Location as LocationM } from '$lib/types';
	import Location from './Location.svelte';
	import MarkerPanel from './MarkerPanel.svelte';
	import LocationList from './LocationList.svelte';

	// Initial locations to set up markers for.
	export let locations: LocationM[];

	// Loaded markers on the map.
	const mapMarkers = new Map();

	// The currently selected location. Selected by clicking on the location's marker.
	let locationInfo: LocationM | undefined;

	// Leaflet map instance.
	let map: L.Map;

	// The working pin (marker) that's used to register new markers.
	let pin: LMarker | undefined;

	// Pin coordinates.
	let pinLatLng: LatLng | undefined;

	let locationNamePlaceholder: string = 'My awesome location';

	// Initialises the map.
	function loadMap() {
		// Initialize the map on the "map" div with a given center and zoom
		map = L.map('map', {
			center: [45.1667, 16.25], // Croatia
			zoom: 7
		});

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

		map.on('click', onMapClick);
	}

	// Moves the pin around on click.
	async function onMapClick(e: LeafletMouseEvent) {
		if (pin) {
			pin.setLatLng(e.latlng);
		} else {
			pin = L.marker(e.latlng, { icon: iconFor('default') })
				.on('click', removePin)
				.addTo(map!);
		}

		pinLatLng = pin.getLatLng();

		const place = await reverseLookup(e.latlng.lat, e.latlng.lng);
		locationNamePlaceholder =
			place.address?.village ||
			place.address?.town ||
			place.address?.county ||
			'My awesome location';

		// Turn off location info to show the Add marker panel
		if (locationInfo) {
			locationInfo = undefined;
		}
	}

	// Removes the working marker from the map if it exists.
	function removePin() {
		if (!pin) return;
		map.removeLayer(pin);
		pin = undefined;
		pinLatLng = undefined;
	}

	// Search nominatim for the closest OSM object for the given coordinates and return it.
	async function reverseLookup(lat: number, lng: number): Promise<{ name: string }> {
		return fetchJson(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
		);
	}

	// Adds a marker to the map.
	async function addMarker(location: LocationM) {
		const mark = L.marker([location.lat, location.lng], {
			title: location.name,
			icon: iconFor(location.type)
		})
			.on('click', () => toggleLocationInfo(location))
			.addTo(map);

		mapMarkers.set(location.id, mark);
	}

	// Displays/hides the location info sidebar.
	async function toggleLocationInfo(marker: LocationM) {
		// off
		if (locationInfo && locationInfo.id === marker.id) {
			locationInfo = undefined;
			return;
		}

		// on
		removePin();
		locationInfo = await fetchJson(`/api/locations?id=${marker.id}`);
	}

	// Submits the current pin and info to the database and clears the pin.
	async function createMarker(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement);

		// Mandatory
		const name = data.get('name')?.toString();
		const lat = data.get('lat');
		const lng = data.get('lng');

		// Optional
		const desc = data.get('description');
		const wa = data.get('water-availability');
		const waNote = data.get('wa-note');
		const va = data.get('vehicle-accessibility');
		const vaNote = data.get('va-note');
		const locType = data.get('location-type');

		const location: LocationM = await fetchJson('/api/locations', {
			method: 'POST',
			body: JSON.stringify({ name, lat, lng, desc, wa, waNote, va, vaNote, type: locType })
		});

		addMarker(location);
		removePin();
	}

	// Used to change the icon of the working marker.
	function togglePinIcon(e: Event) {
		if (!pin) return;

		const select = e.target as HTMLSelectElement;

		pin.setIcon(iconFor(select.value));
	}

	onMount(() => {
		loadMap();
		for (const location of locations) {
			addMarker(location);
		}
	});
</script>

<head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
</head>

<article id="map-container" class="content">
	<section id="map" class="content__map"></section>
	<section id="location-info" class="content__info">
		{#if locationInfo}
			<Location location={locationInfo} />
		{:else if pin}
			<div id="marker-panel">
				<MarkerPanel
					init={{ name: locationNamePlaceholder, latlng: pinLatLng }}
					onSubmit={createMarker}
					onTypeChange={togglePinIcon}
				/>
			</div>
		{:else}
			<div>
				{#each locations as location}
					<LocationList {location} onClick={() => toggleLocationInfo(location)} />
				{/each}
			</div>
		{/if}
	</section>
</article>

<style>
	.content {
		--grid-template-areas: 'map info';
		--grid-template-columns: 2fr minmax(320px, 400px);
		--grid-template-rows: auto;

		@media screen and (max-width: 930px) {
			--grid-template-areas: 'map' 'info';
			--grid-template-columns: 1fr;
			--grid-template-rows: minmax(500px, 1fr) 1fr;
		}

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-columns: var(--grid-template-columns);
		grid-template-rows: var(--grid-template-rows);
		grid-template-areas: var(--grid-template-areas);
		column-gap: 1rem;
	}

	.content__map {
		grid-area: map;
		align-self: center;
		border-radius: var(--border-radius);
	}

	.content__info {
		grid-area: info;
	}

	.content__map {
		aspect-ratio: 4 / 3;
	}
</style>
