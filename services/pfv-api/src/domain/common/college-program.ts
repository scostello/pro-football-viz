import { objectType } from '@nexus/schema';

const CollegeProgram = objectType({
  name: 'CollegeProgram',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.division();
    t.model.conference();
  }
});

export { CollegeProgram };
