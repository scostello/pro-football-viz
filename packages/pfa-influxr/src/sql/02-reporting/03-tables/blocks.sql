CREATE TABLE IF NOT EXISTS reporting.blocks (
	id_play             bigint,
	blocker             bigint,
	recovering_player   bigint,
	type                varchar
);