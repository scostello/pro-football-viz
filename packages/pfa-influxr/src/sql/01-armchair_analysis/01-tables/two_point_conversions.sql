CREATE TABLE IF NOT EXISTS armchair_analysis.conversions (
	play_id         integer,
	type            varchar(4),
	ball_carrier    varchar(7),
	passer          varchar(7),
	pass_target     varchar(7),
	converted       smallint
);

COPY conversions
FROM '/tmp/nfl_00-18/CONV.csv' DELIMITER ',' CSV HEADER;