CREATE TABLE IF NOT EXISTS armchair_analysis.penalties (
	uuid                integer,
	play_id             integer,
	flagged_team        varchar(3),
	flagged_player      varchar(7),
	description         varchar(40),
	category            smallint,
	assessed_yardage    smallint,
	action              varchar
);

COPY penalties
FROM '/tmp/nfl_00-18/PENALTY.csv' DELIMITER ',' CSV HEADER;