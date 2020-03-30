import Bluebird from 'bluebird';
import * as Knex from 'knex';
import { schemaName } from '../index';

export function up(knex: Knex): Bluebird<any> {
  return knex.schema
    .withSchema(schemaName)
    .createTable('blocks', (table) => {
      table.integer('id_play').notNullable();
      table.string('blocker');
      table.string('recovering_player');
      table.string('type');
    })
    .createTable('chart', (table) => {
      table.integer('id_game').notNullable();
      table.integer('id_play').notNullable();
      table.text('play_text');
      table.string('team_on_offense');
      table.string('team_on_defense');
      table.string('play_type');
      table.string('quarterback');
      table.string('pass_target');
      table.string('ball_carrier');
      table.string('quarter');
      table.string('line_of_scrimmage');
      table.float('down');
      table.float('yards_to_go');
      table.float('yards_from_own_goal');
      table.string('field_zone');
      table.float('yardage');
      table.boolean('successful_play');
      table.boolean('first_down');
      table.boolean('shotgun');
      table.boolean('no_huddle');
      table.boolean('completion');
      table.boolean('interception');
      table.integer('players_in_backfield');
      table.integer('extra_men_on_line');
      table.boolean('pre_snap_motion');
      table.integer('defenders_in_box');
      table.integer('dbs_in_box');
      table.boolean('play_action_pass');
      table.boolean('trick_play');
      table.boolean('quarterback_pressured');
      table.boolean('quarterback_hit');
      table.boolean('quarterback_hurried');
      table.boolean('quarterback_run');
      table.boolean('quarterback_sneak');
      table.boolean('quarterback_scramble');
      table.float('time_to_scramble');
      table.boolean('throw_motion_hindered');
      table.integer('pass_rushers');
      table.integer('total_blitzers');
      table.integer('db_blitzers');
      table.integer('stunt_pass_rushers');
      table.boolean('out_of_pocket_pass');
      table.text('out_of_pocket_pass_detail');
      table.string('available_targets');
      table.integer('depth_of_target_rank');
      table.string('coverage_of_target');
      table.boolean('physical_ball');
      table.boolean('contested_ball');
      table.boolean('catchable_ball');
      table.boolean('uncatchable_ball');
      table.boolean('shovel_pass');
      table.boolean('sideline_pass');
      table.boolean('highlight_pass');
      table.boolean('created_reception');
      table.boolean('interception_worthy');
      table.boolean('dropped_pass');
      table.boolean('avoided_sacks');
      table.boolean('first_read');
      table.boolean('screen_pass');
      table.boolean('pain_free_play');
      table.boolean('missed_broken_tackles');
      table.float('time_to_sack');
      table.float('time_to_pressure');
      table.float('true_air_yards');
      table.float('depth_of_target');
      table.float('yards_after_catch');
      table.float('yards_after_contact');
      table.float('yards_trucking');
      table.float('coverage_distance_primary');
      table.float('coverage_distance_secondary');
      table.string('pressure_defender_primary');
      table.string('pressure_defender_secondary');
      table.string('defender_code');
      table.string('hurry_defender_primary');
      table.string('hurry_defender_secondary');
    })
    .createTable('conversions', (table) => {
      table.integer('id_play').notNullable();
      table.string('play_type');
      table.string('ball_carrier');
      table.string('passer');
      table.string('pass_target');
      table.boolean('converted');
    })
    .createTable('defense', (table) => {
      table.string('uuid').notNullable();
      table.string('id_game').notNullable();
      table.string('player');
      table.float('solo_tackles');
      table.float('combined_tackles');
      table.float('sacks');
      table.integer('safeties');
      table.integer('blocked_kicks');
      table.integer('interceptions');
      table.integer('passes_defended');
      table.integer('fumbles_recovered');
      table.integer('fumbles_forced');
      table.integer('touchdowns');
      table.integer('return_yardage');
      table.integer('return_touchdowns');
      table.integer('penalty_yardage');
      table.integer('snaps');
      table.float('fantasy_points_nfl');
      table.float('fantasy_points_fd_dk');
      table.integer('player_game');
      table.integer('seasons_played');
      table.integer('nfl_season');
      table.string('team');
      table.string('position_depth_chart');
      table.integer('jersey_number');
      table.integer('depth_chart');
      table.integer('nfl_player_id');
    });
}

export function down(knex: Knex): Bluebird<any> {
  return knex.schema
    .withSchema(schemaName)
    .dropTableIfExists('blocks')
    .dropTableIfExists('chart')
    .dropTableIfExists('conversions');
}