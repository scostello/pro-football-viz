import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

const toNumber = (value: any) => Number(value);

const bitToBoolean = (value: 0 | 1): boolean => value !== 0;

const isEmptyString = R.both(R.is(String), R.isEmpty);

const nullifyEmpty = R.ifElse(
  isEmptyString,
  R.always(null),
  R.identity,
);

const toBoolean = R.ifElse(
  isEmptyString,
  R.always(null),
  R.compose(bitToBoolean, toNumber),
);

const yesNoToBoolean = R.ifElse(
  (value: 'Y' | 'N') => value === 'Y',
  R.always(true),
  R.always(false),
);

const yesNullableToBoolean = R.ifElse(
  isEmptyString,
  R.always(null),
  (value: 'Y' | 'N') => value === 'Y',
)

type HeaderMap = { [columnName: string]: string | { name: string; transform?: (value: any) => any } };

interface CsvMappable {
  mapValues: (args: { header: string, value: any }) => any;
  mapHeaders: (args: { header: string }) => string;
}

class MappedTable implements CsvMappable {
  private _batchSize: number;

  private _tableName: string;

  private _headerMap: HeaderMap;

  private _newHeaders = {};

  constructor(tableName: string, headerMap: HeaderMap, batchSize: number = 1500) {
    this._tableName = tableName;
    this._headerMap = headerMap;
    this._batchSize = batchSize;
  }

  get batchSize() {
    return this._batchSize;
  }

  get tableName() {
    return this._tableName;
  }

  mapValues = ({ header, value }) => {
    const transform = this._newHeaders[header].transform || nullifyEmpty;
    return transform(value);
  }

  mapHeaders = ({ header }) => {

    const newHeader: string = R.and(RA.isPlainObject(this._headerMap[header]), R.has('name', this._headerMap[header]))
      ? R.prop('name', (this._headerMap as { name: string; transform?: (value: any) => any })[header])
      : this._headerMap[header];

    const transform = R.has('transform', this._headerMap[header])
      ? R.prop('transform', (this._headerMap as { name: string; transform?: (value: any) => any })[header])
      : nullifyEmpty;

    this._newHeaders[newHeader] = {
      transform,
    };

    return newHeader;
  }
}

const blocks = new MappedTable('blocks', {
  pid: 'id_play',
  blk: 'blocker',
  brcv: {
    name: 'recovering_player',
    transform: nullifyEmpty,
  },
  type: 'type',
});

const chart = new MappedTable('chart', {
  gid: 'id_game',
  pid: 'id_play',
  detail: 'play_text',
  off: 'team_on_offense',
  def: 'team_on_defense',
  type: 'play_type',
  qb: 'quarterback',
  trg: 'pass_target',
  bc: 'ball_carrier',
  qtr: 'quarter',
  los: 'line_of_scrimmage',
  dwn: 'down',
  ytg: 'yards_to_go',
  yfog: 'yards_from_own_goal',
  zone: 'field_zone',
  yds: 'yardage',
  succ: {
    name: 'successful_play',
    transform: toBoolean,
  },
  fd: {
    name: 'first_down',
    transform: toBoolean,
  },
  sg: {
    name: 'shotgun',
    transform: toBoolean,
  },
  nh: {
    name: 'no_huddle',
    transform: toBoolean,
  },
  comp: {
    name: 'completion',
    transform: toBoolean,
  },
  ints: {
    name: 'interception',
    transform: toBoolean,
  },
  back: 'players_in_backfield',
  xlm: 'extra_men_on_line',
  psmot: {
    name: 'pre_snap_motion',
    transform: toBoolean,
  },
  box: 'defenders_in_box',
  boxdb: 'dbs_in_box',
  pap: {
    name: 'play_action_pass',
    transform: toBoolean,
  },
  trick: {
    name: 'trick_play',
    transform: toBoolean,
  },
  qbp: {
    name: 'quarterback_pressured',
    transform: toBoolean,
  },
  qbhi: {
    name: 'quarterback_hit',
    transform: toBoolean,
  },
  qbhu: {
    name: 'quarterback_hurried',
    transform: toBoolean,
  },
  qbru: {
    name: 'quarterback_run',
    transform: toBoolean,
  },
  sneak: {
    name: 'quarterback_sneak',
    transform: toBoolean,
  },
  scrm: {
    name: 'quarterback_scramble',
    transform: toBoolean,
  },
  ttscrm: {
    name: 'time_to_scramble',
  },
  htm: {
    name: 'throw_motion_hindered',
    transform: toBoolean,
  },
  pru: 'pass_rushers',
  blz: 'total_blitzers',
  dblz: 'db_blitzers',
  spru: 'stunt_pass_rushers',
  oop: {
    name: 'out_of_pocket_pass',
    transform: toBoolean,
  },
  oopd: 'out_of_pocket_pass_detail',
  avt: 'available_targets',
  dotr: 'depth_of_target_rank',
  cov: 'coverage_of_target',
  phyb: {
    name: 'physical_ball',
    transform: toBoolean,
  },
  cnb: {
    name: 'contested_ball',
    transform: toBoolean,
  },
  cball: {
    name: 'catchable_ball',
    transform: toBoolean,
  },
  uball: {
    name: 'uncatchable_ball',
    transform: toBoolean,
  },
  shov: {
    name: 'shovel_pass',
    transform: toBoolean,
  },
  side: {
    name: 'sideline_pass',
    transform: toBoolean,
  },
  high: {
    name: 'highlight_pass',
    transform: toBoolean,
  },
  crr: {
    name: 'created_reception',
    transform: toBoolean,
  },
  intw: {
    name: 'interception_worthy',
    transform: toBoolean,
  },
  drp: {
    name: 'dropped_pass',
    transform: toBoolean,
  },
  avsck: {
    name: 'avoided_sacks',
    transform: toBoolean,
  },
  fread: {
    name: 'first_read',
    transform: toBoolean,
  },
  scre: {
    name: 'screen_pass',
    transform: toBoolean,
  },
  pfp: {
    name: 'pain_free_play',
    transform: toBoolean,
  },
  mbt: {
    name: 'missed_broken_tackles',
    transform: toBoolean,
  },
  ttsk: 'time_to_sack',
  ttpr: 'time_to_pressure',
  tay: 'true_air_yards',
  dot: 'depth_of_target',
  yac: 'yards_after_catch',
  yaco: 'yards_after_contact',
  ytru: 'yards_trucking',
  covdis1: 'coverage_distance_primary',
  covdis2: 'coverage_distance_secondary',
  defpr1: 'pressure_defender_primary',
  defpr2: 'pressure_defender_secondary',
  defhi: 'defender_code',
  defhu1: 'hurry_defender_primary',
  defhu2: 'hurry_defender_secondary',
}, 500);

const conversions = new MappedTable('conversions', {
  pid: 'id_play',
  type: 'play_type',
  bc: 'ball_carrier',
  psr: 'passer',
  trg: 'pass_target',
  conv: {
    name: 'converted',
    transform: toBoolean,
  },
});

const defense = new MappedTable('defense', {
  uid: 'uuid',
  gid: 'id_game',
  player: 'player',
  solo: 'solo_tackles',
  comb: 'combined_tackles',
  sck: 'sacks',
  saf: 'safeties',
  blk: 'blocked_kicks',
  ints: 'interceptions',
  pdef: 'passes_defended',
  frcv: 'fumbles_recovered',
  forc: 'fumbles_forced',
  tdd: 'touchdowns',
  rety: 'return_yardage',
  tdret: 'return_touchdowns',
  peny: 'penalty_yardage',
  snp: 'snaps',
  fp: 'fantasy_points_nfl',
  fp2: 'fantasy_points_fd_dk',
  game: 'player_game',
  seas: 'seasons_played',
  year: 'nfl_season',
  team: 'team',
  posd: 'position_depth_chart',
  jnum: 'jersey_number',
  dcp: 'depth_chart',
  nflid: 'nfl_player_id',
});

const drives = new MappedTable('drives', {
  uid: 'uuid',
  gid: 'id_game',
  fpid: 'first_play_id',
  tname: 'team',
  drvn: 'drive_number',
  obt: 'how_obtained',
  qtr: 'quarter',
  min: 'minutes',
  sec: 'seconds',
  yfog: 'starting_field_position',
  plays: 'plays',
  succ: 'successful_plays',
  rfd: 'rushing_first_downs',
  pfd: 'passing_first_downs',
  ofd: 'other_first_downs',
  ry: 'rushing_yardage',
  ra: 'rushing_attempts',
  py: 'passing_yardage',
  pa: 'passing_attempts',
  pc: 'passing_completions',
  peyf: 'penalty_yardage_for',
  peya: 'penalty_yardage_against',
  net: 'net_yardage',
  res: 'result',
});

const kickAttempts = new MappedTable('kick_attempts', {
  pid: 'id_play',
  fgxp: 'type',
  fkicker: 'kicker',
  dist: 'distance',
  good: {
    name: 'was_made',
    transform: toBoolean,
  },
});

const fumbles = new MappedTable('fumbles', {
  pid: 'id_play',
  fum: 'fumbler',
  frcv: 'recovering_player',
  fry: 'return_yardage',
  forc: 'forcing_player',
  fuml: {
    name: 'fumble_lost',
    transform: yesNoToBoolean,
  },
});

const games = new MappedTable('games', {
  gid: 'id_game',
  seas: 'season',
  wk: 'week',
  day: 'day',
  v: 'visiting_team',
  h: 'home_team',
  stad: 'stadium',
  temp: 'temperature',
  humd: 'humidity',
  wspd: 'wind_speed',
  wdir: 'wind_direction',
  cond: 'conditions',
  surf: 'surface',
  ou: 'over_under',
  sprv: 'vis_point_spread',
  ptsv: 'points_visitor',
  ptsh: 'points_home',
});

const injuries = new MappedTable('injuries', {
  uid: 'uuid',
  gid: 'id_game',
  player: 'player',
  team: 'team',
  details: 'details',
  pstat: 'practice_status',
  gstat: 'game_status',
});

const interceptions = new MappedTable('interceptions', {
  pid: 'id_play',
  psr: 'passer',
  ints: 'interceptor',
  iry: 'return_yardage',
});

const kickers = new MappedTable('kickers', {
  uid: 'uuid',
  gid: 'id_game',
  player: 'player',
  pat: 'pats',
  fgs: 'field_goals_short',
  fgm: 'field_goals_med',
  fgl: 'field_goals_long',
  fp: 'fantasy_points',
  game: 'player_game_number',
  seas: 'seasons_played',
  year: 'year',
  team: 'team',
});

const kickoffs = new MappedTable('kickoffs', {
  pid: 'id_play',
  kicker: 'kicker',
  kgro: 'gross_yardage',
  knet: 'net_yardage',
  ktb: {
    name: 'touchback',
    transform: toBoolean,
  },
  kr: 'returner',
  kry: 'return_yardage',
});

const offense = new MappedTable('offense', {
  uid: 'uuid',
  gid: 'id_game',
  player: 'player',
  pa: 'passing_attempts',
  pc: 'passing_completions',
  py: 'passing_yardage',
  ints: 'interceptions',
  tdp: 'passing_touchdowns',
  ra: 'rushing_attempts',
  sra: 'successful_rushing_attempts',
  ry: 'rushing_yardage',
  tdr: 'rushing_touchdowns',
  trg: 'times_targeted',
  rec: 'receptions',
  recy: 'receiving_yardage',
  tdrec: 'receiving_touchdowns',
  ret: 'returns',
  rety: 'return_yardage',
  tdret: 'return_touchdowns',
  fuml: 'fumbles_lost',
  peny: 'penalty_yardage',
  conv: 'conversion',
  snp: 'snaps',
  fp: 'fantasy_points_nfl',
  fp2: 'fantasy_points_fd',
  fp3: 'fantasy_points_dk',
  game: 'player_game_number',
  seas: 'seasons_played',
  year: 'year',
  team: 'team',
  posd: 'position_depth_chart',
  jnum: 'jersey_number',
  dcp: 'depth_chart',
  nflid: {
    name: 'nfl_player_id',
    transform: (value) => value !== 'CHECK'
      ? value
      : null,
  },
});

const passing = new MappedTable('passing', {
  pid: 'id_play',
  psr: 'passer',
  trg: 'target',
  loc: 'location',
  yds: 'yards',
  comp: {
    name: 'completed',
    transform: toBoolean,
  },
  succ: {
    name: 'successful_play',
    transform: toBoolean,
  },
  spk: {
    name: 'spiked_ball',
    transform: toBoolean,
  },
  dfb: 'defender',
});

const playByPlay = new MappedTable('play_by_play', {
  gid: 'id_game',
  pid: 'id_play',
  detail: 'play_text',
  off: 'team_on_offense',
  def: 'team_on_defense',
  type: 'play_type',
  dseq: 'drive_sequence_number',
  len: 'play_duration',
  qtr: 'quarter',
  min: 'minutes',
  sec: 'seconds',
  ptso: 'points_offense',
  ptsd: 'points_defense',
  timo: 'timeouts_offense',
  timd: 'timeouts_defense',
  dwn: 'down',
  ytg: 'yards_to_go',
  yfog: 'yards_from_own_goal',
  zone: 'field_zone',
  yds: 'yardage',
  succ: {
    name: 'successful_play',
    transform: yesNullableToBoolean,
  },
  fd: {
    name: 'first_down',
    transform: yesNullableToBoolean,
  },
  sg: {
    name: 'shotgun',
    transform: yesNullableToBoolean,
  },
  nh: {
    name: 'no_huddle',
    transform: yesNullableToBoolean,
  },
  pts: 'points_scored',
  bc: 'ball_carrier',
  kne: {
    name: 'took_knee',
    transform: yesNullableToBoolean,
  },
  dir: 'rush_direction',
  rtck1: 'rush_tackler_primary',
  rtck2: 'rush_tackler_seconday',
  psr: 'passer',
  comp: {
    name: 'completion',
    transform: yesNullableToBoolean,
  },
  spk: {
    name: 'spiked_ball',
    transform: yesNullableToBoolean,
  },
  loc: 'pass_location',
  trg: 'pass_target',
  dfb: 'pass_defender',
  ptck1: 'pass_tackler_primary',
  ptck2: 'pass_tackler_secondary',
  sk1: 'sacking_player_primary',
  sk2: 'sacking_player_secondary',
  ptm1: 'penalty_team_primary',
  pen1: 'penalty_player_primary',
  desc1: 'penalty_description_primary',
  cat1: 'penalty_category_primary',
  pey1: 'penalty_yards_primary',
  act1: 'penalty_action_primary',
  ptm2: 'penalty_team_secondary',
  pen2: 'penalty_player_secondary',
  desc2: 'penalty_description_secondary',
  cat2: 'penalty_category_secondary',
  pey2: 'penalty_yards_secondary',
  act2: 'penalty_action_secondary',
  ptm3: 'penalty_team_tertiary',
  pen3: 'penalty_player_tertiary',
  desc3: 'penalty_description_tertiary',
  cat3: 'penalty_category_tertiary',
  pey3: 'penalty_yards_tertiary',
  act3: 'penalty_action_tertiary',
  ints: 'intercepting_player',
  iry: 'interception_return_yardage',
  fum: 'fumbler',
  frcv: 'fumble_recoverer',
  fry: 'fumble_return_yardage',
  forc: 'fumble_forcer',
  fuml: {
    name: 'fumble_lost',
    transform: yesNullableToBoolean,
  },
  saf: 'safety_player',
  blk: 'kick_blocker',
  brcv: 'kick_block_recoverer',
  fgxp: 'fpxp_kick_type',
  fkicker: 'fpxp_kicker',
  dist: 'kick_distance',
  good: {
    name: 'kick_made',
    transform: yesNullableToBoolean,
  },
  punter: 'punter',
  pgro: 'punt_gross',
  pnet: 'punt_net',
  ptb: {
    name: 'punt_touchback',
    transform: yesNullableToBoolean,
  },
  pr: 'punt_returner',
  pry: 'punt_return_yardage',
  pfc: {
    name: 'fair_catch',
    transform: yesNullableToBoolean,
  },
  kicker: 'kickoff_kicker',
  kgro: 'kickoff_gross',
  knet: 'kickoff_net',
  ktb: {
    name: 'kickoff_touchback',
    transform: yesNullableToBoolean,
  },
  kr: 'kickoff_returner',
  kry: 'kickoff_return_yardage',
}, 500);

const penalties = new MappedTable('penalties', {
  uid: 'uuid',
  pid: 'id_play',
  ptm: 'flagged_team',
  pen: 'flagged_player',
  desc: 'description',
  cat: 'category',
  pey: 'assessed_yardage',
  act: 'action',
});

const plays = new MappedTable('plays', {
  gid: 'id_game',
  pid: 'id_play',
  off: 'team_on_offense',
  def: 'team_on_defense',
  type: 'play_type',
  dseq: 'drive_sequence',
  len: 'length_in_seconds',
  qtr: 'quarter',
  min: 'minutes',
  sec: 'seconds',
  ptso: 'points_offense',
  ptsd: 'points_defense',
  timo: 'timeouts_offense',
  timd: 'timeouts_defense',
  dwn: 'down',
  ytg: 'yards_to_go',
  yfog: 'yards_from_own_goaline',
  zone: 'field_zone',
  fd: {
    name: 'first_down',
    transform: toBoolean,
  },
  sg: {
    name: 'shotgun',
    transform: toBoolean,
  },
  nh: {
    name: 'no_huddle',
    transform: toBoolean,
  },
  pts: {
    name: 'points_scored',
    transform: toBoolean,
  },
  tck: {
    name: 'tackle_on_play',
    transform: toBoolean,
  },
  sk: {
    name: 'sack_on_play',
    transform: toBoolean,
  },
  pen: {
    name: 'penalty_on_play',
    transform: toBoolean,
  },
  ints: {
    name: 'interception_on_play',
    transform: toBoolean,
  },
  fum: {
    name: 'fumble_on_play',
    transform: toBoolean,
  },
  saf: {
    name: 'safety_on_play',
    transform: toBoolean,
  },
  blk: {
    name: 'block_on_play',
    transform: toBoolean,
  },
});

const players = new MappedTable('players', {
  player: 'id_player',
  fname: 'first_name',
  lname: 'last_name',
  pname: 'play_by_play_name',
  pos1: 'position_1',
  pos2: 'position_2',
  height: 'height',
  weight: 'weight',
  dob: 'date_of_birth',
  forty: 'forty',
  bench: 'bench',
  vertical: 'vertical',
  broad: 'broad',
  shuttle: 'shuttle',
  cone: 'cone',
  arm: 'arm_length',
  hand: 'hand_size',
  dpos: 'draft_position',
  col: 'college',
  dv: 'college_division',
  start: 'first_year',
  cteam: 'current_team',
  posd: 'position_depth_chart',
  jnum: 'jersey_number',
  dcp: 'depth_chart',
  nflid: 'nfl_player_id',
});

const punts = new MappedTable('punts', {
  pid: 'id_play',
  punter: 'punter',
  pgro: 'gross_yardage',
  pnet: 'net_yardage',
  ptb: {
    name: 'touchback',
    transform: toBoolean,
  },
  pr: 'returner',
  pry: 'return_yardage',
  pfc: {
    name: 'fair_caught',
    transform: toBoolean,
  },
});

const redzone = new MappedTable('redzone_appearances', {
  uid: 'uuid',
  gid: 'id_game',
  player: 'id_player',
  pa: 'passing_attempts',
  pc: 'passing_completions',
  py: 'passing_yardage',
  ints: 'interceptions',
  ra: 'rushing_attempts',
  sra: 'successful_rushing_attempts',
  ry: 'rushing_yardage',
  trg: 'times_targeted',
  rec: 'receptions',
  recy: 'receiving_yardage',
  fuml: 'fumbles_lost',
  peny: 'penalty_yardage',
});

const rushes = new MappedTable('rushes', {
  pid: 'id_play',
  bc: 'ball_carrier',
  dir: 'rush_direction',
  yds: 'yards_gained',
  succ: {
    name: 'successful_play',
    transform: toBoolean,
  },
  kne: {
    name: 'kneel_down',
    transform: toBoolean,
  }
});

const sacks = new MappedTable('sacks', {
  uid: 'uuid',
  pid: 'id_play',
  qb: 'quarter_back',
  sk: 'sacking_player',
  value: 'value',
  ydsl: 'yards_lost',
});

const safeties = new MappedTable('safeties', {
  pid: 'id_play',
  saf: 'defender',
});

const schedule = new MappedTable('schedules', {
  gid: 'id_game',
  seas: 'season',
  wk: 'week',
  day: 'day',
  date: 'date',
  v: 'visitor',
  h: 'home',
  stad: 'stadium',
  surf: 'surface',
});

const snaps = new MappedTable('snaps', {
  uid: 'uuid',
  gid: 'id_game',
  tname: 'team',
  player: 'player',
  posd: 'position_depth_chart',
  poss: 'position_starting_position',
  snp: 'snaps',
});

const tackles = new MappedTable('tackles', {
  uid: 'uuid',
  pid: 'id_play',
  tck: 'tackler',
  value: 'value',
});

const touchdowns = new MappedTable('touchdowns', {
  pid: 'id_play',
  qtr: 'quarter',
  min: 'minutes',
  sec: 'seconds',
  dwn: 'down',
  yds: 'yards',
  pts: 'points',
  player: 'scoring_player',
  type: 'type',
});

const mappers: { [entryPath: string]: MappedTable } = {
  'BLOCK.csv': blocks,
  'CHART.csv': chart,
  'CONV.csv': conversions,
  'DEFENSE.csv': defense,
  'DRIVE.csv': drives,
  'FGXP.csv': kickAttempts,
  'FUMBLE.csv': fumbles,
  'GAME.csv': games,
  'INJURY.csv': injuries,
  'INTERCPT.csv': interceptions,
  'KICKER.csv': kickers,
  'KOFF.csv': kickoffs,
  'OFFENSE.csv': offense,
  'PASS.csv': passing,
  'PBP.csv': playByPlay,
  'PENALTY.csv': penalties,
  'PLAY.csv': plays,
  'PLAYER.csv': players,
  'PUNT.csv': punts,
  'REDZONE.csv': redzone,
  'RUSH.csv': rushes,
  'SACK.csv': sacks,
  'SAFETY.csv': safeties,
  'SCHEDULE.csv': schedule,
  'SNAP.csv': snaps,
  'TACKLE.csv': tackles,
  'TD.csv': touchdowns,
};

const getMapper = (path: string) => mappers[path];

export { getMapper };
