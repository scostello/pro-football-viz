CREATE TABLE IF NOT EXISTS reporting.touchdowns (
	id_play         bigint,
	scoring_player  bigint,
	quarter         smallint,
	minutes         smallint,
	seconds         smallint,
	down            smallint,
	yards           smallint,
	points          smallint,
	type            varchar(4)
);