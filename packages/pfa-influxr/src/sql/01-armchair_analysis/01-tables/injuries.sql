CREATE TABLE IF NOT EXISTS armchair_analysis.injuries (
    uuid            integer,
	game_id         integer,
	player          varchar(7),
	team            varchar(3),
	details         varchar(25),
	practice_status varchar(35),
	game_status     varchar(15)
);

COPY injuries
FROM '/tmp/nfl_00-18/INJURY.csv' DELIMITER ',' CSV HEADER;