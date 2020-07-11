import { objectType } from '@nexus/schema';

const Player = objectType({
  name: 'Player',
  definition(t) {
    t.model.id();
    t.model.person();
    t.model.measurable();
    t.model.college();
    t.model.nflPlayerId();
  },
});

export { Player };
