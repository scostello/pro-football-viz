CREATE TABLE IF NOT EXISTS reporting.franchises (
  id_franchise      bigint DEFAULT public.id_generator() NOT NULL,
  id_stadium        bigint,
	current_name_abbr varchar(3),
	current_name_full varchar(100),
	current_mascot    varchar(50),
	active_from       int,
	active_to         int
);