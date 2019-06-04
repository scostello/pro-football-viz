CREATE TABLE IF NOT EXISTS reporting.punts (
	id_play         bigint,
	punter          bigint,
	returner        bigint,
	gross_yardage   smallint,
	net_yardage     smallint,
	touchback       smallint,
	return_yardage  smallint,
	fair_caught     smallint
);