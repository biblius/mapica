import postgres from 'pg';
import { DATABASE_URL } from '$env/static/private';

const { Client } = postgres;

const client = new Client({
	connectionString: DATABASE_URL
});

await client.connect();

export default client;
