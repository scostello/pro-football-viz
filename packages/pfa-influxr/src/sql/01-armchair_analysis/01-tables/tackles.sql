CREATE TABLE IF NOT EXISTS armchair_analysis.tackles (
	uuid    integer,
	play_id integer,
	tackler varchar(7),
	value   numeric
);

COPY tackles
FROM '/tmp/nfl_00-18/TACKLE.csv' DELIMITER ',' CSV HEADER;