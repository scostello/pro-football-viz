CREATE TABLE IF NOT EXISTS reporting.franchises (
  id_team         bigint DEFAULT public.id_generator() NOT NULL,
  id_stadium      bigint,
	id_logo         bigint,
	team_abbr       varchar(3),
	team_full       varchar(50),
	mascot          varchar(50),
	active_from     int,
	active_to       int
);