CREATE OR REPLACE PROCEDURE reporting.migrate_players()
AS $$
BEGIN

  TRUNCATE reporting.players;

  INSERT INTO reporting.players (aa_player_id, first_name, last_name, play_by_play_name, position_1, position_2, height, weight, date_of_birth, forty, bench, vertical, broad, shuttle, cone, arm_length, hand_size, draft_position, college, college_division, first_year, current_team, position_depth_chart, jersey_number, depth_chart, nfl_player_id)
  SELECT
    player_id, first_name, last_name, play_by_play_name, position_1, position_2, height, weight, date_of_birth, forty, bench, vertical, broad, shuttle, cone, arm_length, hand_size, draft_position, college, college_division, first_year, current_team, position_depth_chart, jersey_number, depth_chart, nfl_player_id
  FROM
    armchair_analysis.players;

END;
$$ LANGUAGE plpgsql;

CALL reporting.migrate_players();

CREATE OR REPLACE PROCEDURE reporting.migrate_games()
AS $$
BEGIN

  TRUNCATE reporting.games;

  INSERT INTO reporting.games (aa_game_id, season, week, day, visiting_team, home_team, stadium, temperature, humidity, wind_speed, wind_direction, conditions, surface, over_under, vis_point_spread, points_visitor, points_home)
  SELECT
    game_id, season, week, day, visiting_team, home_team, stadium, temperature, humidity, wind_speed, wind_direction, conditions, surface, over_under, vis_point_spread, points_visitor, points_home
  FROM
    armchair_analysis.games;

END;
$$ LANGUAGE plpgsql;

CALL reporting.migrate_games();

CREATE OR REPLACE PROCEDURE reporting.migrate_plays()
AS $$
BEGIN

  TRUNCATE reporting.plays;

  INSERT INTO reporting.plays (id_game, aa_play_id, aa_game_id, team_on_offense, team_on_defense, play_type, drive_sequence, length_in_seconds, quarter, minutes, seconds, points_offense, points_defense, timeouts_offense, timeouts_defense, down, yards_to_go, yards_from_own_goaline, field_zone, first_down, shotgun, no_huddle, points_scored, tackle_on_play, sack_on_play, penalty_on_play, interception_on_play, fumble_on_play, safety_on_play, block_on_play)
  SELECT
    rg.id_game,
    ap.play_id, ap.game_id, team_on_offense, team_on_defense, play_type, drive_sequence, length_in_seconds, quarter, minutes, seconds, points_offense, points_defense, timeouts_offense, timeouts_defense, down, yards_to_go, yards_from_own_goaline, field_zone, first_down, shotgun, no_huddle, points_scored, tackle_on_play, sack_on_play, penalty_on_play, interception_on_play, fumble_on_play, safety_on_play, block_on_play
  FROM
    armchair_analysis.plays AS ap
    INNER JOIN reporting.games AS rg ON ap.game_id = rg.aa_game_id;

END;
$$ LANGUAGE plpgsql;

CALL reporting.migrate_plays();

CREATE OR REPLACE PROCEDURE reporting.migrate_blocks()
AS $$
BEGIN
  TRUNCATE reporting.blocks;

  INSERT INTO reporting.blocks (id_play, blocker, recovering_player, type)
  SELECT
    rep_plays.id_play       AS id_play,
    rep_blocker.id_player   AS blocker,
    rep_recoverer.id_player AS recovering_player,
    aa_blocks.type          AS type
  FROM
    armchair_analysis.blocks AS aa_blocks
    INNER JOIN reporting.plays AS rep_plays ON aa_blocks.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_blocker ON aa_blocks.blocker = rep_blocker.aa_player_id
    LEFT JOIN reporting.players AS rep_recoverer ON aa_blocks.recovering_player = rep_recoverer.aa_player_id;

END;
$$ LANGUAGE plpgsql;

CALL reporting.migrate_blocks();

CREATE OR REPLACE PROCEDURE reporting.migrate_defense()
AS $$
BEGIN
  TRUNCATE reporting.defense;

  INSERT INTO reporting.defense (id_game, player, solo_tackles, combined_tackles, sacks, safeties, blocked_kicks, interceptions, passes_defended, fumbles_recovered, fumbles_forced, touchdowns, return_yardage, return_touchdowns, penalty_yardage, snaps, fantasy_points_nfl, fantasy_points_fd_dk, player_game_number, seasons_played, nfl_season, team, position, jersey_number, depth_chart, nfl_player_id)
  SELECT
    rep_games.id_game,
    rep_players.id_player,
    solo_tackles, combined_tackles, sacks, safeties, blocked_kicks, interceptions, passes_defended, fumbles_recovered, fumbles_forced, touchdowns, return_yardage, return_touchdowns, penalty_yardage, snaps, fantasy_points_nfl, fantasy_points_fd_dk, player_game, seasons_played, nfl_season, team, aa_def.position_depth_chart, aa_def.jersey_number, aa_def.depth_chart, aa_def.nfl_player_id
  FROM
    armchair_analysis.defense AS aa_def
    INNER JOIN reporting.games AS rep_games ON aa_def.game_id = rep_games.aa_game_id
    INNER JOIN reporting.players AS rep_players ON aa_def.player = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

CALL reporting.migrate_defense();


CREATE OR REPLACE PROCEDURE reporting.migrate_drives()
AS $$
BEGIN
  TRUNCATE reporting.drives;

  INSERT INTO reporting.drives (id_game, id_first_play, team, drive_number, how_obtained, quarter, minutes, seconds, starting_field_position, plays, successful_plays, rushing_first_downs, passing_first_downs, other_first_downs, rushing_attempts, rushing_yardage, passing_attempts, passing_completions, passing_yardage, penalty_yardage_for, penalty_yardage_against, net_yardage, result)
  SELECT
    rep_games.id_game,
    rep_plays.id_play AS id_first_play,
    team, drive_number, how_obtained, aa_drives.quarter, aa_drives.minutes, aa_drives.seconds, starting_field_position, plays, successful_plays, rushing_first_downs, passing_first_downs, other_first_downs, rushing_yardage, rushing_attempts, passing_yardage, passing_attempts, passing_completions, penalty_yardage_for, penalty_yardage_against, net_yardage, result
  FROM
    armchair_analysis.drives AS aa_drives
    INNER JOIN reporting.games AS rep_games ON aa_drives.game_id = rep_games.aa_game_id
    INNER JOIN reporting.plays AS rep_plays ON aa_drives.first_play_id = rep_plays.aa_play_id;

END;
$$ LANGUAGE plpgsql;

-- Drives = 117,839
CALL reporting.migrate_drives();

CREATE OR REPLACE PROCEDURE reporting.migrate_fg_xp()
AS $$
BEGIN
  TRUNCATE reporting.field_goals_extra_points;

  INSERT INTO reporting.field_goals_extra_points (id_play, type, kicker, distance, was_made)
  SELECT
    rep_plays.id_play,
    aa_fgxp.type,
    rep_players.id_player,
    aa_fgxp.distance,
    CASE
      WHEN was_made = 1 THEN TRUE
      ELSE FALSE
    END AS was_made
  FROM
    armchair_analysis.field_goals_extra_points AS aa_fgxp
    INNER JOIN reporting.plays AS rep_plays ON aa_fgxp.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_players ON aa_fgxp.kicker = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- FG XPs 42,476
CALL reporting.migrate_fg_xp();

CREATE OR REPLACE PROCEDURE reporting.migrate_fumbles()
AS $$
BEGIN
  TRUNCATE reporting.fumbles;

  INSERT INTO reporting.fumbles (id_play, fumbler, recovering_player, return_yardage, forcing_player)
  SELECT
    rep_plays.id_play         AS id_play,
    rep_fumbler.id_player     AS fumbler,
    rep_recoverer.id_player   AS recovering_player,
    aa_fumbles.return_yardage AS return_yardage,
    rep_forcer.id_player      AS forcing_player
  FROM
    armchair_analysis.fumbles AS aa_fumbles
    INNER JOIN reporting.plays AS rep_plays ON aa_fumbles.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_fumbler ON aa_fumbles.fumbler = rep_fumbler.aa_player_id
    LEFT JOIN reporting.players AS rep_recoverer ON aa_fumbles.recovering_player = rep_recoverer.aa_player_id
    LEFT JOIN reporting.players AS rep_forcer ON aa_fumbles.forcing_player = rep_forcer.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 14,674
CALL reporting.migrate_fumbles();

CREATE OR REPLACE PROCEDURE reporting.migrate_injuries()
AS $$
BEGIN
  TRUNCATE reporting.injuries;

  INSERT INTO reporting.injuries (id_game, player, team, details, practice_status, game_status)
  SELECT
    rep_games.id_game     AS id_game,
    rep_player.id_player  AS player,
    aa_injuries.team, aa_injuries.details, aa_injuries.practice_status, aa_injuries.game_status
  FROM
    armchair_analysis.injuries AS aa_injuries
    LEFT JOIN reporting.games AS rep_games ON aa_injuries.game_id = rep_games.aa_game_id
    LEFT JOIN reporting.players AS rep_player ON aa_injuries.player = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 25,205
CALL reporting.migrate_injuries();


CREATE OR REPLACE PROCEDURE reporting.migrate_interceptions()
AS $$
BEGIN
  TRUNCATE reporting.interceptions;

  INSERT INTO reporting.interceptions (id_play, passer, interceptor, return_yardage)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_passer.id_player  AS passer,
    rep_interceptor.id_player AS interceptor,
    return_yardage
  FROM
    armchair_analysis.interceptions AS aa_ints
    LEFT JOIN reporting.plays AS rep_plays ON aa_ints.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_passer ON aa_ints.passer = rep_passer.aa_player_id
    LEFT JOIN reporting.players AS rep_interceptor ON aa_ints.interceptor = rep_interceptor.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 9779
CALL reporting.migrate_interceptions();

CREATE OR REPLACE PROCEDURE reporting.migrate_kickers()
AS $$
BEGIN
  TRUNCATE reporting.kickers;

  INSERT INTO reporting.kickers (id_game, player, pats, field_goals_short, field_goals_med, field_goals_long, fantasy_points, player_game_number, seasons_played, year, team)
  SELECT
    rep_games.id_game     AS id_game,
    rep_player.id_player  AS player,
    pats, field_goals_short, field_goals_med, field_goals_long, fantasy_points, player_game_number, seasons_played, year, team
  FROM
    armchair_analysis.kickers AS aa_kickers
    INNER  JOIN reporting.games AS rep_games ON aa_kickers.game_id = rep_games.aa_game_id
    INNER JOIN reporting.players AS rep_player ON aa_kickers.player = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 10020
CALL reporting.migrate_kickers();

CREATE OR REPLACE PROCEDURE reporting.migrate_kickoffs()
AS $$
BEGIN
  TRUNCATE reporting.kickoffs;

  INSERT INTO reporting.kickoffs (id_play, kicker, gross_yardage, net_yardage, touchback, returner, return_yardage)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_kicker.id_player  AS kicker,
    gross_yardage, net_yardage, touchback, rep_returner.id_player AS returner, return_yardage
  FROM
    armchair_analysis.kickoffs AS aa_kickoffs
    INNER JOIN reporting.plays AS rep_plays ON aa_kickoffs.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_kicker ON aa_kickoffs.kicker = rep_kicker.aa_player_id
    LEFT JOIN reporting.players AS rep_returner ON aa_kickoffs.returner = rep_returner.aa_player_id;


END;
$$ LANGUAGE plpgsql;

-- 50047
CALL reporting.migrate_kickoffs();


CREATE OR REPLACE PROCEDURE reporting.migrate_offense()
AS $$
BEGIN
  TRUNCATE reporting.offense;

  INSERT INTO reporting.offense (id_game, player, passing_attempts, passing_completions, passing_yardage, interceptions, passing_touchdowns, rushing_attempts, successful_rushing_attempts, rushing_yardage, rushing_touchdowns, times_targeted, receptions, receiving_yardage, receiving_touchdowns, returns, return_yardage, return_touchdowns, fumbles_lost, penalty_yardage, conversion, snaps, fantasy_points_nfl, fantasy_points_fd, fantasy_points_dk, player_game_number, seasons_played, year, team, position_depth_chart, jersey_number, depth_chart, nfl_player_id)
  SELECT
    rep_games.id_game,
    rep_players.id_player,
    passing_attempts, passing_completions, passing_yardage, interceptions, passing_touchdowns, rushing_attempts, successful_rushing_attempts, rushing_yardage, rushing_touchdowns, times_targeted, receptions, receiving_yardage, receiving_touchdowns, returns, return_yardage, return_touchdowns, fumbles_lost, penalty_yardage, conversion, snaps, fantasy_points_nfl, fantasy_points_fd, fantasy_points_dk, player_game_number, seasons_played, year, team, aa_off.position_depth_chart, aa_off.jersey_number, aa_off.depth_chart, aa_off.nfl_player_id
  FROM
    armchair_analysis.offense AS aa_off
    INNER JOIN reporting.games AS rep_games ON aa_off.game_id = rep_games.aa_game_id
    INNER JOIN reporting.players AS rep_players ON aa_off.player = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 105456
CALL reporting.migrate_offense();

CREATE OR REPLACE PROCEDURE reporting.migrate_passes()
AS $$
BEGIN
  TRUNCATE reporting.passes;

  INSERT INTO reporting.passes (id_play, passer, target, defender, location, yards, completed, successful_play, spiked_ball)
  SELECT
    rep_plays.id_play    	AS id_play,
    rep_passer.id_player 	AS	passer,
	rep_target.id_player 	AS	target,
	rep_defender.id_player	AS	defender,
	location, yards, completed, successful_play, spiked_ball
  FROM
    armchair_analysis.passes AS aa_passes
	INNER JOIN reporting.plays AS rep_plays ON aa_passes.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_passer ON aa_passes.passer = rep_passer.aa_player_id
    LEFT JOIN reporting.players AS rep_target ON aa_passes.target = rep_target.aa_player_id
	LEFT JOIN reporting.players AS rep_defender ON aa_passes.defender = rep_defender.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 341,122
CALL reporting.migrate_passes();

CREATE OR REPLACE PROCEDURE reporting.migrate_penalties()
AS $$
BEGIN
  TRUNCATE reporting.penalties;

  INSERT INTO reporting.penalties (id_play, flagged_team, flagged_player, description, category, assessed_yardage, action)
  SELECT
    rep_plays.id_play     AS id_play,
    aa_penalties.flagged_team,
    rep_player.id_player  AS flagged_player,
    aa_penalties.description, category, assessed_yardage, action
  FROM
    armchair_analysis.penalties AS aa_penalties
    INNER JOIN reporting.plays AS rep_plays ON aa_penalties.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_player ON aa_penalties.flagged_player = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 75268
CALL reporting.migrate_penalties();

CREATE OR REPLACE PROCEDURE reporting.migrate_punts()
AS $$
BEGIN
  TRUNCATE reporting.punts;

  INSERT INTO reporting.punts (id_play, punter, returner, gross_yardage, net_yardage, touchback, return_yardage, fair_caught)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_punter.id_player  AS punter,
    rep_returner.id_player AS returner,
    gross_yardage, net_yardage, touchback, return_yardage, fair_caught
  FROM
    armchair_analysis.punts AS aa_punts
    INNER JOIN reporting.plays AS rep_plays ON aa_punts.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_punter ON aa_punts.punter = rep_punter.aa_player_id
    LEFT JOIN reporting.players AS rep_returner ON aa_punts.returner = rep_returner.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 48265
CALL reporting.migrate_punts();

CREATE OR REPLACE PROCEDURE reporting.migrate_redzone()
AS $$
BEGIN
  TRUNCATE reporting.redzone_appearances;

  INSERT INTO reporting.redzone_appearances (id_game, player, passing_attempts, passing_completions, passing_yardagey, interceptions, rushing_attempts, successful_rushing_attempts, rushing_yardage, times_targeted, receptions, receiving_yardage, fumbles_lost, penalty_yardage)
  SELECT
    rep_games.id_game,
    rep_players.id_player,
    passing_attempts, passing_completions, passing_yardage, interceptions, rushing_attempts, successful_rushing_attempts, rushing_yardage, times_targeted, receptions, receiving_yardage, fumbles_lost, penalty_yardage
  FROM
    armchair_analysis.redzone_appearances AS aa_rz
    INNER JOIN reporting.games AS rep_games ON aa_rz.game_id = rep_games.aa_game_id
    LEFT JOIN reporting.players AS rep_players ON aa_rz.player = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.redzone_appearances;
SELECT COUNT(0) FROM reporting.redzone_appearances;

-- 51344
CALL reporting.migrate_redzone();

CREATE OR REPLACE PROCEDURE reporting.migrate_rushes()
AS $$
BEGIN
  TRUNCATE reporting.rushes;

  INSERT INTO reporting.rushes (id_play, ball_carrier, rush_direction, yards_gained, successful_play, kneel_down)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_rusher.id_player  AS ball_carrier,
    rush_direction, yards_gained, successful_play, kneel_down
  FROM
    armchair_analysis.rushes AS aa_rushes
    INNER JOIN reporting.plays AS rep_plays ON aa_rushes.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_rusher ON aa_rushes.ball_carrier = rep_rusher.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.rushes;
SELECT COUNT(0) FROM reporting.rushes;

-- 275842
CALL reporting.migrate_rushes();

CREATE OR REPLACE PROCEDURE reporting.migrate_sacks()
AS $$
BEGIN
  TRUNCATE reporting.sacks;

  INSERT INTO reporting.sacks (id_play, quarter_back, sacking_player, value, yards_lost)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_qb.id_player  AS quarter_back,
    rep_sacker.id_player AS sacking_player,
    value, yards_lost
  FROM
    armchair_analysis.sacks AS aa_sacks
    INNER JOIN reporting.plays AS rep_plays ON aa_sacks.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_qb ON aa_sacks.quarter_back = rep_qb.aa_player_id
    LEFT JOIN reporting.players AS rep_sacker ON aa_sacks.sacking_player = rep_sacker.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.sacks;
SELECT COUNT(0) FROM reporting.sacks;

-- 25226
CALL reporting.migrate_sacks();

CREATE OR REPLACE PROCEDURE reporting.migrate_safeties()
AS $$
BEGIN
  TRUNCATE reporting.safeties;

  INSERT INTO reporting.safeties (id_play, defender)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_player.id_player  AS defender
  FROM
    armchair_analysis.safeties AS aa_safeties
    INNER JOIN reporting.plays AS rep_plays ON aa_safeties.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_player ON aa_safeties.defender = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.safeties;
SELECT COUNT(0) FROM reporting.safeties;

-- 170
CALL reporting.migrate_safeties();

CREATE OR REPLACE PROCEDURE reporting.migrate_schedule()
AS $$
BEGIN
  TRUNCATE reporting.schedule;

  INSERT INTO reporting.schedule (id_game, season, week, day, date, visitor, home, stadium, surface)
  SELECT
    rep_games.id_game     AS id_game,
    aa_schedule.season, aa_schedule.week, aa_schedule.day, date, visitor, home, aa_schedule.stadium, aa_schedule.surface
  FROM
    armchair_analysis.schedule AS aa_schedule
    INNER JOIN reporting.games AS rep_games ON aa_schedule.game_id = rep_games.aa_game_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.schedule;
SELECT COUNT(0) FROM reporting.schedule;

-- 5057
CALL reporting.migrate_schedule();

CREATE OR REPLACE PROCEDURE reporting.migrate_snaps()
AS $$
BEGIN
  TRUNCATE reporting.snaps;

  INSERT INTO reporting.snaps (id_game, team, player, position_depth_chart, position_starting, snaps)
  SELECT
    rep_games.id_game     AS id_game,
    aa_snaps.team,
    rep_player.id_player  AS player,
    aa_snaps.position_depth_chart, position_starting, snaps
  FROM
    armchair_analysis.snaps AS aa_snaps
    INNER JOIN reporting.games AS rep_games ON aa_snaps.game_id = rep_games.aa_game_id
    INNER JOIN reporting.players AS rep_player ON aa_snaps.player = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.snaps;
SELECT COUNT(0) FROM reporting.snaps;

-- 137382
CALL reporting.migrate_snaps();

CREATE OR REPLACE PROCEDURE reporting.migrate_tackles()
AS $$
BEGIN
  TRUNCATE reporting.tackles;

  INSERT INTO reporting.tackles (id_play, tackler, value)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_player.id_player  AS player,
    aa_tackles.value
  FROM
    armchair_analysis.tackles AS aa_tackles
    INNER JOIN reporting.plays AS rep_plays ON aa_tackles.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_player ON aa_tackles.tackler = rep_player.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.tackles;
SELECT COUNT(0) FROM reporting.tackles;

-- 546930
CALL reporting.migrate_tackles();

CREATE OR REPLACE PROCEDURE reporting.migrate_team_totals()
AS $$
BEGIN
  TRUNCATE reporting.team_totals;

  INSERT INTO reporting.team_totals (id_game, team_name, points, points_quarter_one, points_quarter_two, points_quarter_three, points_quarter_four, first_downs_rushing, first_downs_passing, first_downs_penalty, rushing_yardage, rushing_attempts, passing_yardage, passing_attempts, passing_completions, sacks_against, interceptions, fumbles_lost, punts, gross_punt_yardage, punt_returns, punt_return_yardage, kickoff_returns, kickoff_return_yardage, interception_returns, interception_return_yardage, penalty_yardage_against, time_of_possession, touchdowns, rushing_touchdowns, passing_touchdowns, turnover_touchdowns, field_goals_made, field_goal_attempts, field_goal_yardage, redzone_drives, redzone_touchdowns, big_rush_yardage, big_pass_yardage, successful_rush_plays, successful_rush_firstdown, successful_rush_seconddown, successful_rush_thirddownplus, successful_pass_plays, successful_pass_firstdown, successful_pass_seconddown, successful_pass_thirddownplus, rushing_attempts_leftend, rushing_yardage_leftend, rushing_attempts_lefttackle, rushing_yardage_lefttackle, rushing_attempts_leftguard, rushing_yardage_leftguard, rushing_attempts_middle, rushing_yardage_middle, rushing_attempts_rightguard, rushing_yardage_rightguard, rushing_attempts_righttackle, rushing_yardage_righttackle, rushing_attempts_rightend, rushing_yardage_rightend, rushing_attempts_firstdown, rushing_yardage_firstdown, rushing_attempts_seconddown, rushing_yardage_seconddown, rushing_attempts_thirddownplus, rushing_yardage_thirddownplus, rushing_attempts_quarterback, rushing_yardage_quarterback, passing_attempts_shortleft, passing_yardage_shortleft, passing_attempts_shortmiddle, passing_yardage_shortmiddle, passing_attempts_shortright, passing_yardage_shortright, passing_attempts_deepleft, passing_yardage_deepleft, passing_attempts_deepmedium, passing_yardage_deepmedium, passing_attempts_deepright, passing_yardage_deepright, passing_attempts_wr1_2, passing_yardage_wr1_2, passing_attempts_wr3_4_5, passing_yardage_wr3_4_5, passing_attempts_tightend, passing_yardage_tightend, passing_attempts_runningback, passing_yardage_runningback, passing_shotgun_attempts, passing_shotgun_yardage, passing_attempts_firstdown, passing_yardage_firstdown, passing_attempts_seconddown, passing_yardage_seconddown, passing_attempts_thirddownplus, passing_yardage_thirddownplus, passing_completions_short, passing_completions_medium, passing_completions_long, rushing_attempts_quarter_one, rushing_yardage_quarter_one, passing_attempts_quarter_one, passing_yardage_quarter_one, rushing_attempts_lateclose, rushing_yardage_lateclose, passing_attempts_lateclose, passing_yardage_lateclose, rushing_attempts_redzone, rushing_yardage_redzone, passing_attempts_redzone, passing_yardage_redzone, yardage_lost_to_sacks, sacks_by_lbs, sacks_by_dbs, starting_field_position, drives_on_offense, net_punt_yardage, touchbacks, punts_inside_20, return_touchdowns, rushing_tackles_defensiveline, passing_tackles_defensiveline, rushing_tackles_linebackers, passing_tackles_linebackers, rushing_tackles_defensivebacks, passing_tackles_defensivebacks, no_huddle_attempts, third_and_short_attempts, third_and_short_conversions, third_and_long_attempts, third_and_long_conversions, stuffed_runs, points_by_defense, false_starts, penalty_offensive_holds, penalty_playbook_execution, penalty_defensive_line, penalty_defensive_secondary, penalty_dumb, poor_fundamental, snaps_on_offense, snaps_on_defense, safeties_own_defense, blocks_own_defense, defense_st_points, men_in_box_4, men_in_box_4_yardage, men_in_box_5, men_in_box_5_yardage, men_in_box_6, men_in_box_6_yardage, men_in_box_7, men_in_box_7_yardage, men_in_box_8plus, men_in_box_8plus_yardage, available_targets_1, available_targets_1_yardage, available_targets_2, available_targets_2_yardage, available_targets_3, available_targets_3_yardage, available_targets_4, available_targets_4_yardage, available_targets_5, available_targets_5_yardage, pass_rushers_3, pass_rushers_3_yardage, pass_rushers_4, pass_rushers_4_yardage, pass_rushers_5plus, pass_rushers_5plus_yardage, pass_rusher_stunt_1, pass_rusher_stunt_1_yardage, pass_rusher_stunt_2, pass_rusher_stunt_2_yardage, quarterback_scrambles, quarterback_scrambles_yardage, blitzers_none, blitzers_none_yardage, blitzers_1, blitzers_1_yardage, blitzers_2, blitzers_2_yardage, blitzers_db_1, blitzers_db_1_yardage, time_to_sack, play_action_pass, play_action_pass_yardage, sideline_pass, sideline_pass_yardage, highlight_pass, highlight_pass_yardage, out_of_pocket_pass, out_of_pocket_pass_yardage, shovel_pass, shovel_pass_yardage, screen_pass, screen_pass_yardage, qb_pressure_none, qb_pressure_none_yardage, qb_pressure, qb_pressure_yardage, qb_hit, qb_hit_yardage, qb_hurry, qb_hurry_yardage, qb_hindered_throw, qb_hindered_throw_yardage, total_yards_to_go_first, total_yards_to_go_second, total_yards_to_go_thirdplus, total_true_air_yards_first, total_true_air_yards_second, total_true_air_yards_thirdplus, total_depth_of_target_first, total_depth_of_target_second, total_depth_of_target_thirdplus, target_depth_rank_1, target_depth_rank_1_yardage, target_depth_rank_2, target_depth_rank_2_yardage, target_depth_rank_3, target_depth_rank_3_yardage, target_depth_rank_4plus, target_depth_rank_4plus_yardage, target_not_covered, target_not_covered_yardage, target_single_coverage, target_single_coverage_yardage, target_double_covered, target_double_covered_yardage, contested_balls, contested_balls_with_completion, created_reception, created_reception_yardage, total_yards_after_catch_first, total_yards_after_catch_second, total_yards_after_catch_thridplus, receiver_drops, qb_throw_aways, batted_balls, int_worthy_passes, int_worthy_passes_intercepted, players_in_backfield_0, players_in_backfield_0_yardage, players_in_backfield_1, players_in_backfield_1_yardage, players_in_backfield_2, players_in_backfield_2_yardage, players_in_backfield_3plus, players_in_backfield_3plus_yardage, personnel_11, personnel_11_yardage, personnel_12, personnel_12_yardage, personnel_21, personnel_21_yardage, personnel_22, personnel_22_yardage, personnel_13, personnel_13_yardage, personnel_10, personnel_10_yardage)
  SELECT
    rep_games.id_game     AS id_game,
    team_name, points, points_quarter_one, points_quarter_two, points_quarter_three, points_quarter_four, first_downs_rushing, first_downs_passing, first_downs_penalty, rushing_yardage, rushing_attempts, passing_yardage, passing_attempts, passing_completions, sacks_against, interceptions, fumbles_lost, punts, gross_punt_yardage, punt_returns, punt_return_yardage, kickoff_returns, kickoff_return_yardage, interception_returns, interception_return_yardage, penalty_yardage_against, time_of_possession, touchdowns, rushing_touchdowns, passing_touchdowns, turnover_touchdowns, field_goals_made, field_goal_attempts, field_goal_yardage, redzone_drives, redzone_touchdowns, big_rush_yardage, big_pass_yardage, successful_rush_plays, successful_rush_firstdown, successful_rush_seconddown, successful_rush_thirddownplus, successful_pass_plays, successful_pass_firstdown, successful_pass_seconddown, successful_pass_thirddownplus, rushing_attempts_leftend, rushing_yardage_leftend, rushing_attempts_lefttackle, rushing_yardage_lefttackle, rushing_attempts_leftguard, rushing_yardage_leftguard, rushing_attempts_middle, rushing_yardage_middle, rushing_attempts_rightguard, rushing_yardage_rightguard, rushing_attempts_righttackle, rushing_yardage_righttackle, rushing_attempts_rightend, rushing_yardage_rightend, rushing_attempts_firstdown, rushing_yardage_firstdown, rushing_attempts_seconddown, rushing_yardage_seconddown, rushing_attempts_thirddownplus, rushing_yardage_thirddownplus, rushing_attempts_quarterback, rushing_yardage_quarterback, passing_attempts_shortleft, passing_yardage_shortleft, passing_attempts_shortmiddle, passing_yardage_shortmiddle, passing_attempts_shortright, passing_yardage_shortright, passing_attempts_deepleft, passing_yardage_deepleft, passing_attempts_deepmedium, passing_yardage_deepmedium, passing_attempts_deepright, passing_yardage_deepright, passing_attempts_wr1_2, passing_yardage_wr1_2, passing_attempts_wr3_4_5, passing_yardage_wr3_4_5, passing_attempts_tightend, passing_yardage_tightend, passing_attempts_runningback, passing_yardage_runningback, passing_shotgun_attempts, passing_shotgun_yardage, passing_attempts_firstdown, passing_yardage_firstdown, passing_attempts_seconddown, passing_yardage_seconddown, passing_attempts_thirddownplus, passing_yardage_thirddownplus, passing_completions_short, passing_completions_medium, passing_completions_long, rushing_attempts_quarter_one, rushing_yardage_quarter_one, passing_attempts_quarter_one, passing_yardage_quarter_one, rushing_attempts_lateclose, rushing_yardage_lateclose, passing_attempts_lateclose, passing_yardage_lateclose, rushing_attempts_redzone, rushing_yardage_redzone, passing_attempts_redzone, passing_yardage_redzone, yardage_lost_to_sacks, sacks_by_lbs, sacks_by_dbs, starting_field_position, drives_on_offense, net_punt_yardage, touchbacks, punts_inside_20, return_touchdowns, rushing_tackles_defensiveline, passing_tackles_defensiveline, rushing_tackles_linebackers, passing_tackles_linebackers, rushing_tackles_defensivebacks, passing_tackles_defensivebacks, no_huddle_attempts, third_and_short_attempts, third_and_short_conversions, third_and_long_attempts, third_and_long_conversions, stuffed_runs, points_by_defense, false_starts, penalty_offensive_holds, penalty_playbook_execution, penalty_defensive_line, penalty_defensive_secondary, penalty_dumb, poor_fundamental, snaps_on_offense, snaps_on_defense, safeties_own_defense, blocks_own_defense, defense_st_points, men_in_box_4, men_in_box_4_yardage, men_in_box_5, men_in_box_5_yardage, men_in_box_6, men_in_box_6_yardage, men_in_box_7, men_in_box_7_yardage, men_in_box_8plus, men_in_box_8plus_yardage, available_targets_1, available_targets_1_yardage, available_targets_2, available_targets_2_yardage, available_targets_3, available_targets_3_yardage, available_targets_4, available_targets_4_yardage, available_targets_5, available_targets_5_yardage, pass_rushers_3, pass_rushers_3_yardage, pass_rushers_4, pass_rushers_4_yardage, pass_rushers_5plus, pass_rushers_5plus_yardage, pass_rusher_stunt_1, pass_rusher_stunt_1_yardage, pass_rusher_stunt_2, pass_rusher_stunt_2_yardage, quarterback_scrambles, quarterback_scrambles_yardage, blitzers_none, blitzers_none_yardage, blitzers_1, blitzers_1_yardage, blitzers_2, blitzers_2_yardage, blitzers_db_1, blitzers_db_1_yardage, time_to_sack, play_action_pass, play_action_pass_yardage, sideline_pass, sideline_pass_yardage, highlight_pass, highlight_pass_yardage, out_of_pocket_pass, out_of_pocket_pass_yardage, shovel_pass, shovel_pass_yardage, screen_pass, screen_pass_yardage, qb_pressure_none, qb_pressure_none_yardage, qb_pressure, qb_pressure_yardage, qb_hit, qb_hit_yardage, qb_hurry, qb_hurry_yardage, qb_hindered_throw, qb_hindered_throw_yardage, total_yards_to_go_first, total_yards_to_go_second, total_yards_to_go_thirdplus, total_true_air_yards_first, total_true_air_yards_second, total_true_air_yards_thirdplus, total_depth_of_target_first, total_depth_of_target_second, total_depth_of_target_thirdplus, target_depth_rank_1, target_depth_rank_1_yardage, target_depth_rank_2, target_depth_rank_2_yardage, target_depth_rank_3, target_depth_rank_3_yardage, target_depth_rank_4plus, target_depth_rank_4plus_yardage, target_not_covered, target_not_covered_yardage, target_single_coverage, target_single_coverage_yardage, target_double_covered, target_double_covered_yardage, contested_balls, contested_balls_with_completion, created_reception, created_reception_yardage, total_yards_after_catch_first, total_yards_after_catch_second, total_yards_after_catch_thridplus, receiver_drops, qb_throw_aways, batted_balls, int_worthy_passes, int_worthy_passes_intercepted, players_in_backfield_0, players_in_backfield_0_yardage, players_in_backfield_1, players_in_backfield_1_yardage, players_in_backfield_2, players_in_backfield_2_yardage, players_in_backfield_3plus, players_in_backfield_3plus_yardage, personnel_11, personnel_11_yardage, personnel_12, personnel_12_yardage, personnel_21, personnel_21_yardage, personnel_22, personnel_22_yardage, personnel_13, personnel_13_yardage, personnel_10, personnel_10_yardage
  FROM
    armchair_analysis.team_totals AS aa_team_totals
    INNER JOIN reporting.games AS rep_games ON aa_team_totals.game_id = rep_games.aa_game_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.team_totals;
SELECT COUNT(0) FROM reporting.team_totals;

-- 10114
CALL reporting.migrate_team_totals();

CREATE OR REPLACE PROCEDURE reporting.migrate_touchdowns()
AS $$
BEGIN
  TRUNCATE reporting.touchdowns;

  INSERT INTO reporting.touchdowns (id_play, scoring_player, quarter, minutes, seconds, down, yards, points, type)
  SELECT
    rep_plays.id_play     AS id_play,
    rep_player.id_player  AS scoring_player,
    aa_touchdowns.quarter, aa_touchdowns.minutes, aa_touchdowns.seconds, aa_touchdowns.down, aa_touchdowns.yards, aa_touchdowns.points, aa_touchdowns.type
  FROM
    armchair_analysis.touchdowns AS aa_touchdowns
    INNER JOIN reporting.plays AS rep_plays ON aa_touchdowns.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_player ON aa_touchdowns.scoring_player = rep_player.aa_player_id;


END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.touchdowns;
SELECT COUNT(0) FROM reporting.touchdowns;

-- 24858
CALL reporting.migrate_touchdowns();

CREATE OR REPLACE PROCEDURE reporting.migrate_conversions()
AS $$
BEGIN
  TRUNCATE reporting.two_point_conversions;

  INSERT INTO reporting.two_point_conversions (id_play, type, ball_carrier, passer, pass_target, converted)
  SELECT
    rep_plays.id_play     AS id_play,
    aa_conversions.type,
    rep_rusher.id_player  AS ball_carrier,
    rep_passer.id_player  AS passer,
    rep_target.id_player  AS pass_target,
    converted
  FROM
    armchair_analysis.conversions AS aa_conversions
    INNER JOIN reporting.plays AS rep_plays ON aa_conversions.play_id = rep_plays.aa_play_id
    LEFT JOIN reporting.players AS rep_rusher ON aa_conversions.ball_carrier = rep_rusher.aa_player_id
    LEFT JOIN reporting.players AS rep_passer ON aa_conversions.passer = rep_passer.aa_player_id
    LEFT JOIN reporting.players AS rep_target ON aa_conversions.pass_target = rep_target.aa_player_id;

END;
$$ LANGUAGE plpgsql;

SELECT COUNT(0) FROM armchair_analysis.conversions;
SELECT COUNT(0) FROM reporting.two_point_conversions;

-- 1442
CALL reporting.migrate_conversions();

CREATE OR REPLACE PROCEDURE reporting.migrate_charts()
AS $$
BEGIN
  TRUNCATE reporting.charts;

  INSERT INTO reporting.charts (id_game, id_play, play_text, team_on_offense, team_on_defense, play_type, quarterback, pass_target, quarter, line_of_scrimmage, down, yards_to_go, yards_from_own_goal, field_zone, yardage, successful_play, first_down, shotgun, no_huddle, completion, interception, defenders_in_box, available_targets, pass_rushers, stunt_pass_rushers, total_blitzers, db_blitzers, time_to_sack, play_action_pass, sideline_pass, highlight_pass, out_of_pocket_pass, shovel_pass, screen_pass, quarterback_pressured, quarterback_hit, quarterback_hurried, throw_motion_hindered, true_air_yards, depth_of_target, depth_of_target_rank, coverage_of_target, contested_ball, created_reception, yards_after_catch, dropped_pass, thrown_away, batted_ball, interception_worthy, players_in_backfield, personnel_rb, personnel_te)
  SELECT
  	rep_plays.id_game		AS id_game,
    rep_plays.id_play       AS id_play,
	aa_charts.play_text,
	aa_charts.team_on_offense,
	aa_charts.team_on_defense,
	aa_charts.play_type,
    rep_qbs.id_player   	AS quarterback,
    rep_target.id_player 	AS pass_target,
    aa_charts.quarter, aa_charts.line_of_scrimmage, aa_charts.down, aa_charts.yards_to_go, aa_charts.yards_from_own_goal, aa_charts.field_zone, aa_charts.yardage, aa_charts.successful_play, aa_charts.first_down, aa_charts.shotgun, aa_charts.no_huddle, aa_charts.completion, aa_charts.interception, aa_charts.defenders_in_box, aa_charts.available_targets, aa_charts.pass_rushers, aa_charts.stunt_pass_rushers, aa_charts.total_blitzers, aa_charts.db_blitzers, aa_charts.time_to_sack, aa_charts.play_action_pass, aa_charts.sideline_pass, aa_charts.highlight_pass, aa_charts.out_of_pocket_pass, aa_charts.shovel_pass, aa_charts.screen_pass, aa_charts.quarterback_pressured, aa_charts.quarterback_hit, aa_charts.quarterback_hurried, aa_charts.throw_motion_hindered, aa_charts.true_air_yards, aa_charts.depth_of_target, aa_charts.depth_of_target_rank, aa_charts.coverage_of_target, aa_charts.contested_ball, aa_charts.created_reception, aa_charts.yards_after_catch, aa_charts.dropped_pass, aa_charts.thrown_away, aa_charts.batted_ball, aa_charts.interception_worthy, aa_charts.players_in_backfield, aa_charts.personnel_rb, aa_charts.personnel_te
  FROM
    armchair_analysis.charts AS aa_charts
    INNER JOIN reporting.plays AS rep_plays ON aa_charts.play_id = rep_plays.aa_play_id
    INNER JOIN reporting.players AS rep_qbs ON aa_charts.quarterback = rep_qbs.aa_player_id
    LEFT JOIN reporting.players AS rep_target ON aa_charts.pass_target = rep_target.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 20,618
CALL reporting.migrate_charts();

CREATE OR REPLACE PROCEDURE reporting.migrate_college()
AS $$
BEGIN
  TRUNCATE reporting.college;

  INSERT INTO reporting.college (ncaa_id, player, class, college, position, games_played, passing_completions, passing_attempts, passing_yardage, passing_touchdowns, interceptions_by_quarterback, passer_rating, rushing_attempts, rushing_yardage, rushing_touchdowns, receptions, receiving_touchdowns, receiving_yardage, solo_tackles, combined_tackles, tackles_for_loss, sacks, interceptions_by_defender, interception_return_yardage, interception_return_touchdowns, fumbles_recovered, fumble_return_yardage, fumble_return_touchdowns, fumbles_forced, point_after_attempts, point_after_made, field_goal_attempts, field_goal_made, kicker_points, punts, punt_yardage)
  SELECT
  	aa_college.ncaa_id,
    rep_players.id_player       AS player,
	aa_college.class, aa_college.college, aa_college.position, aa_college.games_played, aa_college.passing_completions, aa_college.passing_attempts, aa_college.passing_yardage, aa_college.passing_touchdowns, aa_college.interceptions_by_quarterback, aa_college.passer_rating, aa_college.rushing_attempts, aa_college.rushing_yardage, aa_college.rushing_touchdowns, aa_college.receptions, aa_college.receiving_touchdowns, aa_college.receiving_yardage, aa_college.solo_tackles, aa_college.combined_tackles, aa_college.tackles_for_loss, aa_college.sacks, aa_college.interceptions_by_defender, aa_college.interception_return_yardage, aa_college.interception_return_touchdowns, aa_college.fumbles_recovered, aa_college.fumble_return_yardage, aa_college.fumble_return_touchdowns, aa_college.fumbles_forced, aa_college.point_after_attempts, aa_college.point_after_made, aa_college.field_goal_attempts, aa_college.field_goal_made, aa_college.kicker_points, aa_college.punts, aa_college.punt_yardage
  FROM
    armchair_analysis.college AS aa_college
    LEFT JOIN reporting.players AS rep_players ON aa_college.player = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 28,739
CALL reporting.migrate_college();

CREATE OR REPLACE PROCEDURE reporting.migrate_twitter()
AS $$
BEGIN
  TRUNCATE reporting.twitter;

  INSERT INTO reporting.twitter (tweet_id, twitter_handle, first_name, last_name, player, created_at, tweet_text, source, times_favorited, times_retweeted)
  SELECT
    aa_twitter.tweet_id,
	aa_twitter.twitter_handle,
	aa_twitter.first_name,
	aa_twitter.last_name,
	rep_players.id_player,
	aa_twitter.created_at::date, aa_twitter.tweet_text, aa_twitter.source, aa_twitter.times_favorited, aa_twitter.times_retweeted
  FROM
    armchair_analysis.twitter AS aa_twitter
	LEFT JOIN reporting.players AS rep_players ON aa_twitter.player = rep_players.aa_player_id;

END;
$$ LANGUAGE plpgsql;

-- 727,562
CALL reporting.migrate_twitter();