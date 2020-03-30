CREATE TABLE IF NOT EXISTS armchair_analysis.games (
	id_game             integer,
	season              integer,
	week                smallint,
	day                 varchar,
	visiting_team       varchar,
	home_team           varchar,
	stadium             varchar,
	temperature         varchar,
	humidity            varchar,
	wind_speed          varchar,
	wind_direction      varchar,
	conditions          varchar,
	surface             varchar,
	over_under          numeric,
	vis_point_spread    numeric,
	points_visitor      smallint,
	points_home         smallint,
);

COPY games
FROM '/tmp/nfl_00-18/GAME.csv' DELIMITER ',' CSV HEADER;