CREATE TABLE IF NOT EXISTS armchair_analysis.redzone_appearances (
	uuid                        integer,
	game_id                     integer,
	player                      varchar(7),
	passing_attempts            smallint,
	passing_completions         smallint,
	passing_yardage             integer,
	interceptions               smallint,
	rushing_attempts            smallint,
	successful_rushing_attempts smallint,
	rushing_yardage             integer,
	times_targeted              smallint,
	receptions                  smallint,
	receiving_yardage           integer,
	fumbles_lost                smallint,
	penalty_yardage             smallint
);

COPY redzone_appearances
FROM '/tmp/nfl_00-18/REDZONE.csv' DELIMITER ',' CSV HEADER;