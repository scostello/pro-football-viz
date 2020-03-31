CREATE TABLE IF NOT EXISTS armchair_analysis.drives (
	uuid                    integer,
	id_game                 integer,
	first_play_id           integer,
	team                    varchar,
	drive_number            smallint,
	how_obtained            varchar,
	quarter                 smallint,
	minutes                 smallint,
	seconds                 smallint,
	starting_field_position smallint,
	plays                   smallint,
	successful_plays        smallint,
	rushing_first_downs     smallint,
	passing_first_downs     smallint,
	other_first_downs       smallint,
	rushing_yardage         integer,
	rushing_attempts        smallint,
	passing_yardage         integer,
	passing_attempts        smallint,
	passing_completions     smallint,
	penalty_yardage_for     smallint,
	penalty_yardage_against smallint,
	net_yardage             integer,
	result                  varchar,
);

COPY drives
FROM '/tmp/nfl_00-18/DRIVE.csv' DELIMITER ',' CSV HEADER;