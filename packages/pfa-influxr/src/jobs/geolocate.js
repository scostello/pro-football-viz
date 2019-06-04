import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import S from 'sanctuary';
import massive from 'massive';
import { createClient } from '@google/maps';
import { stadiums } from './stadiums';

const mapsClient = createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise,
});

const mapJsonResults = S.props(['json', 'results']);

const getGeomLocation = S.props(['geometry', 'location']);

const fetchLocation = ({ team, query }) => Rx
  .from(mapsClient.places({ query })
    .asPromise()
    .then(response => ({
      response,
      team,
    })));

const saveStadium = ([location, db]) => Rx.from(db
  .reporting
  .stadiums
  .insert({ google_location: location }));

const db$ = Rx.from(massive({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB_NAME || 'postgres',
  user: process.env.PG_DB_USER || 'postgres',
  poolSize: 5,
}));

const location$ = Rx.from(stadiums)
  .pipe(
    RxOp.map(({ team, name }) => ({
      team,
      query: name,
    })),
    RxOp.mergeMap(fetchLocation),
    RxOp.mergeMap(({ response, team }) => Rx
      .from(mapJsonResults(response))
      .pipe(
        RxOp.first(),
        RxOp.map(result => ({
          ...result,
          teamAbbr: team,
        })),
      )),
    RxOp.withLatestFrom(db$),
    RxOp.mergeMap(saveStadium),
  )
  .subscribe(res => console.log(res));
