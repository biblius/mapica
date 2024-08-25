import db from '$lib/pg';
import type Location from '$lib/types';

// Each +page.svelte can have its +page.server.ts.
// If the file has a load function, the data it returns will be
// stored in a variable called `data` in +page.svelte. See
// that file for more info.
export async function load(): { markers: Location[] } {
	const locations = await db.query('SELECT * FROM locations');
	return { locations: locations.rows as Location[] };
}
