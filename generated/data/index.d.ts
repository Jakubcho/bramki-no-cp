
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model StatsEntry
 * 
 */
export type StatsEntry = $Result.DefaultSelection<Prisma.$StatsEntryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more StatsEntries
 * const statsEntries = await prisma.statsEntry.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more StatsEntries
   * const statsEntries = await prisma.statsEntry.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.statsEntry`: Exposes CRUD operations for the **StatsEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StatsEntries
    * const statsEntries = await prisma.statsEntry.findMany()
    * ```
    */
  get statsEntry(): Prisma.StatsEntryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    StatsEntry: 'StatsEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "statsEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      StatsEntry: {
        payload: Prisma.$StatsEntryPayload<ExtArgs>
        fields: Prisma.StatsEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StatsEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StatsEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          findFirst: {
            args: Prisma.StatsEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StatsEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          findMany: {
            args: Prisma.StatsEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>[]
          }
          create: {
            args: Prisma.StatsEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          createMany: {
            args: Prisma.StatsEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StatsEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>[]
          }
          delete: {
            args: Prisma.StatsEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          update: {
            args: Prisma.StatsEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          deleteMany: {
            args: Prisma.StatsEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StatsEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StatsEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>[]
          }
          upsert: {
            args: Prisma.StatsEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StatsEntryPayload>
          }
          aggregate: {
            args: Prisma.StatsEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStatsEntry>
          }
          groupBy: {
            args: Prisma.StatsEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<StatsEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.StatsEntryCountArgs<ExtArgs>
            result: $Utils.Optional<StatsEntryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    statsEntry?: StatsEntryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model StatsEntry
   */

  export type AggregateStatsEntry = {
    _count: StatsEntryCountAggregateOutputType | null
    _avg: StatsEntryAvgAggregateOutputType | null
    _sum: StatsEntrySumAggregateOutputType | null
    _min: StatsEntryMinAggregateOutputType | null
    _max: StatsEntryMaxAggregateOutputType | null
  }

  export type StatsEntryAvgAggregateOutputType = {
    formId: number | null
  }

  export type StatsEntrySumAggregateOutputType = {
    formId: number | null
  }

  export type StatsEntryMinAggregateOutputType = {
    id: string | null
    eventSlug: string | null
    entryId: string | null
    formId: number | null
    email: string | null
    phone: string | null
    fullName: string | null
    company: string | null
    qrCode: string | null
    qrCodeUrl: string | null
    sourceUrl: string | null
    status: string | null
    userAgent: string | null
    os: string | null
    firstNameActivation: string | null
    lastNameActivation: string | null
    emailActivation: string | null
    phoneActivation: string | null
    streetActivation: string | null
    buildingActivation: string | null
    postalCodeActivation: string | null
    cityActivation: string | null
    countryActivation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StatsEntryMaxAggregateOutputType = {
    id: string | null
    eventSlug: string | null
    entryId: string | null
    formId: number | null
    email: string | null
    phone: string | null
    fullName: string | null
    company: string | null
    qrCode: string | null
    qrCodeUrl: string | null
    sourceUrl: string | null
    status: string | null
    userAgent: string | null
    os: string | null
    firstNameActivation: string | null
    lastNameActivation: string | null
    emailActivation: string | null
    phoneActivation: string | null
    streetActivation: string | null
    buildingActivation: string | null
    postalCodeActivation: string | null
    cityActivation: string | null
    countryActivation: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StatsEntryCountAggregateOutputType = {
    id: number
    eventSlug: number
    entryId: number
    formId: number
    email: number
    phone: number
    fullName: number
    company: number
    qrCode: number
    qrCodeUrl: number
    sourceUrl: number
    status: number
    userAgent: number
    os: number
    firstNameActivation: number
    lastNameActivation: number
    emailActivation: number
    phoneActivation: number
    streetActivation: number
    buildingActivation: number
    postalCodeActivation: number
    cityActivation: number
    countryActivation: number
    formData: number
    activationForm: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StatsEntryAvgAggregateInputType = {
    formId?: true
  }

  export type StatsEntrySumAggregateInputType = {
    formId?: true
  }

  export type StatsEntryMinAggregateInputType = {
    id?: true
    eventSlug?: true
    entryId?: true
    formId?: true
    email?: true
    phone?: true
    fullName?: true
    company?: true
    qrCode?: true
    qrCodeUrl?: true
    sourceUrl?: true
    status?: true
    userAgent?: true
    os?: true
    firstNameActivation?: true
    lastNameActivation?: true
    emailActivation?: true
    phoneActivation?: true
    streetActivation?: true
    buildingActivation?: true
    postalCodeActivation?: true
    cityActivation?: true
    countryActivation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StatsEntryMaxAggregateInputType = {
    id?: true
    eventSlug?: true
    entryId?: true
    formId?: true
    email?: true
    phone?: true
    fullName?: true
    company?: true
    qrCode?: true
    qrCodeUrl?: true
    sourceUrl?: true
    status?: true
    userAgent?: true
    os?: true
    firstNameActivation?: true
    lastNameActivation?: true
    emailActivation?: true
    phoneActivation?: true
    streetActivation?: true
    buildingActivation?: true
    postalCodeActivation?: true
    cityActivation?: true
    countryActivation?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StatsEntryCountAggregateInputType = {
    id?: true
    eventSlug?: true
    entryId?: true
    formId?: true
    email?: true
    phone?: true
    fullName?: true
    company?: true
    qrCode?: true
    qrCodeUrl?: true
    sourceUrl?: true
    status?: true
    userAgent?: true
    os?: true
    firstNameActivation?: true
    lastNameActivation?: true
    emailActivation?: true
    phoneActivation?: true
    streetActivation?: true
    buildingActivation?: true
    postalCodeActivation?: true
    cityActivation?: true
    countryActivation?: true
    formData?: true
    activationForm?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StatsEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatsEntry to aggregate.
     */
    where?: StatsEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatsEntries to fetch.
     */
    orderBy?: StatsEntryOrderByWithRelationInput | StatsEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StatsEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatsEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatsEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StatsEntries
    **/
    _count?: true | StatsEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StatsEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StatsEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StatsEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StatsEntryMaxAggregateInputType
  }

  export type GetStatsEntryAggregateType<T extends StatsEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateStatsEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStatsEntry[P]>
      : GetScalarType<T[P], AggregateStatsEntry[P]>
  }




  export type StatsEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StatsEntryWhereInput
    orderBy?: StatsEntryOrderByWithAggregationInput | StatsEntryOrderByWithAggregationInput[]
    by: StatsEntryScalarFieldEnum[] | StatsEntryScalarFieldEnum
    having?: StatsEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StatsEntryCountAggregateInputType | true
    _avg?: StatsEntryAvgAggregateInputType
    _sum?: StatsEntrySumAggregateInputType
    _min?: StatsEntryMinAggregateInputType
    _max?: StatsEntryMaxAggregateInputType
  }

  export type StatsEntryGroupByOutputType = {
    id: string
    eventSlug: string
    entryId: string
    formId: number | null
    email: string | null
    phone: string | null
    fullName: string | null
    company: string | null
    qrCode: string | null
    qrCodeUrl: string | null
    sourceUrl: string | null
    status: string | null
    userAgent: string | null
    os: string | null
    firstNameActivation: string | null
    lastNameActivation: string | null
    emailActivation: string | null
    phoneActivation: string | null
    streetActivation: string | null
    buildingActivation: string | null
    postalCodeActivation: string | null
    cityActivation: string | null
    countryActivation: string | null
    formData: JsonValue | null
    activationForm: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: StatsEntryCountAggregateOutputType | null
    _avg: StatsEntryAvgAggregateOutputType | null
    _sum: StatsEntrySumAggregateOutputType | null
    _min: StatsEntryMinAggregateOutputType | null
    _max: StatsEntryMaxAggregateOutputType | null
  }

  type GetStatsEntryGroupByPayload<T extends StatsEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StatsEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StatsEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StatsEntryGroupByOutputType[P]>
            : GetScalarType<T[P], StatsEntryGroupByOutputType[P]>
        }
      >
    >


  export type StatsEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventSlug?: boolean
    entryId?: boolean
    formId?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    company?: boolean
    qrCode?: boolean
    qrCodeUrl?: boolean
    sourceUrl?: boolean
    status?: boolean
    userAgent?: boolean
    os?: boolean
    firstNameActivation?: boolean
    lastNameActivation?: boolean
    emailActivation?: boolean
    phoneActivation?: boolean
    streetActivation?: boolean
    buildingActivation?: boolean
    postalCodeActivation?: boolean
    cityActivation?: boolean
    countryActivation?: boolean
    formData?: boolean
    activationForm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["statsEntry"]>

  export type StatsEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventSlug?: boolean
    entryId?: boolean
    formId?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    company?: boolean
    qrCode?: boolean
    qrCodeUrl?: boolean
    sourceUrl?: boolean
    status?: boolean
    userAgent?: boolean
    os?: boolean
    firstNameActivation?: boolean
    lastNameActivation?: boolean
    emailActivation?: boolean
    phoneActivation?: boolean
    streetActivation?: boolean
    buildingActivation?: boolean
    postalCodeActivation?: boolean
    cityActivation?: boolean
    countryActivation?: boolean
    formData?: boolean
    activationForm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["statsEntry"]>

  export type StatsEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventSlug?: boolean
    entryId?: boolean
    formId?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    company?: boolean
    qrCode?: boolean
    qrCodeUrl?: boolean
    sourceUrl?: boolean
    status?: boolean
    userAgent?: boolean
    os?: boolean
    firstNameActivation?: boolean
    lastNameActivation?: boolean
    emailActivation?: boolean
    phoneActivation?: boolean
    streetActivation?: boolean
    buildingActivation?: boolean
    postalCodeActivation?: boolean
    cityActivation?: boolean
    countryActivation?: boolean
    formData?: boolean
    activationForm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["statsEntry"]>

  export type StatsEntrySelectScalar = {
    id?: boolean
    eventSlug?: boolean
    entryId?: boolean
    formId?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    company?: boolean
    qrCode?: boolean
    qrCodeUrl?: boolean
    sourceUrl?: boolean
    status?: boolean
    userAgent?: boolean
    os?: boolean
    firstNameActivation?: boolean
    lastNameActivation?: boolean
    emailActivation?: boolean
    phoneActivation?: boolean
    streetActivation?: boolean
    buildingActivation?: boolean
    postalCodeActivation?: boolean
    cityActivation?: boolean
    countryActivation?: boolean
    formData?: boolean
    activationForm?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StatsEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventSlug" | "entryId" | "formId" | "email" | "phone" | "fullName" | "company" | "qrCode" | "qrCodeUrl" | "sourceUrl" | "status" | "userAgent" | "os" | "firstNameActivation" | "lastNameActivation" | "emailActivation" | "phoneActivation" | "streetActivation" | "buildingActivation" | "postalCodeActivation" | "cityActivation" | "countryActivation" | "formData" | "activationForm" | "createdAt" | "updatedAt", ExtArgs["result"]["statsEntry"]>

  export type $StatsEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StatsEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventSlug: string
      entryId: string
      formId: number | null
      email: string | null
      phone: string | null
      fullName: string | null
      company: string | null
      qrCode: string | null
      qrCodeUrl: string | null
      sourceUrl: string | null
      status: string | null
      userAgent: string | null
      os: string | null
      /**
       * ==========================
       *   AKTYWACJA (STAŁE POLA)
       *   ==========================
       */
      firstNameActivation: string | null
      lastNameActivation: string | null
      emailActivation: string | null
      phoneActivation: string | null
      streetActivation: string | null
      buildingActivation: string | null
      postalCodeActivation: string | null
      cityActivation: string | null
      countryActivation: string | null
      /**
       * ==========================
       *   DANE DYNAMICZNE
       *   ==========================
       */
      formData: Prisma.JsonValue | null
      activationForm: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["statsEntry"]>
    composites: {}
  }

  type StatsEntryGetPayload<S extends boolean | null | undefined | StatsEntryDefaultArgs> = $Result.GetResult<Prisma.$StatsEntryPayload, S>

  type StatsEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StatsEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StatsEntryCountAggregateInputType | true
    }

  export interface StatsEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StatsEntry'], meta: { name: 'StatsEntry' } }
    /**
     * Find zero or one StatsEntry that matches the filter.
     * @param {StatsEntryFindUniqueArgs} args - Arguments to find a StatsEntry
     * @example
     * // Get one StatsEntry
     * const statsEntry = await prisma.statsEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StatsEntryFindUniqueArgs>(args: SelectSubset<T, StatsEntryFindUniqueArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StatsEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StatsEntryFindUniqueOrThrowArgs} args - Arguments to find a StatsEntry
     * @example
     * // Get one StatsEntry
     * const statsEntry = await prisma.statsEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StatsEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, StatsEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatsEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryFindFirstArgs} args - Arguments to find a StatsEntry
     * @example
     * // Get one StatsEntry
     * const statsEntry = await prisma.statsEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StatsEntryFindFirstArgs>(args?: SelectSubset<T, StatsEntryFindFirstArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StatsEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryFindFirstOrThrowArgs} args - Arguments to find a StatsEntry
     * @example
     * // Get one StatsEntry
     * const statsEntry = await prisma.statsEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StatsEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, StatsEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StatsEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StatsEntries
     * const statsEntries = await prisma.statsEntry.findMany()
     * 
     * // Get first 10 StatsEntries
     * const statsEntries = await prisma.statsEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const statsEntryWithIdOnly = await prisma.statsEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StatsEntryFindManyArgs>(args?: SelectSubset<T, StatsEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StatsEntry.
     * @param {StatsEntryCreateArgs} args - Arguments to create a StatsEntry.
     * @example
     * // Create one StatsEntry
     * const StatsEntry = await prisma.statsEntry.create({
     *   data: {
     *     // ... data to create a StatsEntry
     *   }
     * })
     * 
     */
    create<T extends StatsEntryCreateArgs>(args: SelectSubset<T, StatsEntryCreateArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StatsEntries.
     * @param {StatsEntryCreateManyArgs} args - Arguments to create many StatsEntries.
     * @example
     * // Create many StatsEntries
     * const statsEntry = await prisma.statsEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StatsEntryCreateManyArgs>(args?: SelectSubset<T, StatsEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StatsEntries and returns the data saved in the database.
     * @param {StatsEntryCreateManyAndReturnArgs} args - Arguments to create many StatsEntries.
     * @example
     * // Create many StatsEntries
     * const statsEntry = await prisma.statsEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StatsEntries and only return the `id`
     * const statsEntryWithIdOnly = await prisma.statsEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StatsEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, StatsEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StatsEntry.
     * @param {StatsEntryDeleteArgs} args - Arguments to delete one StatsEntry.
     * @example
     * // Delete one StatsEntry
     * const StatsEntry = await prisma.statsEntry.delete({
     *   where: {
     *     // ... filter to delete one StatsEntry
     *   }
     * })
     * 
     */
    delete<T extends StatsEntryDeleteArgs>(args: SelectSubset<T, StatsEntryDeleteArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StatsEntry.
     * @param {StatsEntryUpdateArgs} args - Arguments to update one StatsEntry.
     * @example
     * // Update one StatsEntry
     * const statsEntry = await prisma.statsEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StatsEntryUpdateArgs>(args: SelectSubset<T, StatsEntryUpdateArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StatsEntries.
     * @param {StatsEntryDeleteManyArgs} args - Arguments to filter StatsEntries to delete.
     * @example
     * // Delete a few StatsEntries
     * const { count } = await prisma.statsEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StatsEntryDeleteManyArgs>(args?: SelectSubset<T, StatsEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatsEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StatsEntries
     * const statsEntry = await prisma.statsEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StatsEntryUpdateManyArgs>(args: SelectSubset<T, StatsEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StatsEntries and returns the data updated in the database.
     * @param {StatsEntryUpdateManyAndReturnArgs} args - Arguments to update many StatsEntries.
     * @example
     * // Update many StatsEntries
     * const statsEntry = await prisma.statsEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StatsEntries and only return the `id`
     * const statsEntryWithIdOnly = await prisma.statsEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StatsEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, StatsEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StatsEntry.
     * @param {StatsEntryUpsertArgs} args - Arguments to update or create a StatsEntry.
     * @example
     * // Update or create a StatsEntry
     * const statsEntry = await prisma.statsEntry.upsert({
     *   create: {
     *     // ... data to create a StatsEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StatsEntry we want to update
     *   }
     * })
     */
    upsert<T extends StatsEntryUpsertArgs>(args: SelectSubset<T, StatsEntryUpsertArgs<ExtArgs>>): Prisma__StatsEntryClient<$Result.GetResult<Prisma.$StatsEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StatsEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryCountArgs} args - Arguments to filter StatsEntries to count.
     * @example
     * // Count the number of StatsEntries
     * const count = await prisma.statsEntry.count({
     *   where: {
     *     // ... the filter for the StatsEntries we want to count
     *   }
     * })
    **/
    count<T extends StatsEntryCountArgs>(
      args?: Subset<T, StatsEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StatsEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StatsEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StatsEntryAggregateArgs>(args: Subset<T, StatsEntryAggregateArgs>): Prisma.PrismaPromise<GetStatsEntryAggregateType<T>>

    /**
     * Group by StatsEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StatsEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StatsEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StatsEntryGroupByArgs['orderBy'] }
        : { orderBy?: StatsEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StatsEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatsEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StatsEntry model
   */
  readonly fields: StatsEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StatsEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StatsEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StatsEntry model
   */
  interface StatsEntryFieldRefs {
    readonly id: FieldRef<"StatsEntry", 'String'>
    readonly eventSlug: FieldRef<"StatsEntry", 'String'>
    readonly entryId: FieldRef<"StatsEntry", 'String'>
    readonly formId: FieldRef<"StatsEntry", 'Int'>
    readonly email: FieldRef<"StatsEntry", 'String'>
    readonly phone: FieldRef<"StatsEntry", 'String'>
    readonly fullName: FieldRef<"StatsEntry", 'String'>
    readonly company: FieldRef<"StatsEntry", 'String'>
    readonly qrCode: FieldRef<"StatsEntry", 'String'>
    readonly qrCodeUrl: FieldRef<"StatsEntry", 'String'>
    readonly sourceUrl: FieldRef<"StatsEntry", 'String'>
    readonly status: FieldRef<"StatsEntry", 'String'>
    readonly userAgent: FieldRef<"StatsEntry", 'String'>
    readonly os: FieldRef<"StatsEntry", 'String'>
    readonly firstNameActivation: FieldRef<"StatsEntry", 'String'>
    readonly lastNameActivation: FieldRef<"StatsEntry", 'String'>
    readonly emailActivation: FieldRef<"StatsEntry", 'String'>
    readonly phoneActivation: FieldRef<"StatsEntry", 'String'>
    readonly streetActivation: FieldRef<"StatsEntry", 'String'>
    readonly buildingActivation: FieldRef<"StatsEntry", 'String'>
    readonly postalCodeActivation: FieldRef<"StatsEntry", 'String'>
    readonly cityActivation: FieldRef<"StatsEntry", 'String'>
    readonly countryActivation: FieldRef<"StatsEntry", 'String'>
    readonly formData: FieldRef<"StatsEntry", 'Json'>
    readonly activationForm: FieldRef<"StatsEntry", 'Json'>
    readonly createdAt: FieldRef<"StatsEntry", 'DateTime'>
    readonly updatedAt: FieldRef<"StatsEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StatsEntry findUnique
   */
  export type StatsEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter, which StatsEntry to fetch.
     */
    where: StatsEntryWhereUniqueInput
  }

  /**
   * StatsEntry findUniqueOrThrow
   */
  export type StatsEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter, which StatsEntry to fetch.
     */
    where: StatsEntryWhereUniqueInput
  }

  /**
   * StatsEntry findFirst
   */
  export type StatsEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter, which StatsEntry to fetch.
     */
    where?: StatsEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatsEntries to fetch.
     */
    orderBy?: StatsEntryOrderByWithRelationInput | StatsEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatsEntries.
     */
    cursor?: StatsEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatsEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatsEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatsEntries.
     */
    distinct?: StatsEntryScalarFieldEnum | StatsEntryScalarFieldEnum[]
  }

  /**
   * StatsEntry findFirstOrThrow
   */
  export type StatsEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter, which StatsEntry to fetch.
     */
    where?: StatsEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatsEntries to fetch.
     */
    orderBy?: StatsEntryOrderByWithRelationInput | StatsEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StatsEntries.
     */
    cursor?: StatsEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatsEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatsEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StatsEntries.
     */
    distinct?: StatsEntryScalarFieldEnum | StatsEntryScalarFieldEnum[]
  }

  /**
   * StatsEntry findMany
   */
  export type StatsEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter, which StatsEntries to fetch.
     */
    where?: StatsEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StatsEntries to fetch.
     */
    orderBy?: StatsEntryOrderByWithRelationInput | StatsEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StatsEntries.
     */
    cursor?: StatsEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StatsEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StatsEntries.
     */
    skip?: number
    distinct?: StatsEntryScalarFieldEnum | StatsEntryScalarFieldEnum[]
  }

  /**
   * StatsEntry create
   */
  export type StatsEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a StatsEntry.
     */
    data: XOR<StatsEntryCreateInput, StatsEntryUncheckedCreateInput>
  }

  /**
   * StatsEntry createMany
   */
  export type StatsEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StatsEntries.
     */
    data: StatsEntryCreateManyInput | StatsEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatsEntry createManyAndReturn
   */
  export type StatsEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * The data used to create many StatsEntries.
     */
    data: StatsEntryCreateManyInput | StatsEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StatsEntry update
   */
  export type StatsEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a StatsEntry.
     */
    data: XOR<StatsEntryUpdateInput, StatsEntryUncheckedUpdateInput>
    /**
     * Choose, which StatsEntry to update.
     */
    where: StatsEntryWhereUniqueInput
  }

  /**
   * StatsEntry updateMany
   */
  export type StatsEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StatsEntries.
     */
    data: XOR<StatsEntryUpdateManyMutationInput, StatsEntryUncheckedUpdateManyInput>
    /**
     * Filter which StatsEntries to update
     */
    where?: StatsEntryWhereInput
    /**
     * Limit how many StatsEntries to update.
     */
    limit?: number
  }

  /**
   * StatsEntry updateManyAndReturn
   */
  export type StatsEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * The data used to update StatsEntries.
     */
    data: XOR<StatsEntryUpdateManyMutationInput, StatsEntryUncheckedUpdateManyInput>
    /**
     * Filter which StatsEntries to update
     */
    where?: StatsEntryWhereInput
    /**
     * Limit how many StatsEntries to update.
     */
    limit?: number
  }

  /**
   * StatsEntry upsert
   */
  export type StatsEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the StatsEntry to update in case it exists.
     */
    where: StatsEntryWhereUniqueInput
    /**
     * In case the StatsEntry found by the `where` argument doesn't exist, create a new StatsEntry with this data.
     */
    create: XOR<StatsEntryCreateInput, StatsEntryUncheckedCreateInput>
    /**
     * In case the StatsEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StatsEntryUpdateInput, StatsEntryUncheckedUpdateInput>
  }

  /**
   * StatsEntry delete
   */
  export type StatsEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
    /**
     * Filter which StatsEntry to delete.
     */
    where: StatsEntryWhereUniqueInput
  }

  /**
   * StatsEntry deleteMany
   */
  export type StatsEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StatsEntries to delete
     */
    where?: StatsEntryWhereInput
    /**
     * Limit how many StatsEntries to delete.
     */
    limit?: number
  }

  /**
   * StatsEntry without action
   */
  export type StatsEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StatsEntry
     */
    select?: StatsEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the StatsEntry
     */
    omit?: StatsEntryOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StatsEntryScalarFieldEnum: {
    id: 'id',
    eventSlug: 'eventSlug',
    entryId: 'entryId',
    formId: 'formId',
    email: 'email',
    phone: 'phone',
    fullName: 'fullName',
    company: 'company',
    qrCode: 'qrCode',
    qrCodeUrl: 'qrCodeUrl',
    sourceUrl: 'sourceUrl',
    status: 'status',
    userAgent: 'userAgent',
    os: 'os',
    firstNameActivation: 'firstNameActivation',
    lastNameActivation: 'lastNameActivation',
    emailActivation: 'emailActivation',
    phoneActivation: 'phoneActivation',
    streetActivation: 'streetActivation',
    buildingActivation: 'buildingActivation',
    postalCodeActivation: 'postalCodeActivation',
    cityActivation: 'cityActivation',
    countryActivation: 'countryActivation',
    formData: 'formData',
    activationForm: 'activationForm',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StatsEntryScalarFieldEnum = (typeof StatsEntryScalarFieldEnum)[keyof typeof StatsEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type StatsEntryWhereInput = {
    AND?: StatsEntryWhereInput | StatsEntryWhereInput[]
    OR?: StatsEntryWhereInput[]
    NOT?: StatsEntryWhereInput | StatsEntryWhereInput[]
    id?: StringFilter<"StatsEntry"> | string
    eventSlug?: StringFilter<"StatsEntry"> | string
    entryId?: StringFilter<"StatsEntry"> | string
    formId?: IntNullableFilter<"StatsEntry"> | number | null
    email?: StringNullableFilter<"StatsEntry"> | string | null
    phone?: StringNullableFilter<"StatsEntry"> | string | null
    fullName?: StringNullableFilter<"StatsEntry"> | string | null
    company?: StringNullableFilter<"StatsEntry"> | string | null
    qrCode?: StringNullableFilter<"StatsEntry"> | string | null
    qrCodeUrl?: StringNullableFilter<"StatsEntry"> | string | null
    sourceUrl?: StringNullableFilter<"StatsEntry"> | string | null
    status?: StringNullableFilter<"StatsEntry"> | string | null
    userAgent?: StringNullableFilter<"StatsEntry"> | string | null
    os?: StringNullableFilter<"StatsEntry"> | string | null
    firstNameActivation?: StringNullableFilter<"StatsEntry"> | string | null
    lastNameActivation?: StringNullableFilter<"StatsEntry"> | string | null
    emailActivation?: StringNullableFilter<"StatsEntry"> | string | null
    phoneActivation?: StringNullableFilter<"StatsEntry"> | string | null
    streetActivation?: StringNullableFilter<"StatsEntry"> | string | null
    buildingActivation?: StringNullableFilter<"StatsEntry"> | string | null
    postalCodeActivation?: StringNullableFilter<"StatsEntry"> | string | null
    cityActivation?: StringNullableFilter<"StatsEntry"> | string | null
    countryActivation?: StringNullableFilter<"StatsEntry"> | string | null
    formData?: JsonNullableFilter<"StatsEntry">
    activationForm?: JsonNullableFilter<"StatsEntry">
    createdAt?: DateTimeFilter<"StatsEntry"> | Date | string
    updatedAt?: DateTimeFilter<"StatsEntry"> | Date | string
  }

  export type StatsEntryOrderByWithRelationInput = {
    id?: SortOrder
    eventSlug?: SortOrder
    entryId?: SortOrder
    formId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    qrCode?: SortOrderInput | SortOrder
    qrCodeUrl?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    firstNameActivation?: SortOrderInput | SortOrder
    lastNameActivation?: SortOrderInput | SortOrder
    emailActivation?: SortOrderInput | SortOrder
    phoneActivation?: SortOrderInput | SortOrder
    streetActivation?: SortOrderInput | SortOrder
    buildingActivation?: SortOrderInput | SortOrder
    postalCodeActivation?: SortOrderInput | SortOrder
    cityActivation?: SortOrderInput | SortOrder
    countryActivation?: SortOrderInput | SortOrder
    formData?: SortOrderInput | SortOrder
    activationForm?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StatsEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventSlug_entryId?: StatsEntryEventSlugEntryIdCompoundUniqueInput
    AND?: StatsEntryWhereInput | StatsEntryWhereInput[]
    OR?: StatsEntryWhereInput[]
    NOT?: StatsEntryWhereInput | StatsEntryWhereInput[]
    eventSlug?: StringFilter<"StatsEntry"> | string
    entryId?: StringFilter<"StatsEntry"> | string
    formId?: IntNullableFilter<"StatsEntry"> | number | null
    email?: StringNullableFilter<"StatsEntry"> | string | null
    phone?: StringNullableFilter<"StatsEntry"> | string | null
    fullName?: StringNullableFilter<"StatsEntry"> | string | null
    company?: StringNullableFilter<"StatsEntry"> | string | null
    qrCode?: StringNullableFilter<"StatsEntry"> | string | null
    qrCodeUrl?: StringNullableFilter<"StatsEntry"> | string | null
    sourceUrl?: StringNullableFilter<"StatsEntry"> | string | null
    status?: StringNullableFilter<"StatsEntry"> | string | null
    userAgent?: StringNullableFilter<"StatsEntry"> | string | null
    os?: StringNullableFilter<"StatsEntry"> | string | null
    firstNameActivation?: StringNullableFilter<"StatsEntry"> | string | null
    lastNameActivation?: StringNullableFilter<"StatsEntry"> | string | null
    emailActivation?: StringNullableFilter<"StatsEntry"> | string | null
    phoneActivation?: StringNullableFilter<"StatsEntry"> | string | null
    streetActivation?: StringNullableFilter<"StatsEntry"> | string | null
    buildingActivation?: StringNullableFilter<"StatsEntry"> | string | null
    postalCodeActivation?: StringNullableFilter<"StatsEntry"> | string | null
    cityActivation?: StringNullableFilter<"StatsEntry"> | string | null
    countryActivation?: StringNullableFilter<"StatsEntry"> | string | null
    formData?: JsonNullableFilter<"StatsEntry">
    activationForm?: JsonNullableFilter<"StatsEntry">
    createdAt?: DateTimeFilter<"StatsEntry"> | Date | string
    updatedAt?: DateTimeFilter<"StatsEntry"> | Date | string
  }, "id" | "eventSlug_entryId">

  export type StatsEntryOrderByWithAggregationInput = {
    id?: SortOrder
    eventSlug?: SortOrder
    entryId?: SortOrder
    formId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    company?: SortOrderInput | SortOrder
    qrCode?: SortOrderInput | SortOrder
    qrCodeUrl?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    os?: SortOrderInput | SortOrder
    firstNameActivation?: SortOrderInput | SortOrder
    lastNameActivation?: SortOrderInput | SortOrder
    emailActivation?: SortOrderInput | SortOrder
    phoneActivation?: SortOrderInput | SortOrder
    streetActivation?: SortOrderInput | SortOrder
    buildingActivation?: SortOrderInput | SortOrder
    postalCodeActivation?: SortOrderInput | SortOrder
    cityActivation?: SortOrderInput | SortOrder
    countryActivation?: SortOrderInput | SortOrder
    formData?: SortOrderInput | SortOrder
    activationForm?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StatsEntryCountOrderByAggregateInput
    _avg?: StatsEntryAvgOrderByAggregateInput
    _max?: StatsEntryMaxOrderByAggregateInput
    _min?: StatsEntryMinOrderByAggregateInput
    _sum?: StatsEntrySumOrderByAggregateInput
  }

  export type StatsEntryScalarWhereWithAggregatesInput = {
    AND?: StatsEntryScalarWhereWithAggregatesInput | StatsEntryScalarWhereWithAggregatesInput[]
    OR?: StatsEntryScalarWhereWithAggregatesInput[]
    NOT?: StatsEntryScalarWhereWithAggregatesInput | StatsEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StatsEntry"> | string
    eventSlug?: StringWithAggregatesFilter<"StatsEntry"> | string
    entryId?: StringWithAggregatesFilter<"StatsEntry"> | string
    formId?: IntNullableWithAggregatesFilter<"StatsEntry"> | number | null
    email?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    phone?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    fullName?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    company?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    qrCode?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    qrCodeUrl?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    sourceUrl?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    status?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    os?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    firstNameActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    lastNameActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    emailActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    phoneActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    streetActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    buildingActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    postalCodeActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    cityActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    countryActivation?: StringNullableWithAggregatesFilter<"StatsEntry"> | string | null
    formData?: JsonNullableWithAggregatesFilter<"StatsEntry">
    activationForm?: JsonNullableWithAggregatesFilter<"StatsEntry">
    createdAt?: DateTimeWithAggregatesFilter<"StatsEntry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StatsEntry"> | Date | string
  }

  export type StatsEntryCreateInput = {
    id: string
    eventSlug: string
    entryId: string
    formId?: number | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    company?: string | null
    qrCode?: string | null
    qrCodeUrl?: string | null
    sourceUrl?: string | null
    status?: string | null
    userAgent?: string | null
    os?: string | null
    firstNameActivation?: string | null
    lastNameActivation?: string | null
    emailActivation?: string | null
    phoneActivation?: string | null
    streetActivation?: string | null
    buildingActivation?: string | null
    postalCodeActivation?: string | null
    cityActivation?: string | null
    countryActivation?: string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StatsEntryUncheckedCreateInput = {
    id: string
    eventSlug: string
    entryId: string
    formId?: number | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    company?: string | null
    qrCode?: string | null
    qrCodeUrl?: string | null
    sourceUrl?: string | null
    status?: string | null
    userAgent?: string | null
    os?: string | null
    firstNameActivation?: string | null
    lastNameActivation?: string | null
    emailActivation?: string | null
    phoneActivation?: string | null
    streetActivation?: string | null
    buildingActivation?: string | null
    postalCodeActivation?: string | null
    cityActivation?: string | null
    countryActivation?: string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StatsEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventSlug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    formId?: NullableIntFieldUpdateOperationsInput | number | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    emailActivation?: NullableStringFieldUpdateOperationsInput | string | null
    phoneActivation?: NullableStringFieldUpdateOperationsInput | string | null
    streetActivation?: NullableStringFieldUpdateOperationsInput | string | null
    buildingActivation?: NullableStringFieldUpdateOperationsInput | string | null
    postalCodeActivation?: NullableStringFieldUpdateOperationsInput | string | null
    cityActivation?: NullableStringFieldUpdateOperationsInput | string | null
    countryActivation?: NullableStringFieldUpdateOperationsInput | string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatsEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventSlug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    formId?: NullableIntFieldUpdateOperationsInput | number | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    emailActivation?: NullableStringFieldUpdateOperationsInput | string | null
    phoneActivation?: NullableStringFieldUpdateOperationsInput | string | null
    streetActivation?: NullableStringFieldUpdateOperationsInput | string | null
    buildingActivation?: NullableStringFieldUpdateOperationsInput | string | null
    postalCodeActivation?: NullableStringFieldUpdateOperationsInput | string | null
    cityActivation?: NullableStringFieldUpdateOperationsInput | string | null
    countryActivation?: NullableStringFieldUpdateOperationsInput | string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatsEntryCreateManyInput = {
    id: string
    eventSlug: string
    entryId: string
    formId?: number | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    company?: string | null
    qrCode?: string | null
    qrCodeUrl?: string | null
    sourceUrl?: string | null
    status?: string | null
    userAgent?: string | null
    os?: string | null
    firstNameActivation?: string | null
    lastNameActivation?: string | null
    emailActivation?: string | null
    phoneActivation?: string | null
    streetActivation?: string | null
    buildingActivation?: string | null
    postalCodeActivation?: string | null
    cityActivation?: string | null
    countryActivation?: string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StatsEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventSlug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    formId?: NullableIntFieldUpdateOperationsInput | number | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    emailActivation?: NullableStringFieldUpdateOperationsInput | string | null
    phoneActivation?: NullableStringFieldUpdateOperationsInput | string | null
    streetActivation?: NullableStringFieldUpdateOperationsInput | string | null
    buildingActivation?: NullableStringFieldUpdateOperationsInput | string | null
    postalCodeActivation?: NullableStringFieldUpdateOperationsInput | string | null
    cityActivation?: NullableStringFieldUpdateOperationsInput | string | null
    countryActivation?: NullableStringFieldUpdateOperationsInput | string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StatsEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventSlug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    formId?: NullableIntFieldUpdateOperationsInput | number | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    company?: NullableStringFieldUpdateOperationsInput | string | null
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    qrCodeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    os?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameActivation?: NullableStringFieldUpdateOperationsInput | string | null
    emailActivation?: NullableStringFieldUpdateOperationsInput | string | null
    phoneActivation?: NullableStringFieldUpdateOperationsInput | string | null
    streetActivation?: NullableStringFieldUpdateOperationsInput | string | null
    buildingActivation?: NullableStringFieldUpdateOperationsInput | string | null
    postalCodeActivation?: NullableStringFieldUpdateOperationsInput | string | null
    cityActivation?: NullableStringFieldUpdateOperationsInput | string | null
    countryActivation?: NullableStringFieldUpdateOperationsInput | string | null
    formData?: NullableJsonNullValueInput | InputJsonValue
    activationForm?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StatsEntryEventSlugEntryIdCompoundUniqueInput = {
    eventSlug: string
    entryId: string
  }

  export type StatsEntryCountOrderByAggregateInput = {
    id?: SortOrder
    eventSlug?: SortOrder
    entryId?: SortOrder
    formId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    company?: SortOrder
    qrCode?: SortOrder
    qrCodeUrl?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    userAgent?: SortOrder
    os?: SortOrder
    firstNameActivation?: SortOrder
    lastNameActivation?: SortOrder
    emailActivation?: SortOrder
    phoneActivation?: SortOrder
    streetActivation?: SortOrder
    buildingActivation?: SortOrder
    postalCodeActivation?: SortOrder
    cityActivation?: SortOrder
    countryActivation?: SortOrder
    formData?: SortOrder
    activationForm?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StatsEntryAvgOrderByAggregateInput = {
    formId?: SortOrder
  }

  export type StatsEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    eventSlug?: SortOrder
    entryId?: SortOrder
    formId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    company?: SortOrder
    qrCode?: SortOrder
    qrCodeUrl?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    userAgent?: SortOrder
    os?: SortOrder
    firstNameActivation?: SortOrder
    lastNameActivation?: SortOrder
    emailActivation?: SortOrder
    phoneActivation?: SortOrder
    streetActivation?: SortOrder
    buildingActivation?: SortOrder
    postalCodeActivation?: SortOrder
    cityActivation?: SortOrder
    countryActivation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StatsEntryMinOrderByAggregateInput = {
    id?: SortOrder
    eventSlug?: SortOrder
    entryId?: SortOrder
    formId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    company?: SortOrder
    qrCode?: SortOrder
    qrCodeUrl?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    userAgent?: SortOrder
    os?: SortOrder
    firstNameActivation?: SortOrder
    lastNameActivation?: SortOrder
    emailActivation?: SortOrder
    phoneActivation?: SortOrder
    streetActivation?: SortOrder
    buildingActivation?: SortOrder
    postalCodeActivation?: SortOrder
    cityActivation?: SortOrder
    countryActivation?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StatsEntrySumOrderByAggregateInput = {
    formId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}