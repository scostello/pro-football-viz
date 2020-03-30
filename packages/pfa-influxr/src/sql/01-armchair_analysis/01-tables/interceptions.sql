CREATE TABLE IF NOT EXISTS armchair_analysis.interceptions (
	id_play         integer,
	passer          varchar(7),
	interceptor     varchar(7),
	return_yardage  smallint
);

COPY interceptions
FROM '/tmp/nfl_00-18/INTERCPT.csv' DELIMITER ',' CSV HEADER;