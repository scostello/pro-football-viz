CREATE TABLE IF NOT EXISTS reporting.penalties (
	uuid                bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_play             bigint,
	flagged_team        varchar(3),
	flagged_player      bigint,
	description         varchar(40),
	category            smallint,
	assessed_yardage    smallint,
	action              varchar
);