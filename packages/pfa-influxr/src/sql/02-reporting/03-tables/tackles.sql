CREATE TABLE IF NOT EXISTS reporting.tackles (
	uuid    bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	id_play bigint,
	tackler bigint,
	value   numeric
);