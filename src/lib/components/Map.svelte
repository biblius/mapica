<script lang="ts">
	import L, { LatLng, Marker as LMarker, type LeafletMouseEvent } from 'leaflet';
	import { onMount } from 'svelte';
	import iconPin from '$lib/assets/location-pin-svgrepo-com.svg';
	import iconLeggiero from '$lib/assets/leggiero-pin.png';
	import iconAdventure from '$lib/assets/mountain-pin.png';
	import type { Location as LocationM } from '$lib/types';
	import Location from './Location.svelte';
	import AddMarker from './AddMarker.svelte';

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
			pin = L.marker(e.latlng, { icon: mIconLeggiero() }).addTo(map!);
		}

		pinLatLng = pin.getLatLng();

		const place = await reverseLookup(e.latlng.lat, e.latlng.lng);
		locationNamePlaceholder =
			place.name ||
			place.address.village ||
			place.address.town ||
			place.address.county ||
			'My awesome location';

		// Turn off location info to show the Add marker panel
		if (locationInfo) {
			locationInfo = undefined;
		}
	}

	// Search nominatim for the closest OSM object for the given coordinates and return it.
	async function reverseLookup(lat: number, lng: number): Promise<{ name: string }> {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
		);
		const data = await res.json();
		return data;
	}

	// Default marker icon.
	function mIconPin() {
		return L.icon({
			iconUrl: iconPin,
			iconSize: [38, 95],
			iconAnchor: [19, 70],
			popupAnchor: [-3, -76]
		});
	}

	function mIconLeggiero() {
		return L.icon({
			iconUrl: iconLeggiero,
			iconSize: [60, 60],
			iconAnchor: [31, 72],
			popupAnchor: [-3, -76]
		});
	}

	function mIconAdventure() {
		return L.icon({
			iconUrl: iconAdventure,
			iconSize: [70, 60],
			iconAnchor: [37, 70],
			popupAnchor: [-3, -76]
		});
	}

	// Adds a marker to the map.
	async function addMarker(location: LocationM) {
		const mark = L.marker([location.lat, location.lng], {
			title: location.name,
			icon: location.type === 'adventure' ? mIconAdventure() : mIconLeggiero()
		})
			.on('click', () => toggleLocationInfo(location))
			.addTo(map);

		mapMarkers.set(location.id, mark);
	}

	// Displays/hides the location info sidebar.
	async function toggleLocationInfo(marker: LocationM) {
		// Toggle off

		if (locationInfo && locationInfo.id === marker.id) {
			locationInfo = undefined;
			return;
		}

		// Toggle on

		// Remove pin if exists
		if (pin) {
			map.removeLayer(pin);
			pin = undefined;
			pinLatLng = undefined;
		}

		const data = await fetch(`/api/locations?id=${marker.id}`);
		locationInfo = await data.json();
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

		const res = await fetch('/api/locations', {
			method: 'POST',
			body: JSON.stringify({ name, lat, lng, desc, wa, waNote, va, vaNote, type: locType })
		});

		const marker = await res.json();

		addMarker(marker);

		if (pin) {
			map.removeLayer(pin);
			pin = undefined;
			pinLatLng = undefined;
		}
	}

	function togglePinIcon(e: Event) {
		if (!pin) return;

		const select = e.target as HTMLSelectElement;

		switch (select.value) {
			case 'adventure':
				pin.setIcon(mIconAdventure());
				break;
			case 'leggiero':
				pin.setIcon(mIconLeggiero());
				break;
			default:
				pin.setIcon(mIconPin());
		}
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
		{:else}
			<div id="add-marker">
				<AddMarker
					namePlaceholder={locationNamePlaceholder || 'My awesome location'}
					latLng={pinLatLng}
					onSubmit={createMarker}
					onTypeChange={togglePinIcon}
				/>
			</div>
		{/if}
	</section>
</article>

<style>
	.content {
		--grid-template-areas: "map info";
		--grid-template-columns: 2fr 1fr;
		--grid-template-rows: auto;

		@media screen and (max-width: 930px) {
			--grid-template-areas: "info" "map";
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
	}

	.content__info {
		grid-area: info;
	}

	.content__map {
		aspect-ratio: 4 / 3;
	}
</style>
