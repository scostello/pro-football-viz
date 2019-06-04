CREATE TABLE IF NOT EXISTS armchair_analysis.blocks (
	play_id             integer,
	blocker             varchar(7),
	recovering_player   varchar(7),
	type                varchar
);

COPY blocks
FROM '/tmp/nfl_00-18/BLOCK.csv' DELIMITER ',' CSV HEADER;