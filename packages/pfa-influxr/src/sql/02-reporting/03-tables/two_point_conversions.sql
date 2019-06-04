CREATE TABLE IF NOT EXISTS reporting.two_point_conversions (
	id_play         bigint,
	type            varchar(4),
	ball_carrier    bigint,
	passer          bigint,
	pass_target     bigint,
	converted       smallint
);