import db from '$lib/pg';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const location = await db.query('SELECT * FROM locations WHERE id=$1 LIMIT 1', [id]);

	return new Response(JSON.stringify(location.rows[0]), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { name, lat, lng, desc, type, wa, waNote, va, vaNote } = data;

	if (!name) return error(422, 'Missing `name`');
	if (!lat) return error(422, 'Missing `lat`');
	if (!lng) return error(422, 'Missing `lng`');

	const marker = await db.query(
		'INSERT INTO locations(name, lat, lng, description, type, water_availability, water_availability_note, vehicle_accessibility, vehicle_accessibility_note) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
		[name, lat, lng, desc, type, wa, waNote, va, vaNote]
	);

	return new Response(JSON.stringify(marker.rows[0]), {
		headers: { 'Content-Type': 'application/json' }
	});
};
