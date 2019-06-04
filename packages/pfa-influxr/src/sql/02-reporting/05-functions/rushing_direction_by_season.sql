CREATE OR REPLACE FUNCTION rushing_direction_by_season()
RETURNS TABLE (
    season       int,
    team_name    varchar,
    team_abbr    varchar,
    middle       int,
    left_end     int,
    left_tackle  int,
    left_guard   int,
    right_guard  int,
    right_tackle int,
    right_end    int
) AS $$
BEGIN

    RETURN QUERY
    SELECT
        season,
        name_abbr,
        name_full,
        SUM(rushing_attempts_middle)      AS middle,
        SUM(rushing_attempts_leftend)     AS left_end,
        SUM(rushing_attempts_lefttackle)  AS left_tackle,
        SUM(rushing_attempts_leftguard)   AS left_guard,
        SUM(rushing_attempts_rightguard)  AS right_guard,
        SUM(rushing_attempts_righttackle) AS right_tackle,
        SUM(rushing_attempts_rightend)    AS right_end
    FROM
        reporting.team_totals AS tt
        INNER JOIN reporting.games AS g ON tt.game_id = g.game_id
        INNER JOIN reporting.teams AS t ON tt.team_name = t.name_abbr
    GROUP BY
        season,
        name_abbr,
        name_full;

END;
$$ LANGUAGE plpgsql;