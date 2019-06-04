CREATE OR REPLACE FUNCTION reporting.rushing_stats_season()
RETURNS TABLE (
    id_player         bigint,
    season            int,
    games_played      bigint,
    player_name       varchar,
    team              varchar,
    total_attempts    bigint,
    total_yards       bigint,
    yards_per_attempt numeric,
    yards_per_game    numeric,
    total_touchdowns  bigint
) AS $$
#variable_conflict use_column
BEGIN

    RETURN QUERY
    WITH player_games AS (
        SELECT
            p.id_player,
            o.year,
            o.team,
            COUNT(0) AS games_played
        FROM
            reporting.offense AS o
            INNER JOIN reporting.players AS p ON o.player = p.id_player
            INNER JOIN reporting.games AS d ON o.id_game = d.id_game
        WHERE
            week <= 17 -- Regular season
        GROUP BY
            p.id_player,
            o.year,
            o.team
    ), sums_by_year AS (
        SELECT
            p.id_player,
            o.year,
            o.team,
            SUM(o.rushing_attempts)   AS total_attempts,
            SUM(o.rushing_yardage)    AS total_rushing_yardage,
            SUM(o.rushing_touchdowns) AS total_touchdowns
        FROM
            reporting.offense AS o
            INNER JOIN reporting.players AS p ON o.player = p.id_player
            INNER JOIN reporting.games AS g ON o.id_game = g.id_game
        WHERE
            rushing_attempts > 0
            AND week <= 17 -- Regular season
        GROUP BY
            p.id_player,
            o.year,
            o.team
    ), averages_by_year AS (
        SELECT
            sby.year,
            sby.id_player,
            pg.games_played,
            sby.team,
            sby.total_attempts,
            sby.total_rushing_yardage,
            sby.total_touchdowns,
            AVG(total_rushing_yardage / total_attempts::numeric) AS average,
            AVG(total_rushing_yardage / games_played::numeric) AS ypg
        FROM
            sums_by_year AS sby
            INNER JOIN player_games AS pg ON
              sby.id_player = pg.id_player
              AND sby.year = pg.year
              AND sby.team = pg.team
        GROUP BY
            sby.year,
            sby.id_player,
            pg.games_played,
            sby.team,
            sby.total_attempts,
            sby.total_rushing_yardage,
            sby.total_touchdowns
    )
    SELECT
        p.id_player,
        aby.year,
        aby.games_played,
        (p.first_name || ' ' || p.last_name)::varchar AS player,
        aby.team,
        aby.total_attempts,
        aby.total_rushing_yardage,
        aby.average,
        aby.ypg,
        aby.total_touchdowns
    FROM
        averages_by_year AS aby
        INNER JOIN reporting.players AS p ON aby.id_player = p.id_player;
END;
$$ LANGUAGE plpgsql;