CREATE OR REPLACE FUNCTION reporting.passing_rushing_attempts_report()
RETURNS TABLE (
    season           int,
    team_name        varchar,
    rushing_attempts bigint,
    passing_attempts bigint
) AS $$
BEGIN

    RETURN QUERY
    SELECT
        g.season,
        tt.team_name,
        SUM(tt.rushing_attempts) AS rushing_attempts,
        SUM(tt.passing_attempts) AS passing_attempts
    FROM
        reporting.team_totals AS tt
        INNER JOIN reporting.games AS g ON tt.id_game = g.id_game
    GROUP BY
        g.season,
        tt.team_name;

END;
$$ LANGUAGE plpgsql;