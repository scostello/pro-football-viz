CREATE TABLE IF NOT EXISTS armchair_analysis.snaps (
	uuid                 integer,
	game_id              integer,
	team                 varchar,
	player               varchar(7),
	position_depth_chart varchar,
	position_starting    varchar,
	snaps                integer
);

COPY snaps
FROM '/tmp/nfl_00-18/SNAP.csv' DELIMITER ',' CSV HEADER;