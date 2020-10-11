import * as Knex from 'knex';
import { schemaName } from '../index';

/*
"SeasonType": 1,
"Season": 2019,
"Week": 7,
"Name": "Week 7",
"ShortName": "Week 7",
"StartDate": "2019-10-16T00:00:00",
"EndDate": "2019-10-22T23:59:59",
"FirstGameStart": "2019-10-17T20:20:00",
"FirstGameEnd": "2019-10-18T00:20:00",
"LastGameEnd": "2019-10-22T00:15:00",
"HasGames": true,
"HasStarted": true,
"HasEnded": true,
"HasFirstGameStarted": true,
"HasFirstGameEnded": true,
"HasLastGameEnded": true,
"ApiSeason": "2019REG",
"ApiWeek": "7"
*/

export function up(knex: Knex): Promise<any> {
  return knex.schema
    .withSchema(schemaName)
    .createTable('timeframes', (table) => {
      table.integer('season_type');
      table.integer('season');
      table.integer('week');
      table.string('name');
      table.string('short_name');
      table.dateTime('start_date');
      table.dateTime('end_date');
      table.dateTime('first_game_start');
      table.dateTime('first_game_end');
      table.dateTime('last_game_end');
      table.boolean('has_games');
      table.boolean('has_started');
      table.boolean('has_ended');
      table.boolean('has_first_game_started');
      table.boolean('has_first_game_ended');
      table.boolean('has_last_game_ended');
      table.string('api_season');
      table.string('api_week');
    });
}


export function down(knex: Knex): Promise<any> {
  return knex.schema
    .withSchema(schemaName)
    .dropTableIfExists('timeframes');
}