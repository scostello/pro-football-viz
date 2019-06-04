CREATE TABLE IF NOT EXISTS reporting.passes (
	id_play         bigint,
	passer          bigint,
	target          bigint,
	defender        bigint,
	location        varchar(2),
	yards           smallint,
	completed       smallint,
	successful_play smallint,
	spiked_ball     smallint
);