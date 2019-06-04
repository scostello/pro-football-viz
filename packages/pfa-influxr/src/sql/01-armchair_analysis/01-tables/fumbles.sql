CREATE TABLE IF NOT EXISTS armchair_analysis.fumbles (
	play_id             integer,
	fumbler             varchar(7),
	recovering_player   varchar(7),
	return_yardage      integer,
	forcing_player      varchar(7)
);

COPY fumbles
FROM '/tmp/nfl_00-18/FUMBLE.csv' DELIMITER ',' CSV HEADER;