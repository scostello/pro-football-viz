DROP SEQUENCE IF EXISTS public.id_sequence;

DROP FUNCTION public.id_generator(out id_new bigint);

CREATE SEQUENCE IF NOT EXISTS id_sequence;

CREATE OR REPLACE FUNCTION id_generator(out id_new bigint)
AS
$$
DECLARE
    our_epoch bigint := 1495331934020;
    id_seq bigint;
    now_ms bigint;
    id_shard int := 1;
BEGIN

    SELECT nextval('public.id_sequence') % 1024 INTO id_seq;
    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_ms;
    id_new := (now_ms - our_epoch) << 23;
    id_new := id_new | (id_shard << 10);
    id_new := id_new | (id_seq);

END
$$ LANGUAGE plpgsql;