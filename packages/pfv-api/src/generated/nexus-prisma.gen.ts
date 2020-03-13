import * as prisma from '@prisma/client';
import { core } from 'nexus';
import { GraphQLResolveInfo } from 'graphql';

// Types helpers
  type IsModelNameExistsInGraphQLTypes<
  ReturnType extends any
> = ReturnType extends core.GetGen<'objectNames'> ? true : false;

type NexusPrismaScalarOpts = {
  alias?: string;
};

type Pagination = {
  first?: boolean;
  last?: boolean;
  before?: boolean;
  after?: boolean;
  skip?: boolean;
};

type RootObjectTypes = Pick<
  core.GetGen<'rootTypes'>,
  core.GetGen<'objectNames'>
>;

/**
 * Determine if `B` is a subset (or equivalent to) of `A`.
*/
type IsSubset<A, B> = keyof A extends never
  ? false
  : B extends A
  ? true
  : false;

type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

type GetSubsetTypes<ModelName extends any> = keyof OmitByValue<
  {
    [P in keyof RootObjectTypes]: ModelName extends keyof ModelTypes
      ? IsSubset<RootObjectTypes[P], ModelTypes[ModelName]> extends true
        ? RootObjectTypes[P]
        : never
      : never;
  },
  never
>;

type SubsetTypes<ModelName extends any> = GetSubsetTypes<
  ModelName
> extends never
  ? `ERROR: No subset types are available. Please make sure that one of your GraphQL type is a subset of your t.model('<ModelName>')`
  : GetSubsetTypes<ModelName>;

type DynamicRequiredType<ReturnType extends any> = IsModelNameExistsInGraphQLTypes<
  ReturnType
> extends true
  ? { type?: SubsetTypes<ReturnType> }
  : { type: SubsetTypes<ReturnType> };

type GetNexusPrismaInput<
  ModelName extends any,
  MethodName extends any,
  InputName extends 'filtering' | 'ordering'
> = ModelName extends keyof NexusPrismaInputs
  ? MethodName extends keyof NexusPrismaInputs[ModelName]
    ? NexusPrismaInputs[ModelName][MethodName][InputName]
    : never
  : never;

/**
 *  Represents arguments required by Prisma Client JS that will
 *  be derived from a request's input (args, context, and info)
 *  and omitted from the GraphQL API. The object itself maps the
 *  names of these args to a function that takes an object representing
 *  the request's input and returns the value to pass to the prisma
 *  arg of the same name.
 */
export type LocalComputedInputs<MethodName extends any> = Record<
  string,
  (params: LocalMutationResolverParams<MethodName>) => unknown
>

export type GlobalComputedInputs = Record<
  string,
  (params: GlobalMutationResolverParams) => unknown
>

type BaseMutationResolverParams = {
  info: GraphQLResolveInfo
  ctx: Context
}

export type GlobalMutationResolverParams = BaseMutationResolverParams & {
  args: Record<string, any> & { data: unknown }
}

export type LocalMutationResolverParams<
  MethodName extends any
> = BaseMutationResolverParams & {
  args: MethodName extends keyof core.GetGen2<'argTypes', 'Mutation'>
    ? core.GetGen3<'argTypes', 'Mutation', MethodName>
    : any
}

export type Context = core.GetGen<'context'>

type NexusPrismaRelationOpts<
  ModelName extends any,
  MethodName extends any,
  ReturnType extends any
> = GetNexusPrismaInput<
  // If GetNexusPrismaInput returns never, it means there are no filtering/ordering args for it.
  ModelName,
  MethodName,
  'filtering'
> extends never
  ? {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
    } & DynamicRequiredType<ReturnType>
  : {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
      filtering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'filtering'>,
              boolean
            >
          >;
      ordering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'ordering'>,
              boolean
            >
          >;
      pagination?: boolean | Pagination;
    } & DynamicRequiredType<ReturnType>;

type IsScalar<TypeName extends any> = TypeName extends core.GetGen<'scalarNames'>
  ? true
  : false;

type IsObject<Name extends any> = Name extends core.GetGen<'objectNames'>
  ? true
  : false

type IsEnum<Name extends any> = Name extends core.GetGen<'enumNames'>
  ? true
  : false

type IsInputObject<Name extends any> = Name extends core.GetGen<'inputNames'>
  ? true
  : false

/**
 * The kind that a GraphQL type may be.
 */
type Kind = 'Enum' | 'Object' | 'Scalar' | 'InputObject'

/**
 * Helper to safely reference a Kind type. For example instead of the following
 * which would admit a typo:
 *
 * ```ts
 * type Foo = Bar extends 'scalar' ? ...
 * ```
 *
 * You can do this which guarantees a correct reference:
 *
 * ```ts
 * type Foo = Bar extends AKind<'Scalar'> ? ...
 * ```
 *
 */
type AKind<T extends Kind> = T

type GetKind<Name extends any> = IsEnum<Name> extends true
  ? 'Enum'
  : IsScalar<Name> extends true
  ? 'Scalar'
  : IsObject<Name> extends true
  ? 'Object'
  : IsInputObject<Name> extends true
  ? 'InputObject'
  // FIXME should be `never`, but GQL objects named differently
  // than backing type fall into this branch
  : 'Object'

type NexusPrismaFields<ModelName extends keyof NexusPrismaTypes> = {
  [MethodName in keyof NexusPrismaTypes[ModelName]]: NexusPrismaMethod<
    ModelName,
    MethodName,
    GetKind<NexusPrismaTypes[ModelName][MethodName]> // Is the return type a scalar?
  >;
};

type NexusPrismaMethod<
  ModelName extends keyof NexusPrismaTypes,
  MethodName extends keyof NexusPrismaTypes[ModelName],
  ThisKind extends Kind,
  ReturnType extends any = NexusPrismaTypes[ModelName][MethodName]
> =
  ThisKind extends AKind<'Enum'>
  ? () => NexusPrismaFields<ModelName>
  : ThisKind extends AKind<'Scalar'>
  ? (opts?: NexusPrismaScalarOpts) => NexusPrismaFields<ModelName> // Return optional scalar opts
  : IsModelNameExistsInGraphQLTypes<ReturnType> extends true // If model name has a mapped graphql types
  ? (
      opts?: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName> // Then make opts optional
  : (
      opts: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName>; // Else force use input the related graphql type -> { type: '...' }

type GetNexusPrismaMethod<
  TypeName extends string
> = TypeName extends keyof NexusPrismaMethods
  ? NexusPrismaMethods[TypeName]
  : <CustomTypeName extends keyof ModelTypes>(
      typeName: CustomTypeName
    ) => NexusPrismaMethods[CustomTypeName];

type GetNexusPrisma<
  TypeName extends string,
  ModelOrCrud extends 'model' | 'crud'
> = ModelOrCrud extends 'model'
  ? TypeName extends 'Mutation'
    ? never
    : TypeName extends 'Query'
    ? never
    : GetNexusPrismaMethod<TypeName>
  : ModelOrCrud extends 'crud'
  ? TypeName extends 'Mutation'
    ? GetNexusPrismaMethod<TypeName>
    : TypeName extends 'Query'
    ? GetNexusPrismaMethod<TypeName>
    : never
  : never;
  

// Generated
interface ModelTypes {
  PersonName: prisma.PersonName
  Person: prisma.Person
  PlayerMeasurable: prisma.PlayerMeasurable
  Player: prisma.Player
  CollegeProgram: prisma.CollegeProgram
  Coach: prisma.Coach
  Executive: prisma.Executive
  LatLng: prisma.LatLng
  Address: prisma.Address
  Location: prisma.Location
  Stadium: prisma.Stadium
}
  
interface NexusPrismaInputs {
  Query: {
    personNames: {
  filtering: 'id' | 'title' | 'first' | 'middle' | 'last' | 'suffix' | 'nickname' | 'persons' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'title' | 'first' | 'middle' | 'last' | 'suffix' | 'nickname'
}
    people: {
  filtering: 'id' | 'dob' | 'players' | 'coaches' | 'executives' | 'AND' | 'OR' | 'NOT' | 'name'
  ordering: 'id' | 'name' | 'dob'
}
    playerMeasurables: {
  filtering: 'id' | 'height' | 'weight' | 'forty' | 'bench' | 'vertical' | 'broad' | 'shuttle' | 'cone' | 'armLength' | 'handSize' | 'handed' | 'players' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'height' | 'weight' | 'forty' | 'bench' | 'vertical' | 'broad' | 'shuttle' | 'cone' | 'armLength' | 'handSize' | 'handed'
}
    players: {
  filtering: 'id' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
  ordering: 'id' | 'person' | 'measurable' | 'college' | 'nflPlayerId'
}
    collegePrograms: {
  filtering: 'id' | 'name' | 'division' | 'conference' | 'yearFounded' | 'players' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'name' | 'division' | 'conference' | 'yearFounded'
}
    coaches: {
  filtering: 'id' | 'AND' | 'OR' | 'NOT' | 'person'
  ordering: 'id' | 'person'
}
    executives: {
  filtering: 'id' | 'AND' | 'OR' | 'NOT' | 'person'
  ordering: 'id' | 'person'
}
    latLngs: {
  filtering: 'id' | 'latitude' | 'longitude' | 'locations' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'latitude' | 'longitude'
}
    addresses: {
  filtering: 'id' | 'streetAddress1' | 'streetAddress2' | 'city' | 'stateCode' | 'zipCode' | 'countryCode' | 'locations' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'streetAddress1' | 'streetAddress2' | 'city' | 'stateCode' | 'zipCode' | 'countryCode'
}
    locations: {
  filtering: 'id' | 'stadiums' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
  ordering: 'id' | 'address' | 'latLtg'
}
    stadiums: {
  filtering: 'id' | 'capacity' | 'name' | 'yearOpened' | 'AND' | 'OR' | 'NOT' | 'location'
  ordering: 'id' | 'capacity' | 'name' | 'yearOpened' | 'location'
}

  },
    PersonName: {
    persons: {
  filtering: 'id' | 'dob' | 'players' | 'coaches' | 'executives' | 'AND' | 'OR' | 'NOT' | 'name'
  ordering: 'id' | 'name' | 'dob'
}

  },  Person: {
    players: {
  filtering: 'id' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
  ordering: 'id' | 'person' | 'measurable' | 'college' | 'nflPlayerId'
}
    coaches: {
  filtering: 'id' | 'AND' | 'OR' | 'NOT' | 'person'
  ordering: 'id' | 'person'
}
    executives: {
  filtering: 'id' | 'AND' | 'OR' | 'NOT' | 'person'
  ordering: 'id' | 'person'
}

  },  PlayerMeasurable: {
    players: {
  filtering: 'id' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
  ordering: 'id' | 'person' | 'measurable' | 'college' | 'nflPlayerId'
}

  },  Player: {


  },  CollegeProgram: {
    players: {
  filtering: 'id' | 'nflPlayerId' | 'AND' | 'OR' | 'NOT' | 'person' | 'measurable' | 'college'
  ordering: 'id' | 'person' | 'measurable' | 'college' | 'nflPlayerId'
}

  },  Coach: {


  },  Executive: {


  },  LatLng: {
    locations: {
  filtering: 'id' | 'stadiums' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
  ordering: 'id' | 'address' | 'latLtg'
}

  },  Address: {
    locations: {
  filtering: 'id' | 'stadiums' | 'AND' | 'OR' | 'NOT' | 'address' | 'latLtg'
  ordering: 'id' | 'address' | 'latLtg'
}

  },  Location: {
    stadiums: {
  filtering: 'id' | 'capacity' | 'name' | 'yearOpened' | 'AND' | 'OR' | 'NOT' | 'location'
  ordering: 'id' | 'capacity' | 'name' | 'yearOpened' | 'location'
}

  },  Stadium: {


  }
}

interface NexusPrismaTypes {
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
    persons: 'Person'

},  Person: {
    id: 'String'
    name: 'PersonName'
    dob: 'DateTime'
    players: 'Player'
    coaches: 'Coach'
    executives: 'Executive'

},  PlayerMeasurable: {
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
    players: 'Player'

},  Player: {
    id: 'String'
    person: 'Person'
    measurable: 'PlayerMeasurable'
    college: 'CollegeProgram'
    nflPlayerId: 'String'

},  CollegeProgram: {
    id: 'Int'
    name: 'String'
    division: 'String'
    conference: 'String'
    yearFounded: 'Int'
    players: 'Player'

},  Coach: {
    id: 'String'
    person: 'Person'

},  Executive: {
    id: 'String'
    person: 'Person'

},  LatLng: {
    id: 'Int'
    latitude: 'Float'
    longitude: 'Float'
    locations: 'Location'

},  Address: {
    id: 'String'
    streetAddress1: 'String'
    streetAddress2: 'String'
    city: 'String'
    stateCode: 'String'
    zipCode: 'String'
    countryCode: 'String'
    locations: 'Location'

},  Location: {
    id: 'Int'
    address: 'Address'
    latLtg: 'LatLng'
    stadiums: 'Stadium'

},  Stadium: {
    id: 'String'
    capacity: 'Int'
    name: 'String'
    yearOpened: 'Int'
    location: 'Location'

}
}

interface NexusPrismaMethods {
  PersonName: NexusPrismaFields<'PersonName'>
  Person: NexusPrismaFields<'Person'>
  PlayerMeasurable: NexusPrismaFields<'PlayerMeasurable'>
  Player: NexusPrismaFields<'Player'>
  CollegeProgram: NexusPrismaFields<'CollegeProgram'>
  Coach: NexusPrismaFields<'Coach'>
  Executive: NexusPrismaFields<'Executive'>
  LatLng: NexusPrismaFields<'LatLng'>
  Address: NexusPrismaFields<'Address'>
  Location: NexusPrismaFields<'Location'>
  Stadium: NexusPrismaFields<'Stadium'>
  Query: NexusPrismaFields<'Query'>
  Mutation: NexusPrismaFields<'Mutation'>
}
  

declare global {
  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = GetNexusPrisma<TypeName, ModelOrCrud>;
}
  