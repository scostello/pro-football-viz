CREATE TABLE IF NOT EXISTS armchair_analysis.kickers (
	uuid                integer,
	game_id             integer,
	player              varchar(7),
	pats                smallint,
	field_goals_short   smallint,
	field_goals_med     smallint,
	field_goals_long    smallint,
	fantasy_points      numeric,
	player_game_number  smallint,
	seasons_played      smallint,
	year                integer,
	team                varchar(3)
);

COPY kickers
FROM '/tmp/nfl_00-18/KICKER.csv' DELIMITER ',' CSV HEADER;