import { objectType } from '@nexus/schema';

const PersonName = objectType({
  name: 'PersonName',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.first();
    t.model.middle();
    t.model.last();
    t.model.suffix();
    t.model.nickname();
  }
});

const Person = objectType({
  name: 'Person',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.dob();
    t.string('ssn');
  }
});

export {
  Person,
  PersonName,
};
