CREATE TABLE IF NOT EXISTS armchair_analysis.sacks (
	uuid            integer,
	play_id         integer,
	quarter_back    varchar(7),
	sacking_player  varchar(7),
	value           numeric(2,1),
	yards_lost      integer
);

COPY sacks
FROM '/tmp/nfl_00-18/SACK.csv' DELIMITER ',' CSV HEADER;