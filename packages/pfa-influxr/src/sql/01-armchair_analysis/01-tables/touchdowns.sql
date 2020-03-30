CREATE TABLE IF NOT EXISTS armchair_analysis.touchdowns (
	play_id         integer,
	quarter         smallint,
	minutes         smallint,
	seconds         smallint,
	down            smallint,
	yards           smallint,
	points          smallint,
	scoring_player  varchar,
	type            varchar,
);

COPY touchdowns
FROM '/tmp/nfl_00-18/TD.csv' DELIMITER ',' CSV HEADER;