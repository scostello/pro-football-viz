CREATE TABLE IF NOT EXISTS reporting.rushes (
	id_play         bigint,
	ball_carrier    bigint,
	rush_direction  varchar(2),
	yards_gained    smallint,
	successful_play smallint,
	kneel_down      smallint
);