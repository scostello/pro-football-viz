CREATE TABLE IF NOT EXISTS reporting.injuries (
    uuid            bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_game         bigint,
	player          bigint,
	team            varchar(3),
	details         varchar(25),
	practice_status varchar(35),
	game_status     varchar(15)
);