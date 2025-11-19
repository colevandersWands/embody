/**
 * @file TypeScript type definitions for reference tracker
 * Comprehensive types for tracking all JavaScript values in execution traces
 */

/**
 * Wrapper object structure for all tracked values (references and primitives)
 */
export interface TrackedObject<T = unknown> {
  readonly value: T;
  readonly id: number | null;
  readonly secret: symbol;
  readonly type: string;
}

/**
 * Parameters for creating a tracker factory instance
 */
export interface TrackerFactoryOptions {
  readonly record?: WeakMap<object, TrackedObject>;
  readonly id?: number;
  readonly secret?: symbol;
}

/**
 * Function signature for the track function
 */
export type TrackFunction = <T>(
  referenced: T,
  tracked?: WeakMap<object, TrackedObject>
) => TrackedObject<T>;

/**
 * Function signature for the untrack function
 */
export type UntrackFunction = <T>(value: T) => T extends TrackedObject<infer U> ? U : T;

/**
 * Function signature for the tracker function returned by trackerFactory
 */
export type TrackerFunction = <T>(value: T) => TrackedObject<T>;

/**
 * Legacy type - now all JavaScript values are trackable, not just references
 * Kept for backwards compatibility
 */
export type TrackableReferenceType = 
  | object
  | unknown[]
  | Function
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Date
  | RegExp
  | Error;

/**
 * Type guard to check if a value is a tracked object
 */
export interface TrackedObjectTypeGuard {
  (value: unknown, secret: symbol): value is TrackedObject<unknown>;
}

/**
 * Reference type detection utility
 */
export interface ReferenceTypeDetector {
  (value: unknown): value is TrackableReferenceType;
}

/**
 * Constructor type information for tracked objects
 */
export type ConstructorType = 
  | 'Object'
  | 'Array' 
  | 'Function'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
  | 'Date'
  | 'RegExp'
  | 'Error'
  | 'Promise'
  | 'Proxy'
  | string; // For other constructor names






/**
 * Utility type to extract the wrapped type from a TrackedObject
 */
export type ExtractWrappedType<T> = T extends TrackedObject<infer U> ? U : never;


/**
 * Result type returned by trackerFactory containing all tracking utilities
 */
export interface TrackerFactoryResult {
  wrap: TrackFunction;
  unwrap: <T>(value: T) => T extends TrackedObject<infer U> ? U : T;
  shadow: TrackerFunction;
}

/**
 * Function type for the complete tracker factory
 */
export interface TrackerFactory {
  (options?: TrackerFactoryOptions): TrackerFactoryResult;
}

/**
 * Modular API Types for the new architecture
 */

/**
 * Function that creates wrapping closures
 */
export type WrapFunction = (secret?: symbol, startId?: number) => <T>(
  referenced: T, 
  tracked?: WeakMap<object, TrackedObject>
) => TrackedObject<T>;

/**
 * Function that creates unwrapping closures
 */
export type UnwrapFunction = (secret?: symbol) => <T>(
  value: T, 
  unwrapped?: WeakMap<object, any>
) => T extends TrackedObject<infer U> ? U : T;

/**
 * Function that creates shadowing closures
 */
export type ShadowFunction = (record: WeakMap<object, TrackedObject>, wrapFn: (value: any) => any) => <T>(
  value: T
) => TrackedObject<T>;

/**
 * Function that creates complete tracker factories
 */
export type FactoryFunction = (options?: TrackerFactoryOptions) => {
  wrap: ReturnType<WrapFunction>;
  unwrap: ReturnType<UnwrapFunction>;
  shadow: ReturnType<ShadowFunction>;
};