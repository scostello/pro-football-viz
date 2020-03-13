import { objectType } from 'nexus';

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
