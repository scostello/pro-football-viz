import { objectType } from 'nexus';

const Executive = objectType({
  name: 'Executive',
  definition(t) {
    t.model.id();
    t.model.person();
  }
});

export { Executive };
