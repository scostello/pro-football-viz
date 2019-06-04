DROP SCHEMA IF EXISTS stage_pfa CASCADE;

CREATE SCHEMA stage_pfa;
SET search_path = stage_pfa;

SELECT 'Schema Initialized' AS result;