CREATE OR REPLACE FUNCTION reporting.passing_direction_report()
RETURNS TABLE (
    season       int,
    team_name    varchar,
    deep_left    bigint,
    deep_middle  bigint,
    deep_right   bigint,
    short_left   bigint,
    short_middle bigint,
    short_right  bigint
) AS $$
BEGIN

    RETURN QUERY
    SELECT
        g.season,
        tt.team_name,
        SUM(tt.passing_attempts_deepleft)    AS deep_left,
        SUM(tt.passing_attempts_deepmiddle)  AS deep_middle,
        SUM(tt.passing_attempts_deepright)   AS deep_right,
        SUM(tt.passing_attempts_shortleft)   AS short_left,
        SUM(tt.passing_attempts_shortmiddle) AS short_middle,
        SUM(tt.passing_attempts_shortright)  AS short_right
    FROM
        reporting.team_totals AS tt
        INNER JOIN reporting.games AS g ON tt.id_game = g.id_game
    GROUP BY
        g.season,
        tt.team_name;

END;
$$ LANGUAGE plpgsql;