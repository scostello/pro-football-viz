CREATE OR REPLACE FUNCTION reporting.rushing_direction_report()
RETURNS TABLE (
    season          int,
    team_name       varchar,
    total_attempts  numeric,
    left_end        numeric,
    left_tackle     numeric,
    left_guard      numeric,
    middle          numeric,
    right_guard     numeric,
    right_tackle    numeric,
    right_end       numeric
) AS $$
BEGIN

    RETURN QUERY
    SELECT
        g.season,
        tt.team_name,
        SUM(tt.rushing_attempts)              AS total_attempts,
        SUM(tt.rushing_attempts_leftend)      AS left_end,
        SUM(tt.rushing_attempts_lefttackle)   AS left_tackle,
        SUM(tt.rushing_attempts_leftguard)    AS left_guard,
        SUM(tt.rushing_attempts_middle)       AS middle,
        SUM(tt.rushing_attempts_rightguard)   AS right_guard,
        SUM(tt.rushing_attempts_righttackle)  AS right_tackle,
        SUM(tt.rushing_attempts_rightend)     AS right_end,
    FROM
        reporting.team_totals AS tt
        INNER JOIN reporting.games AS g ON tt.id_game = g.id_game
    GROUP BY
        g.season,
        tt.team_name;

END;
$$ LANGUAGE plpgsql;