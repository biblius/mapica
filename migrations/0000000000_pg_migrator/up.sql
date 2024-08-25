CREATE TYPE lmh AS ENUM('none', 'low', 'mid', 'high');
CREATE TYPE location_type AS ENUM('leggiero', 'adventure');

CREATE TABLE locations(
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	lat FLOAT NOT NULL,
	lng FLOAT NOT NULL,
	type location_type,
	description TEXT,
	water_availability lmh,
	water_availability_note TEXT,
	vehicle_accessibility lmh,
	vehicle_accessibility_note TEXT
);
