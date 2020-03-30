CREATE TABLE IF NOT EXISTS armchair_analysis.fumbles (
	id_play             integer,
	fumbler             varchar(7),
	recovering_player   varchar(7),
	return_yardage      integer,
	forcing_player      varchar(7),
	fumble_lost					boolean
);

COPY fumbles
FROM '/tmp/nfl_00-18/FUMBLE.csv' DELIMITER ',' CSV HEADER;