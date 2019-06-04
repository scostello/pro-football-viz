CREATE OR REPLACE FUNCTION reporting.team_home_game_outcomes()
RETURNS TABLE (
  season        integer,
  team_abbr     varchar(3),
  total_wins    bigint,
  total_losses  bigint,
  total_ties    bigint
) AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    DISTINCT
    season    AS season,
    home_team AS team,
    COUNT(0) FILTER(WHERE points_home > points_visitor) OVER w AS num_home_wins,
    COUNT(0) FILTER(WHERE points_home < points_visitor) OVER w AS num_home_loses,
    COUNT(0) FILTER(WHERE points_home = points_visitor) OVER w AS num_home_ties
  FROM
    reporting.games
  GROUP BY
    season,
    home_team,
    points_home,
    points_visitor
  WINDOW w AS (
    PARTITION BY
      season,
      home_team
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reporting.team_away_game_outcomes()
RETURNS TABLE (
  season        integer,
  team_abbr     varchar(3),
  total_wins    bigint,
  total_losses  bigint,
  total_ties    bigint
) AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    DISTINCT
    season        AS season,
    visiting_team AS team,
    COUNT(0) FILTER(WHERE points_visitor > points_home) OVER w AS num_visitor_wins,
    COUNT(0) FILTER(WHERE points_visitor < points_home) OVER w AS num_visitor_loses,
    COUNT(0) FILTER(WHERE points_visitor = points_home) OVER w AS num_visitor_ties
  FROM
    reporting.games
  GROUP BY
    season,
    visiting_team,
    points_home,
    points_visitor
  WINDOW w AS (
    PARTITION BY
      season,
      visiting_team
  );
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION reporting.team_game_outcomes();
CREATE OR REPLACE FUNCTION reporting.team_game_outcomes()
RETURNS TABLE (
  season              integer,
  team_abbr           varchar(3),
  total_games         bigint,
  total_wins          bigint,
  total_losses        bigint,
  total_ties          bigint,
  winning_percentage  numeric,
  total_home_games    bigint,
  total_away_games    bigint
) AS $$
#variable_conflict use_column
BEGIN

  RETURN QUERY
  WITH team_total_games AS (
    SELECT
      h_outcomes.season,
      h_outcomes.team_abbr,
      (
        h_outcomes.total_wins +
        h_outcomes.total_losses +
        h_outcomes.total_ties +
        v_outcomes.total_wins +
        v_outcomes.total_losses +
        v_outcomes.total_ties
      ) AS total_games,
      (
        h_outcomes.total_wins +
        v_outcomes.total_wins
      ) AS total_wins,
      (
        h_outcomes.total_losses +
        v_outcomes.total_losses
      ) AS total_losses,
      (
        h_outcomes.total_ties +
        v_outcomes.total_ties
      ) AS total_ties,
      (
        h_outcomes.total_wins +
        h_outcomes.total_losses +
        h_outcomes.total_ties
      ) AS total_home_games,
      (
        v_outcomes.total_wins +
        v_outcomes.total_losses +
        v_outcomes.total_ties
      ) AS total_visitor_games
    FROM
      reporting.team_home_game_outcomes() AS h_outcomes
      INNER JOIN reporting.team_away_game_outcomes() AS v_outcomes ON
        h_outcomes.team_abbr = v_outcomes.team_abbr
        AND h_outcomes.season = v_outcomes.season
  )
  SELECT
    season,
    team_abbr,
    total_games,
    total_wins,
    total_losses,
    total_ties,
    (total_wins::numeric / total_games::numeric) * 100 AS winning_percentage,
    total_home_games,
    total_visitor_games
  FROM
    team_total_games
  ORDER BY
    team_abbr ASC,
    season ASC;

END;
$$ LANGUAGE plpgsql;