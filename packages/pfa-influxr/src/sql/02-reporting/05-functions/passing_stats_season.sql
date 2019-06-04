CREATE OR REPLACE FUNCTION reporting.passing_stats_season()
RETURNS TABLE (
    season                   int,
    player                   varchar,
    team                     varchar,
    attempts                 bigint,
    completions              bigint,
    completion_percentage    numeric,
    yardage                  bigint,
    yards_per_attempt        numeric,
    touchdowns               bigint,
    touchdown_percentage     numeric,
    interceptions            bigint,
    interceptions_percentage numeric,
    passer_rating            numeric
) AS $$
#variable_conflict use_column
BEGIN

    RETURN QUERY
    WITH sums_by_year AS (
        SELECT
            o.year,
            p.first_name || ' ' || p.last_name AS player,
            o.team,
            SUM(passing_attempts)              AS attempts,
            SUM(passing_completions)           AS completions,
            SUM(passing_yardage)               AS yardage,
            SUM(passing_touchdowns)            AS touchdowns,
            SUM(interceptions)                 AS interceptions
        FROM
            reporting.offense AS o
            INNER JOIN reporting.players AS p ON o.player = p.id_player
            INNER JOIN reporting.games AS g ON o.id_game = g.id_game
        WHERE
            passing_attempts > 0
            AND week <= 17 -- Regular season
        GROUP BY
            o.year,
            p.first_name,
            p.last_name,
            o.player,
            o.team
        HAVING
            (SUM(passing_attempts) / 17.0) > 14
    ), averages_by_year AS (
        SELECT
            year,
            player,
            team,
            AVG((completions * 100) / attempts::numeric)   AS completion_percentage,
            AVG(yardage / attempts::numeric)               AS yards_per_attempt,
            AVG((touchdowns * 100) / attempts::numeric)    AS touchdown_percentage,
            AVG((interceptions * 100) / attempts::numeric) AS interception_percentage
        FROM
            sums_by_year
        GROUP BY
            year,
            player,
            team
    )

    SELECT
        sby.year,
        sby.player::varchar,
        sby.team,
        attempts,
        completions,
        completion_percentage,
        yardage,
        yards_per_attempt,
        touchdowns,
        touchdown_percentage,
        interceptions,
        interception_percentage,
        reporting.passer_rating(attempts, completions, yardage, touchdowns, interceptions) AS passer_rating
    FROM
        sums_by_year AS sby
        INNER JOIN averages_by_year AS aby ON sby.year = aby.year AND sby.player = aby.player;

END;
$$ LANGUAGE plpgsql;