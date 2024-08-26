import L from 'leaflet';

import iconPin from '$lib/assets/location-pin-svgrepo-com.svg';
import iconLeggiero from '$lib/assets/leggiero-pin.png';
import iconAdventure from '$lib/assets/mountain-pin.png';

// Default marker icon.
export function mIconPin() {
	return L.icon({
		iconUrl: iconPin,
		iconSize: [38, 95],
		iconAnchor: [19, 70],
		popupAnchor: [-3, -76]
	});
}

export function mIconLeggiero() {
	return L.icon({
		iconUrl: iconLeggiero,
		iconSize: [60, 60],
		iconAnchor: [31, 72],
		popupAnchor: [-3, -76]
	});
}

export function mIconAdventure() {
	return L.icon({
		iconUrl: iconAdventure,
		iconSize: [70, 60],
		iconAnchor: [37, 70],
		popupAnchor: [-3, -76]
	});
}

/** Returns an icon depending on the location type. */
export function iconFor(value: string): L.Icon {
	switch (value) {
		case 'adventure':
			return mIconAdventure();
		case 'leggiero':
			return mIconLeggiero();
		default:
			return mIconPin();
	}
}
