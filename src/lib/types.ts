/** Main location model. */
export type Location = {
	id: number;
	name: string;
	lat: number;
	lng: number;
	type?: string;
	description?: string;
	vehicle_accessibility?: string;
	vehicle_accessibility_note?: string;
	water_availability?: string;
	water_availability_note?: string;
};
