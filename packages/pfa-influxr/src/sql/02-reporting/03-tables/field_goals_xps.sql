CREATE TABLE IF NOT EXISTS reporting.field_goals_extra_points (
	id_play     bigint,
	type        varchar(2),
	kicker      bigint,
	distance    smallint,
	was_made    boolean
);