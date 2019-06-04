CREATE TABLE IF NOT EXISTS reporting.logos (
	id_logo  SERIAL PRIMARY KEY NOT NULL,
	id_team  int,
  url      text
);