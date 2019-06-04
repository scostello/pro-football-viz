CREATE TABLE IF NOT EXISTS armchair_analysis.passes (
	play_id         integer,
	passer          varchar(7),
	target          varchar(7),
	location        varchar(2),
	yards           smallint,
	completed       smallint,
	successful_play smallint,
	spiked_ball     smallint,
	defender        varchar(7)
);

COPY passes
FROM '/tmp/nfl_00-18/PASS.csv' DELIMITER ',' CSV HEADER;