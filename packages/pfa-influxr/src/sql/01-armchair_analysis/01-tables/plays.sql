CREATE TABLE IF NOT EXISTS armchair_analysis.plays (
	game_id                 integer,
	play_id                 integer,
	team_on_offense         varchar(3),
	team_on_defense         varchar(3),
	play_type               varchar(10),
	drive_sequence          smallint,
	length_in_seconds       smallint,
	quarter                 smallint,
	minutes                 smallint,
	seconds                 smallint,
	points_offense          smallint,
	points_defense          smallint,
	timeouts_offense        smallint,
	timeouts_defense        smallint,
	down                    smallint,
	yards_to_go             smallint,
	yards_from_own_goaline  smallint,
	field_zone              smallint,
	first_down              smallint,
	shotgun                 smallint,
	no_huddle               smallint,
	points_scored           smallint,
	tackle_on_play          smallint,
	sack_on_play            smallint,
	penalty_on_play         smallint,
	interception_on_play    smallint,
	fumble_on_play          smallint,
	safety_on_play          smallint,
	block_on_play           smallint
);

COPY plays
FROM '/tmp/nfl_00-18/PLAY.csv' DELIMITER ',' CSV HEADER;