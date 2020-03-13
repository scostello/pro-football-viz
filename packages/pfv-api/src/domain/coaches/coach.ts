import { objectType } from 'nexus';

const Coach = objectType({
  name: 'Coach',
  definition(t) {
    t.model.id();
    t.model.person();
  }
});

export { Coach };
