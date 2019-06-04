CREATE TABLE IF NOT EXISTS reporting.sacks (
	uuid            bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_play         bigint,
	quarter_back    bigint,
	sacking_player  bigint,
	value           numeric,
	yards_lost      integer
);