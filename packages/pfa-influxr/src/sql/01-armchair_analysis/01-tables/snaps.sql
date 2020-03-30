CREATE TABLE IF NOT EXISTS armchair_analysis.snaps (
	uuid                 integer,
	id_game              integer,
	team                 varchar,
	player               varchar,
	position_depth_chart varchar,
	position_starting    varchar,
	snaps                integer,
);

COPY snaps
FROM '/tmp/nfl_00-18/SNAP.csv' DELIMITER ',' CSV HEADER;