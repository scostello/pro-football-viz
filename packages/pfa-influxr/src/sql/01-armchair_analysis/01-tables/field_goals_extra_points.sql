CREATE TABLE IF NOT EXISTS armchair_analysis.field_goals_extra_points (
	id_play     integer,
	type        varchar(2),
	kicker      varchar(7),
	distance    smallint,
	was_made    smallint
);

COPY field_goals_extra_points
FROM '/tmp/nfl_00-18/FGXP.csv' DELIMITER ',' CSV HEADER;