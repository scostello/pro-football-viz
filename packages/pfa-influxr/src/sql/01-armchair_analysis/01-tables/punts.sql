CREATE TABLE IF NOT EXISTS armchair_analysis.punts (
	play_id         integer,
	punter          varchar(7),
	gross_yardage   smallint,
	net_yardage     smallint,
	touchback       smallint,
	returner        varchar(7),
	return_yardage  smallint,
	fair_caught     smallint
);

COPY punts
FROM '/tmp/nfl_00-18/PUNT.csv' DELIMITER ',' CSV HEADER;