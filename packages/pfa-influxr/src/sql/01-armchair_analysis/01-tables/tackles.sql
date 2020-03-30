CREATE TABLE IF NOT EXISTS armchair_analysis.tackles (
	uuid    integer,
	id_play integer,
	tackler varchar(7),
	value   numeric
);

COPY tackles
FROM '/tmp/nfl_00-18/TACKLE.csv' DELIMITER ',' CSV HEADER;