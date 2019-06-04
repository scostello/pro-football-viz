CREATE TABLE IF NOT EXISTS armchair_analysis.games (
	game_id             integer,
	season              integer,
	week                smallint,
	day                 varchar(3),
	visiting_team       varchar(3),
	home_team           varchar(3),
	stadium             varchar(45),
	temperature         varchar(4),
	humidity            varchar(4),
	wind_speed          varchar(4),
	wind_direction      varchar(4),
	conditions          varchar(15),
	surface             varchar(30),
	over_under          numeric,
	vis_point_spread    numeric,
	points_visitor      smallint,
	points_home         smallint
);

COPY games
FROM '/tmp/nfl_00-18/GAME.csv' DELIMITER ',' CSV HEADER;