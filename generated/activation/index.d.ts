
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
 * Model ActivationEntry
 * 
 */
export type ActivationEntry = $Result.DefaultSelection<Prisma.$ActivationEntryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ActivationEntries
 * const activationEntries = await prisma.activationEntry.findMany()
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
   * // Fetch zero or more ActivationEntries
   * const activationEntries = await prisma.activationEntry.findMany()
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
   * `prisma.activationEntry`: Exposes CRUD operations for the **ActivationEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActivationEntries
    * const activationEntries = await prisma.activationEntry.findMany()
    * ```
    */
  get activationEntry(): Prisma.ActivationEntryDelegate<ExtArgs, ClientOptions>;
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
    ActivationEntry: 'ActivationEntry'
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
      modelProps: "activationEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ActivationEntry: {
        payload: Prisma.$ActivationEntryPayload<ExtArgs>
        fields: Prisma.ActivationEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActivationEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActivationEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          findFirst: {
            args: Prisma.ActivationEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActivationEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          findMany: {
            args: Prisma.ActivationEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>[]
          }
          create: {
            args: Prisma.ActivationEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          createMany: {
            args: Prisma.ActivationEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActivationEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>[]
          }
          delete: {
            args: Prisma.ActivationEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          update: {
            args: Prisma.ActivationEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          deleteMany: {
            args: Prisma.ActivationEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActivationEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActivationEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>[]
          }
          upsert: {
            args: Prisma.ActivationEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActivationEntryPayload>
          }
          aggregate: {
            args: Prisma.ActivationEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivationEntry>
          }
          groupBy: {
            args: Prisma.ActivationEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivationEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActivationEntryCountArgs<ExtArgs>
            result: $Utils.Optional<ActivationEntryCountAggregateOutputType> | number
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
    activationEntry?: ActivationEntryOmit
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
   * Model ActivationEntry
   */

  export type AggregateActivationEntry = {
    _count: ActivationEntryCountAggregateOutputType | null
    _min: ActivationEntryMinAggregateOutputType | null
    _max: ActivationEntryMaxAggregateOutputType | null
  }

  export type ActivationEntryMinAggregateOutputType = {
    id: string | null
    slug: string | null
    entryId: string | null
    qrCode: string | null
    email: string | null
    phone: string | null
    fullName: string | null
    streetAddress: string | null
    houseNumber: string | null
    apartmentNumber: string | null
    postalCode: string | null
    city: string | null
    country: string | null
    domain: string | null
    badge: string | null
    fairYear: string | null
    fairDate: string | null
    createdAt: Date | null
  }

  export type ActivationEntryMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    entryId: string | null
    qrCode: string | null
    email: string | null
    phone: string | null
    fullName: string | null
    streetAddress: string | null
    houseNumber: string | null
    apartmentNumber: string | null
    postalCode: string | null
    city: string | null
    country: string | null
    domain: string | null
    badge: string | null
    fairYear: string | null
    fairDate: string | null
    createdAt: Date | null
  }

  export type ActivationEntryCountAggregateOutputType = {
    id: number
    slug: number
    entryId: number
    qrCode: number
    email: number
    phone: number
    fullName: number
    streetAddress: number
    houseNumber: number
    apartmentNumber: number
    postalCode: number
    city: number
    country: number
    domain: number
    badge: number
    fairYear: number
    fairDate: number
    createdAt: number
    _all: number
  }


  export type ActivationEntryMinAggregateInputType = {
    id?: true
    slug?: true
    entryId?: true
    qrCode?: true
    email?: true
    phone?: true
    fullName?: true
    streetAddress?: true
    houseNumber?: true
    apartmentNumber?: true
    postalCode?: true
    city?: true
    country?: true
    domain?: true
    badge?: true
    fairYear?: true
    fairDate?: true
    createdAt?: true
  }

  export type ActivationEntryMaxAggregateInputType = {
    id?: true
    slug?: true
    entryId?: true
    qrCode?: true
    email?: true
    phone?: true
    fullName?: true
    streetAddress?: true
    houseNumber?: true
    apartmentNumber?: true
    postalCode?: true
    city?: true
    country?: true
    domain?: true
    badge?: true
    fairYear?: true
    fairDate?: true
    createdAt?: true
  }

  export type ActivationEntryCountAggregateInputType = {
    id?: true
    slug?: true
    entryId?: true
    qrCode?: true
    email?: true
    phone?: true
    fullName?: true
    streetAddress?: true
    houseNumber?: true
    apartmentNumber?: true
    postalCode?: true
    city?: true
    country?: true
    domain?: true
    badge?: true
    fairYear?: true
    fairDate?: true
    createdAt?: true
    _all?: true
  }

  export type ActivationEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivationEntry to aggregate.
     */
    where?: ActivationEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivationEntries to fetch.
     */
    orderBy?: ActivationEntryOrderByWithRelationInput | ActivationEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActivationEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivationEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivationEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActivationEntries
    **/
    _count?: true | ActivationEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivationEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivationEntryMaxAggregateInputType
  }

  export type GetActivationEntryAggregateType<T extends ActivationEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateActivationEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivationEntry[P]>
      : GetScalarType<T[P], AggregateActivationEntry[P]>
  }




  export type ActivationEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActivationEntryWhereInput
    orderBy?: ActivationEntryOrderByWithAggregationInput | ActivationEntryOrderByWithAggregationInput[]
    by: ActivationEntryScalarFieldEnum[] | ActivationEntryScalarFieldEnum
    having?: ActivationEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivationEntryCountAggregateInputType | true
    _min?: ActivationEntryMinAggregateInputType
    _max?: ActivationEntryMaxAggregateInputType
  }

  export type ActivationEntryGroupByOutputType = {
    id: string
    slug: string
    entryId: string
    qrCode: string | null
    email: string | null
    phone: string | null
    fullName: string | null
    streetAddress: string | null
    houseNumber: string | null
    apartmentNumber: string | null
    postalCode: string | null
    city: string | null
    country: string | null
    domain: string | null
    badge: string | null
    fairYear: string | null
    fairDate: string | null
    createdAt: Date
    _count: ActivationEntryCountAggregateOutputType | null
    _min: ActivationEntryMinAggregateOutputType | null
    _max: ActivationEntryMaxAggregateOutputType | null
  }

  type GetActivationEntryGroupByPayload<T extends ActivationEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivationEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivationEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivationEntryGroupByOutputType[P]>
            : GetScalarType<T[P], ActivationEntryGroupByOutputType[P]>
        }
      >
    >


  export type ActivationEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    entryId?: boolean
    qrCode?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    streetAddress?: boolean
    houseNumber?: boolean
    apartmentNumber?: boolean
    postalCode?: boolean
    city?: boolean
    country?: boolean
    domain?: boolean
    badge?: boolean
    fairYear?: boolean
    fairDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["activationEntry"]>

  export type ActivationEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    entryId?: boolean
    qrCode?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    streetAddress?: boolean
    houseNumber?: boolean
    apartmentNumber?: boolean
    postalCode?: boolean
    city?: boolean
    country?: boolean
    domain?: boolean
    badge?: boolean
    fairYear?: boolean
    fairDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["activationEntry"]>

  export type ActivationEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    entryId?: boolean
    qrCode?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    streetAddress?: boolean
    houseNumber?: boolean
    apartmentNumber?: boolean
    postalCode?: boolean
    city?: boolean
    country?: boolean
    domain?: boolean
    badge?: boolean
    fairYear?: boolean
    fairDate?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["activationEntry"]>

  export type ActivationEntrySelectScalar = {
    id?: boolean
    slug?: boolean
    entryId?: boolean
    qrCode?: boolean
    email?: boolean
    phone?: boolean
    fullName?: boolean
    streetAddress?: boolean
    houseNumber?: boolean
    apartmentNumber?: boolean
    postalCode?: boolean
    city?: boolean
    country?: boolean
    domain?: boolean
    badge?: boolean
    fairYear?: boolean
    fairDate?: boolean
    createdAt?: boolean
  }

  export type ActivationEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "entryId" | "qrCode" | "email" | "phone" | "fullName" | "streetAddress" | "houseNumber" | "apartmentNumber" | "postalCode" | "city" | "country" | "domain" | "badge" | "fairYear" | "fairDate" | "createdAt", ExtArgs["result"]["activationEntry"]>

  export type $ActivationEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActivationEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      entryId: string
      qrCode: string | null
      email: string | null
      phone: string | null
      fullName: string | null
      streetAddress: string | null
      houseNumber: string | null
      apartmentNumber: string | null
      postalCode: string | null
      city: string | null
      country: string | null
      domain: string | null
      badge: string | null
      fairYear: string | null
      fairDate: string | null
      createdAt: Date
    }, ExtArgs["result"]["activationEntry"]>
    composites: {}
  }

  type ActivationEntryGetPayload<S extends boolean | null | undefined | ActivationEntryDefaultArgs> = $Result.GetResult<Prisma.$ActivationEntryPayload, S>

  type ActivationEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActivationEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActivationEntryCountAggregateInputType | true
    }

  export interface ActivationEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActivationEntry'], meta: { name: 'ActivationEntry' } }
    /**
     * Find zero or one ActivationEntry that matches the filter.
     * @param {ActivationEntryFindUniqueArgs} args - Arguments to find a ActivationEntry
     * @example
     * // Get one ActivationEntry
     * const activationEntry = await prisma.activationEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActivationEntryFindUniqueArgs>(args: SelectSubset<T, ActivationEntryFindUniqueArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ActivationEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActivationEntryFindUniqueOrThrowArgs} args - Arguments to find a ActivationEntry
     * @example
     * // Get one ActivationEntry
     * const activationEntry = await prisma.activationEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActivationEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, ActivationEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActivationEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryFindFirstArgs} args - Arguments to find a ActivationEntry
     * @example
     * // Get one ActivationEntry
     * const activationEntry = await prisma.activationEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActivationEntryFindFirstArgs>(args?: SelectSubset<T, ActivationEntryFindFirstArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActivationEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryFindFirstOrThrowArgs} args - Arguments to find a ActivationEntry
     * @example
     * // Get one ActivationEntry
     * const activationEntry = await prisma.activationEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActivationEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, ActivationEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ActivationEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActivationEntries
     * const activationEntries = await prisma.activationEntry.findMany()
     * 
     * // Get first 10 ActivationEntries
     * const activationEntries = await prisma.activationEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activationEntryWithIdOnly = await prisma.activationEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActivationEntryFindManyArgs>(args?: SelectSubset<T, ActivationEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ActivationEntry.
     * @param {ActivationEntryCreateArgs} args - Arguments to create a ActivationEntry.
     * @example
     * // Create one ActivationEntry
     * const ActivationEntry = await prisma.activationEntry.create({
     *   data: {
     *     // ... data to create a ActivationEntry
     *   }
     * })
     * 
     */
    create<T extends ActivationEntryCreateArgs>(args: SelectSubset<T, ActivationEntryCreateArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ActivationEntries.
     * @param {ActivationEntryCreateManyArgs} args - Arguments to create many ActivationEntries.
     * @example
     * // Create many ActivationEntries
     * const activationEntry = await prisma.activationEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActivationEntryCreateManyArgs>(args?: SelectSubset<T, ActivationEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActivationEntries and returns the data saved in the database.
     * @param {ActivationEntryCreateManyAndReturnArgs} args - Arguments to create many ActivationEntries.
     * @example
     * // Create many ActivationEntries
     * const activationEntry = await prisma.activationEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActivationEntries and only return the `id`
     * const activationEntryWithIdOnly = await prisma.activationEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActivationEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, ActivationEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ActivationEntry.
     * @param {ActivationEntryDeleteArgs} args - Arguments to delete one ActivationEntry.
     * @example
     * // Delete one ActivationEntry
     * const ActivationEntry = await prisma.activationEntry.delete({
     *   where: {
     *     // ... filter to delete one ActivationEntry
     *   }
     * })
     * 
     */
    delete<T extends ActivationEntryDeleteArgs>(args: SelectSubset<T, ActivationEntryDeleteArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ActivationEntry.
     * @param {ActivationEntryUpdateArgs} args - Arguments to update one ActivationEntry.
     * @example
     * // Update one ActivationEntry
     * const activationEntry = await prisma.activationEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActivationEntryUpdateArgs>(args: SelectSubset<T, ActivationEntryUpdateArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ActivationEntries.
     * @param {ActivationEntryDeleteManyArgs} args - Arguments to filter ActivationEntries to delete.
     * @example
     * // Delete a few ActivationEntries
     * const { count } = await prisma.activationEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActivationEntryDeleteManyArgs>(args?: SelectSubset<T, ActivationEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivationEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActivationEntries
     * const activationEntry = await prisma.activationEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActivationEntryUpdateManyArgs>(args: SelectSubset<T, ActivationEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivationEntries and returns the data updated in the database.
     * @param {ActivationEntryUpdateManyAndReturnArgs} args - Arguments to update many ActivationEntries.
     * @example
     * // Update many ActivationEntries
     * const activationEntry = await prisma.activationEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ActivationEntries and only return the `id`
     * const activationEntryWithIdOnly = await prisma.activationEntry.updateManyAndReturn({
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
    updateManyAndReturn<T extends ActivationEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, ActivationEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ActivationEntry.
     * @param {ActivationEntryUpsertArgs} args - Arguments to update or create a ActivationEntry.
     * @example
     * // Update or create a ActivationEntry
     * const activationEntry = await prisma.activationEntry.upsert({
     *   create: {
     *     // ... data to create a ActivationEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActivationEntry we want to update
     *   }
     * })
     */
    upsert<T extends ActivationEntryUpsertArgs>(args: SelectSubset<T, ActivationEntryUpsertArgs<ExtArgs>>): Prisma__ActivationEntryClient<$Result.GetResult<Prisma.$ActivationEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ActivationEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryCountArgs} args - Arguments to filter ActivationEntries to count.
     * @example
     * // Count the number of ActivationEntries
     * const count = await prisma.activationEntry.count({
     *   where: {
     *     // ... the filter for the ActivationEntries we want to count
     *   }
     * })
    **/
    count<T extends ActivationEntryCountArgs>(
      args?: Subset<T, ActivationEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivationEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActivationEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ActivationEntryAggregateArgs>(args: Subset<T, ActivationEntryAggregateArgs>): Prisma.PrismaPromise<GetActivationEntryAggregateType<T>>

    /**
     * Group by ActivationEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivationEntryGroupByArgs} args - Group by arguments.
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
      T extends ActivationEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActivationEntryGroupByArgs['orderBy'] }
        : { orderBy?: ActivationEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ActivationEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivationEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActivationEntry model
   */
  readonly fields: ActivationEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActivationEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActivationEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ActivationEntry model
   */
  interface ActivationEntryFieldRefs {
    readonly id: FieldRef<"ActivationEntry", 'String'>
    readonly slug: FieldRef<"ActivationEntry", 'String'>
    readonly entryId: FieldRef<"ActivationEntry", 'String'>
    readonly qrCode: FieldRef<"ActivationEntry", 'String'>
    readonly email: FieldRef<"ActivationEntry", 'String'>
    readonly phone: FieldRef<"ActivationEntry", 'String'>
    readonly fullName: FieldRef<"ActivationEntry", 'String'>
    readonly streetAddress: FieldRef<"ActivationEntry", 'String'>
    readonly houseNumber: FieldRef<"ActivationEntry", 'String'>
    readonly apartmentNumber: FieldRef<"ActivationEntry", 'String'>
    readonly postalCode: FieldRef<"ActivationEntry", 'String'>
    readonly city: FieldRef<"ActivationEntry", 'String'>
    readonly country: FieldRef<"ActivationEntry", 'String'>
    readonly domain: FieldRef<"ActivationEntry", 'String'>
    readonly badge: FieldRef<"ActivationEntry", 'String'>
    readonly fairYear: FieldRef<"ActivationEntry", 'String'>
    readonly fairDate: FieldRef<"ActivationEntry", 'String'>
    readonly createdAt: FieldRef<"ActivationEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActivationEntry findUnique
   */
  export type ActivationEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter, which ActivationEntry to fetch.
     */
    where: ActivationEntryWhereUniqueInput
  }

  /**
   * ActivationEntry findUniqueOrThrow
   */
  export type ActivationEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter, which ActivationEntry to fetch.
     */
    where: ActivationEntryWhereUniqueInput
  }

  /**
   * ActivationEntry findFirst
   */
  export type ActivationEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter, which ActivationEntry to fetch.
     */
    where?: ActivationEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivationEntries to fetch.
     */
    orderBy?: ActivationEntryOrderByWithRelationInput | ActivationEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivationEntries.
     */
    cursor?: ActivationEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivationEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivationEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivationEntries.
     */
    distinct?: ActivationEntryScalarFieldEnum | ActivationEntryScalarFieldEnum[]
  }

  /**
   * ActivationEntry findFirstOrThrow
   */
  export type ActivationEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter, which ActivationEntry to fetch.
     */
    where?: ActivationEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivationEntries to fetch.
     */
    orderBy?: ActivationEntryOrderByWithRelationInput | ActivationEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivationEntries.
     */
    cursor?: ActivationEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivationEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivationEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivationEntries.
     */
    distinct?: ActivationEntryScalarFieldEnum | ActivationEntryScalarFieldEnum[]
  }

  /**
   * ActivationEntry findMany
   */
  export type ActivationEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter, which ActivationEntries to fetch.
     */
    where?: ActivationEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivationEntries to fetch.
     */
    orderBy?: ActivationEntryOrderByWithRelationInput | ActivationEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActivationEntries.
     */
    cursor?: ActivationEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivationEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivationEntries.
     */
    skip?: number
    distinct?: ActivationEntryScalarFieldEnum | ActivationEntryScalarFieldEnum[]
  }

  /**
   * ActivationEntry create
   */
  export type ActivationEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a ActivationEntry.
     */
    data: XOR<ActivationEntryCreateInput, ActivationEntryUncheckedCreateInput>
  }

  /**
   * ActivationEntry createMany
   */
  export type ActivationEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActivationEntries.
     */
    data: ActivationEntryCreateManyInput | ActivationEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActivationEntry createManyAndReturn
   */
  export type ActivationEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * The data used to create many ActivationEntries.
     */
    data: ActivationEntryCreateManyInput | ActivationEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActivationEntry update
   */
  export type ActivationEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a ActivationEntry.
     */
    data: XOR<ActivationEntryUpdateInput, ActivationEntryUncheckedUpdateInput>
    /**
     * Choose, which ActivationEntry to update.
     */
    where: ActivationEntryWhereUniqueInput
  }

  /**
   * ActivationEntry updateMany
   */
  export type ActivationEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActivationEntries.
     */
    data: XOR<ActivationEntryUpdateManyMutationInput, ActivationEntryUncheckedUpdateManyInput>
    /**
     * Filter which ActivationEntries to update
     */
    where?: ActivationEntryWhereInput
    /**
     * Limit how many ActivationEntries to update.
     */
    limit?: number
  }

  /**
   * ActivationEntry updateManyAndReturn
   */
  export type ActivationEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * The data used to update ActivationEntries.
     */
    data: XOR<ActivationEntryUpdateManyMutationInput, ActivationEntryUncheckedUpdateManyInput>
    /**
     * Filter which ActivationEntries to update
     */
    where?: ActivationEntryWhereInput
    /**
     * Limit how many ActivationEntries to update.
     */
    limit?: number
  }

  /**
   * ActivationEntry upsert
   */
  export type ActivationEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the ActivationEntry to update in case it exists.
     */
    where: ActivationEntryWhereUniqueInput
    /**
     * In case the ActivationEntry found by the `where` argument doesn't exist, create a new ActivationEntry with this data.
     */
    create: XOR<ActivationEntryCreateInput, ActivationEntryUncheckedCreateInput>
    /**
     * In case the ActivationEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActivationEntryUpdateInput, ActivationEntryUncheckedUpdateInput>
  }

  /**
   * ActivationEntry delete
   */
  export type ActivationEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
    /**
     * Filter which ActivationEntry to delete.
     */
    where: ActivationEntryWhereUniqueInput
  }

  /**
   * ActivationEntry deleteMany
   */
  export type ActivationEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivationEntries to delete
     */
    where?: ActivationEntryWhereInput
    /**
     * Limit how many ActivationEntries to delete.
     */
    limit?: number
  }

  /**
   * ActivationEntry without action
   */
  export type ActivationEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActivationEntry
     */
    select?: ActivationEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActivationEntry
     */
    omit?: ActivationEntryOmit<ExtArgs> | null
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


  export const ActivationEntryScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    entryId: 'entryId',
    qrCode: 'qrCode',
    email: 'email',
    phone: 'phone',
    fullName: 'fullName',
    streetAddress: 'streetAddress',
    houseNumber: 'houseNumber',
    apartmentNumber: 'apartmentNumber',
    postalCode: 'postalCode',
    city: 'city',
    country: 'country',
    domain: 'domain',
    badge: 'badge',
    fairYear: 'fairYear',
    fairDate: 'fairDate',
    createdAt: 'createdAt'
  };

  export type ActivationEntryScalarFieldEnum = (typeof ActivationEntryScalarFieldEnum)[keyof typeof ActivationEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ActivationEntryWhereInput = {
    AND?: ActivationEntryWhereInput | ActivationEntryWhereInput[]
    OR?: ActivationEntryWhereInput[]
    NOT?: ActivationEntryWhereInput | ActivationEntryWhereInput[]
    id?: StringFilter<"ActivationEntry"> | string
    slug?: StringFilter<"ActivationEntry"> | string
    entryId?: StringFilter<"ActivationEntry"> | string
    qrCode?: StringNullableFilter<"ActivationEntry"> | string | null
    email?: StringNullableFilter<"ActivationEntry"> | string | null
    phone?: StringNullableFilter<"ActivationEntry"> | string | null
    fullName?: StringNullableFilter<"ActivationEntry"> | string | null
    streetAddress?: StringNullableFilter<"ActivationEntry"> | string | null
    houseNumber?: StringNullableFilter<"ActivationEntry"> | string | null
    apartmentNumber?: StringNullableFilter<"ActivationEntry"> | string | null
    postalCode?: StringNullableFilter<"ActivationEntry"> | string | null
    city?: StringNullableFilter<"ActivationEntry"> | string | null
    country?: StringNullableFilter<"ActivationEntry"> | string | null
    domain?: StringNullableFilter<"ActivationEntry"> | string | null
    badge?: StringNullableFilter<"ActivationEntry"> | string | null
    fairYear?: StringNullableFilter<"ActivationEntry"> | string | null
    fairDate?: StringNullableFilter<"ActivationEntry"> | string | null
    createdAt?: DateTimeFilter<"ActivationEntry"> | Date | string
  }

  export type ActivationEntryOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    entryId?: SortOrder
    qrCode?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    streetAddress?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    apartmentNumber?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    domain?: SortOrderInput | SortOrder
    badge?: SortOrderInput | SortOrder
    fairYear?: SortOrderInput | SortOrder
    fairDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ActivationEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug_entryId?: ActivationEntrySlugEntryIdCompoundUniqueInput
    AND?: ActivationEntryWhereInput | ActivationEntryWhereInput[]
    OR?: ActivationEntryWhereInput[]
    NOT?: ActivationEntryWhereInput | ActivationEntryWhereInput[]
    slug?: StringFilter<"ActivationEntry"> | string
    entryId?: StringFilter<"ActivationEntry"> | string
    qrCode?: StringNullableFilter<"ActivationEntry"> | string | null
    email?: StringNullableFilter<"ActivationEntry"> | string | null
    phone?: StringNullableFilter<"ActivationEntry"> | string | null
    fullName?: StringNullableFilter<"ActivationEntry"> | string | null
    streetAddress?: StringNullableFilter<"ActivationEntry"> | string | null
    houseNumber?: StringNullableFilter<"ActivationEntry"> | string | null
    apartmentNumber?: StringNullableFilter<"ActivationEntry"> | string | null
    postalCode?: StringNullableFilter<"ActivationEntry"> | string | null
    city?: StringNullableFilter<"ActivationEntry"> | string | null
    country?: StringNullableFilter<"ActivationEntry"> | string | null
    domain?: StringNullableFilter<"ActivationEntry"> | string | null
    badge?: StringNullableFilter<"ActivationEntry"> | string | null
    fairYear?: StringNullableFilter<"ActivationEntry"> | string | null
    fairDate?: StringNullableFilter<"ActivationEntry"> | string | null
    createdAt?: DateTimeFilter<"ActivationEntry"> | Date | string
  }, "id" | "slug_entryId">

  export type ActivationEntryOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    entryId?: SortOrder
    qrCode?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    streetAddress?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    apartmentNumber?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    domain?: SortOrderInput | SortOrder
    badge?: SortOrderInput | SortOrder
    fairYear?: SortOrderInput | SortOrder
    fairDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ActivationEntryCountOrderByAggregateInput
    _max?: ActivationEntryMaxOrderByAggregateInput
    _min?: ActivationEntryMinOrderByAggregateInput
  }

  export type ActivationEntryScalarWhereWithAggregatesInput = {
    AND?: ActivationEntryScalarWhereWithAggregatesInput | ActivationEntryScalarWhereWithAggregatesInput[]
    OR?: ActivationEntryScalarWhereWithAggregatesInput[]
    NOT?: ActivationEntryScalarWhereWithAggregatesInput | ActivationEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActivationEntry"> | string
    slug?: StringWithAggregatesFilter<"ActivationEntry"> | string
    entryId?: StringWithAggregatesFilter<"ActivationEntry"> | string
    qrCode?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    email?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    phone?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    fullName?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    streetAddress?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    houseNumber?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    apartmentNumber?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    city?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    country?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    domain?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    badge?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    fairYear?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    fairDate?: StringNullableWithAggregatesFilter<"ActivationEntry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ActivationEntry"> | Date | string
  }

  export type ActivationEntryCreateInput = {
    id?: string
    slug: string
    entryId: string
    qrCode?: string | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    streetAddress?: string | null
    houseNumber?: string | null
    apartmentNumber?: string | null
    postalCode?: string | null
    city?: string | null
    country?: string | null
    domain?: string | null
    badge?: string | null
    fairYear?: string | null
    fairDate?: string | null
    createdAt?: Date | string
  }

  export type ActivationEntryUncheckedCreateInput = {
    id?: string
    slug: string
    entryId: string
    qrCode?: string | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    streetAddress?: string | null
    houseNumber?: string | null
    apartmentNumber?: string | null
    postalCode?: string | null
    city?: string | null
    country?: string | null
    domain?: string | null
    badge?: string | null
    fairYear?: string | null
    fairDate?: string | null
    createdAt?: Date | string
  }

  export type ActivationEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    streetAddress?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    apartmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    fairYear?: NullableStringFieldUpdateOperationsInput | string | null
    fairDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivationEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    streetAddress?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    apartmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    fairYear?: NullableStringFieldUpdateOperationsInput | string | null
    fairDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivationEntryCreateManyInput = {
    id?: string
    slug: string
    entryId: string
    qrCode?: string | null
    email?: string | null
    phone?: string | null
    fullName?: string | null
    streetAddress?: string | null
    houseNumber?: string | null
    apartmentNumber?: string | null
    postalCode?: string | null
    city?: string | null
    country?: string | null
    domain?: string | null
    badge?: string | null
    fairYear?: string | null
    fairDate?: string | null
    createdAt?: Date | string
  }

  export type ActivationEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    streetAddress?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    apartmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    fairYear?: NullableStringFieldUpdateOperationsInput | string | null
    fairDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActivationEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    entryId?: StringFieldUpdateOperationsInput | string
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    streetAddress?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    apartmentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: NullableStringFieldUpdateOperationsInput | string | null
    badge?: NullableStringFieldUpdateOperationsInput | string | null
    fairYear?: NullableStringFieldUpdateOperationsInput | string | null
    fairDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ActivationEntrySlugEntryIdCompoundUniqueInput = {
    slug: string
    entryId: string
  }

  export type ActivationEntryCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    entryId?: SortOrder
    qrCode?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    streetAddress?: SortOrder
    houseNumber?: SortOrder
    apartmentNumber?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    country?: SortOrder
    domain?: SortOrder
    badge?: SortOrder
    fairYear?: SortOrder
    fairDate?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivationEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    entryId?: SortOrder
    qrCode?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    streetAddress?: SortOrder
    houseNumber?: SortOrder
    apartmentNumber?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    country?: SortOrder
    domain?: SortOrder
    badge?: SortOrder
    fairYear?: SortOrder
    fairDate?: SortOrder
    createdAt?: SortOrder
  }

  export type ActivationEntryMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    entryId?: SortOrder
    qrCode?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    fullName?: SortOrder
    streetAddress?: SortOrder
    houseNumber?: SortOrder
    apartmentNumber?: SortOrder
    postalCode?: SortOrder
    city?: SortOrder
    country?: SortOrder
    domain?: SortOrder
    badge?: SortOrder
    fairYear?: SortOrder
    fairDate?: SortOrder
    createdAt?: SortOrder
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