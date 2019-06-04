CREATE TABLE IF NOT EXISTS reporting.kickers (
	uuid                bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_game             bigint,
	player              bigint,
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