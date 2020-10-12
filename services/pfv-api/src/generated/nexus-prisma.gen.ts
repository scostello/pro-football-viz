import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  first?: boolean
  last?: boolean
  before?: boolean
  after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime'

// Prisma model type definitions
interface PrismaModels {
  PersonName: Prisma.PersonName
  Person: Prisma.Person
  PlayerMeasurable: Prisma.PlayerMeasurable
  Player: Prisma.Player
  CollegeProgram: Prisma.CollegeProgram
  Coach: Prisma.Coach
  Executive: Prisma.Executive
  LatLng: Prisma.LatLng
  Address: Prisma.Address
  Location: Prisma.Location
  Stadium: Prisma.Stadium
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    personNames: {
      filtering: 'id' | 'title' | 'first' | 'middle' | 'last' | 'suffix' | 'nickname' | 'Person' | 'AND' | 'OR' | 'NOT'
      ordering: 'id' | 'title' | 'first' | 'middle' | 'last' | 'suffix' | 'nickname'
    }
    people: {
      filtering: 'id' | 'idPersonName' | 'dob' | 'Player' | 'Coach' | 'Executive' | 'AND' | 'OR' | 'NOT' | 'name'
      ordering: 'id' | 'idPersonName' | 'dob'
    }
    playerMeasurables: {
      filtering: 'id' | 'height' | 'weight' | 'forty' | 'bench' | 'vertical' | 'broad' | 'shuttle' | 'cone' | 'armLength' | 'handSize' | 'handed' | 'Player' | 'AND' | 'OR' | 'NOT'
      ordering: 'id' | 'height' | 'weight' | 'forty' | 'bench' | 'vertical' | 'broad' | 'shuttle' | 'cone' | 'armLength' | 'handSize' | 'handed'
    }
    players: {
      filtering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
      ordering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId'
    }
    collegePrograms: {
      filtering: 'id' | 'name' | 'division' | 'conference' | 'yearFounded' | 'Player' | 'AND' | 'OR' | 'NOT'
      ordering: 'id' | 'name' | 'division' | 'conference' | 'yearFounded'
    }
    coaches: {
      filtering: 'id' | 'idPerson' | 'AND' | 'OR' | 'NOT' | 'person'
      ordering: 'id' | 'idPerson'
    }
    executives: {
      filtering: 'id' | 'idPerson' | 'AND' | 'OR' | 'NOT' | 'person'
      ordering: 'id' | 'idPerson'
    }
    latLngs: {
      filtering: 'id' | 'latitude' | 'longitude' | 'Location' | 'AND' | 'OR' | 'NOT'
      ordering: 'id' | 'latitude' | 'longitude'
    }
    addresses: {
      filtering: 'id' | 'streetAddress1' | 'streetAddress2' | 'city' | 'stateCode' | 'zipCode' | 'countryCode' | 'Location' | 'AND' | 'OR' | 'NOT'
      ordering: 'id' | 'streetAddress1' | 'streetAddress2' | 'city' | 'stateCode' | 'zipCode' | 'countryCode'
    }
    locations: {
      filtering: 'id' | 'idAddress' | 'idCoordinates' | 'Stadium' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
      ordering: 'id' | 'idAddress' | 'idCoordinates'
    }
    stadiums: {
      filtering: 'id' | 'idLocation' | 'capacity' | 'name' | 'yearOpened' | 'AND' | 'OR' | 'NOT' | 'location'
      ordering: 'id' | 'idLocation' | 'capacity' | 'name' | 'yearOpened'
    }
  },
  PersonName: {
    Person: {
      filtering: 'id' | 'idPersonName' | 'dob' | 'Player' | 'Coach' | 'Executive' | 'AND' | 'OR' | 'NOT' | 'name'
      ordering: 'id' | 'idPersonName' | 'dob'
    }
  }
  Person: {
    Player: {
      filtering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
      ordering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId'
    }
    Coach: {
      filtering: 'id' | 'idPerson' | 'AND' | 'OR' | 'NOT' | 'person'
      ordering: 'id' | 'idPerson'
    }
    Executive: {
      filtering: 'id' | 'idPerson' | 'AND' | 'OR' | 'NOT' | 'person'
      ordering: 'id' | 'idPerson'
    }
  }
  PlayerMeasurable: {
    Player: {
      filtering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
      ordering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId'
    }
  }
  Player: {

  }
  CollegeProgram: {
    Player: {
      filtering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
      ordering: 'id' | 'idPerson' | 'idMeasurables' | 'idCollege' | 'nflPlayerId'
    }
  }
  Coach: {

  }
  Executive: {

  }
  LatLng: {
    Location: {
      filtering: 'id' | 'idAddress' | 'idCoordinates' | 'Stadium' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
      ordering: 'id' | 'idAddress' | 'idCoordinates'
    }
  }
  Address: {
    Location: {
      filtering: 'id' | 'idAddress' | 'idCoordinates' | 'Stadium' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
      ordering: 'id' | 'idAddress' | 'idCoordinates'
    }
  }
  Location: {
    Stadium: {
      filtering: 'id' | 'idLocation' | 'capacity' | 'name' | 'yearOpened' | 'AND' | 'OR' | 'NOT' | 'location'
      ordering: 'id' | 'idLocation' | 'capacity' | 'name' | 'yearOpened'
    }
  }
  Stadium: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    personName: 'PersonName'
    personNames: 'PersonName'
    person: 'Person'
    people: 'Person'
    playerMeasurable: 'PlayerMeasurable'
    playerMeasurables: 'PlayerMeasurable'
    player: 'Player'
    players: 'Player'
    collegeProgram: 'CollegeProgram'
    collegePrograms: 'CollegeProgram'
    coach: 'Coach'
    coaches: 'Coach'
    executive: 'Executive'
    executives: 'Executive'
    latLng: 'LatLng'
    latLngs: 'LatLng'
    address: 'Address'
    addresses: 'Address'
    location: 'Location'
    locations: 'Location'
    stadium: 'Stadium'
    stadiums: 'Stadium'
  },
  Mutation: {
    createOnePersonName: 'PersonName'
    updateOnePersonName: 'PersonName'
    updateManyPersonName: 'BatchPayload'
    deleteOnePersonName: 'PersonName'
    deleteManyPersonName: 'BatchPayload'
    upsertOnePersonName: 'PersonName'
    createOnePerson: 'Person'
    updateOnePerson: 'Person'
    updateManyPerson: 'BatchPayload'
    deleteOnePerson: 'Person'
    deleteManyPerson: 'BatchPayload'
    upsertOnePerson: 'Person'
    createOnePlayerMeasurable: 'PlayerMeasurable'
    updateOnePlayerMeasurable: 'PlayerMeasurable'
    updateManyPlayerMeasurable: 'BatchPayload'
    deleteOnePlayerMeasurable: 'PlayerMeasurable'
    deleteManyPlayerMeasurable: 'BatchPayload'
    upsertOnePlayerMeasurable: 'PlayerMeasurable'
    createOnePlayer: 'Player'
    updateOnePlayer: 'Player'
    updateManyPlayer: 'BatchPayload'
    deleteOnePlayer: 'Player'
    deleteManyPlayer: 'BatchPayload'
    upsertOnePlayer: 'Player'
    createOneCollegeProgram: 'CollegeProgram'
    updateOneCollegeProgram: 'CollegeProgram'
    updateManyCollegeProgram: 'BatchPayload'
    deleteOneCollegeProgram: 'CollegeProgram'
    deleteManyCollegeProgram: 'BatchPayload'
    upsertOneCollegeProgram: 'CollegeProgram'
    createOneCoach: 'Coach'
    updateOneCoach: 'Coach'
    updateManyCoach: 'BatchPayload'
    deleteOneCoach: 'Coach'
    deleteManyCoach: 'BatchPayload'
    upsertOneCoach: 'Coach'
    createOneExecutive: 'Executive'
    updateOneExecutive: 'Executive'
    updateManyExecutive: 'BatchPayload'
    deleteOneExecutive: 'Executive'
    deleteManyExecutive: 'BatchPayload'
    upsertOneExecutive: 'Executive'
    createOneLatLng: 'LatLng'
    updateOneLatLng: 'LatLng'
    updateManyLatLng: 'BatchPayload'
    deleteOneLatLng: 'LatLng'
    deleteManyLatLng: 'BatchPayload'
    upsertOneLatLng: 'LatLng'
    createOneAddress: 'Address'
    updateOneAddress: 'Address'
    updateManyAddress: 'BatchPayload'
    deleteOneAddress: 'Address'
    deleteManyAddress: 'BatchPayload'
    upsertOneAddress: 'Address'
    createOneLocation: 'Location'
    updateOneLocation: 'Location'
    updateManyLocation: 'BatchPayload'
    deleteOneLocation: 'Location'
    deleteManyLocation: 'BatchPayload'
    upsertOneLocation: 'Location'
    createOneStadium: 'Stadium'
    updateOneStadium: 'Stadium'
    updateManyStadium: 'BatchPayload'
    deleteOneStadium: 'Stadium'
    deleteManyStadium: 'BatchPayload'
    upsertOneStadium: 'Stadium'
  },
  PersonName: {
    id: 'Int'
    title: 'String'
    first: 'String'
    middle: 'String'
    last: 'String'
    suffix: 'String'
    nickname: 'String'
    Person: 'Person'
  }
  Person: {
    id: 'String'
    idPersonName: 'Int'
    name: 'PersonName'
    dob: 'DateTime'
    Player: 'Player'
    Coach: 'Coach'
    Executive: 'Executive'
  }
  PlayerMeasurable: {
    id: 'Int'
    height: 'Int'
    weight: 'Int'
    forty: 'Float'
    bench: 'Int'
    vertical: 'Float'
    broad: 'Float'
    shuttle: 'Float'
    cone: 'Float'
    armLength: 'Float'
    handSize: 'Float'
    handed: 'String'
    Player: 'Player'
  }
  Player: {
    id: 'String'
    idPerson: 'String'
    idMeasurables: 'Int'
    idCollege: 'Int'
    person: 'Person'
    measurable: 'PlayerMeasurable'
    college: 'CollegeProgram'
    nflPlayerId: 'String'
  }
  CollegeProgram: {
    id: 'Int'
    name: 'String'
    division: 'String'
    conference: 'String'
    yearFounded: 'Int'
    Player: 'Player'
  }
  Coach: {
    id: 'String'
    idPerson: 'String'
    person: 'Person'
  }
  Executive: {
    id: 'String'
    idPerson: 'String'
    person: 'Person'
  }
  LatLng: {
    id: 'Int'
    latitude: 'Float'
    longitude: 'Float'
    Location: 'Location'
  }
  Address: {
    id: 'String'
    streetAddress1: 'String'
    streetAddress2: 'String'
    city: 'String'
    stateCode: 'String'
    zipCode: 'String'
    countryCode: 'String'
    Location: 'Location'
  }
  Location: {
    id: 'Int'
    idAddress: 'String'
    idCoordinates: 'Int'
    address: 'Address'
    latLtg: 'LatLng'
    Stadium: 'Stadium'
  }
  Stadium: {
    id: 'String'
    idLocation: 'Int'
    capacity: 'Int'
    name: 'String'
    yearOpened: 'Int'
    location: 'Location'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  PersonName: Typegen.NexusPrismaFields<'PersonName'>
  Person: Typegen.NexusPrismaFields<'Person'>
  PlayerMeasurable: Typegen.NexusPrismaFields<'PlayerMeasurable'>
  Player: Typegen.NexusPrismaFields<'Player'>
  CollegeProgram: Typegen.NexusPrismaFields<'CollegeProgram'>
  Coach: Typegen.NexusPrismaFields<'Coach'>
  Executive: Typegen.NexusPrismaFields<'Executive'>
  LatLng: Typegen.NexusPrismaFields<'LatLng'>
  Address: Typegen.NexusPrismaFields<'Address'>
  Location: Typegen.NexusPrismaFields<'Location'>
  Stadium: Typegen.NexusPrismaFields<'Stadium'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  