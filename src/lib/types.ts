/**
 * Main location model.
 */
export type Location = {
	id: number;
	description: string;
	lat: number;
	lng: number;
	name: string;
	type: string;
	vehicle_accessibility: string;
	vehicle_accessibility_note: string;
	water_availability: string;
	water_availability_note: string;
};
