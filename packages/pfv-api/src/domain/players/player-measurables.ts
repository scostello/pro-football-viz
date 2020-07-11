import { objectType } from '@nexus/schema';

const PlayerMeasurable = objectType({
  name: 'PlayerMeasurable',
  definition(t) {
    t.model.id();
    t.model.height();
    t.model.weight();
    t.model.forty();
    t.model.bench();
    t.model.vertical();
    t.model.broad();
    t.model.shuttle();
    t.model.cone();
    t.model.armLength();
    t.model.handSize();
    t.model.handed();
  }
});

export { PlayerMeasurable };
