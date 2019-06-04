CREATE OR REPLACE FUNCTION players_all()
RETURNS SETOF players
AS $$
BEGIN
    SET SEARCH_PATH = dashboard;

    RETURN QUERY
    SELECT
        *
    FROM
        players;

END;
$$ LANGUAGE plpgsql;