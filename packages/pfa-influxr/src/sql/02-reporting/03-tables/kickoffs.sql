CREATE TABLE IF NOT EXISTS reporting.kickoffs (
	id_play         bigint,
	kicker          bigint,
	gross_yardage   smallint,
	net_yardage     smallint,
	touchback       smallint,
	returner        bigint,
	return_yardage  smallint
);