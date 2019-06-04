CREATE TABLE IF NOT EXISTS reporting.redzone_appearances (
	uuid                        bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_game                     bigint,
	player                      bigint,
	passing_attempts            smallint,
	passing_completions         smallint,
	passing_yardagey            integer,
	interceptions               smallint,
	rushing_attempts            smallint,
	successful_rushing_attempts smallint,
	rushing_yardage             integer,
	times_targeted              smallint,
	receptions                  smallint,
	receiving_yardage           integer,
	fumbles_lost                smallint,
	penalty_yardage             smallint
);