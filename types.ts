/**
 * @file Centralized TypeScript type definitions for functional execution tracer
 * Comprehensive type definitions for all tracer components
 */

// ============================================================================
// Core Event Types
// ============================================================================

/** Event type constants */
export const EVENT_TYPES = {
  CALL: 'call',
  VARIABLE: 'variable',
  CONTROL: 'control',
  BLOCK: 'block',
  ASYNC: 'async',
  VALUE: 'value'
} as const;

/** Event subtype constants */
export const EVENT_SUBTYPES = {
  // Call subtypes
  APPLY: 'apply',
  CONSTRUCT: 'construct',
  
  // Variable subtypes
  READ: 'read',
  WRITE: 'write',
  DECLARE: 'declare',
  
  // Control subtypes
  TEST: 'test',
  BREAK: 'break',
  
  // Block subtypes
  ENTER: 'enter',
  EXIT: 'exit',
  
  // Async subtypes
  AWAIT: 'await',
  YIELD: 'yield',
  
  // Value subtypes
  PRIMITIVE: 'primitive',
  INTRINSIC: 'intrinsic',
  CLOSURE: 'closure'
} as const;

/** Event type union */
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

/** Event subtype union */
export type EventSubtype = typeof EVENT_SUBTYPES[keyof typeof EVENT_SUBTYPES];

/** Base trace event structure */
export interface TraceEvent {
  readonly type: EventType;
  readonly subtype: EventSubtype;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** Call event specific structure */
export interface CallEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.CALL;
  readonly subtype: typeof EVENT_SUBTYPES.APPLY | typeof EVENT_SUBTYPES.CONSTRUCT;
  readonly values: Readonly<{
    callee: unknown;
    this?: unknown;
    args: readonly unknown[];
    result?: unknown;
  }>;
  readonly metadata: Readonly<{
    functionName: string;
    phase?: 'enter' | 'exit';
    blackboxed?: boolean;
    error?: unknown;
    [key: string]: unknown;
  }>;
}

/** Variable event specific structure */
export interface VariableEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.VARIABLE;
  readonly subtype: typeof EVENT_SUBTYPES.READ | typeof EVENT_SUBTYPES.WRITE | typeof EVENT_SUBTYPES.DECLARE;
  readonly values: Readonly<{
    value: unknown;
  }>;
  readonly metadata: Readonly<{
    variableName: string;
    isTDZ?: boolean;
    kind?: 'var' | 'let' | 'const' | 'function' | 'class';
    [key: string]: unknown;
  }>;
}

/** Control flow event specific structure */
export interface ControlEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.CONTROL;
  readonly subtype: typeof EVENT_SUBTYPES.TEST | typeof EVENT_SUBTYPES.BREAK;
  readonly values: Readonly<{
    condition?: unknown;
  }>;
  readonly metadata: Readonly<{
    truthyValue?: boolean;
    label?: string | null;
    [key: string]: unknown;
  }>;
}

/** Block event specific structure */
export interface BlockEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.BLOCK;
  readonly subtype: typeof EVENT_SUBTYPES.ENTER | typeof EVENT_SUBTYPES.EXIT;
  readonly values: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<{
    blockType: string;
    scopeId?: string;
    [key: string]: unknown;
  }>;
}

/** Async event specific structure */
export interface AsyncEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.ASYNC;
  readonly subtype: typeof EVENT_SUBTYPES.AWAIT | typeof EVENT_SUBTYPES.YIELD;
  readonly values: Readonly<{
    value: unknown;
  }>;
  readonly metadata: Readonly<{
    phase?: 'suspend' | 'resume';
    [key: string]: unknown;
  }>;
}

/** Value event specific structure */
export interface ValueEvent extends TraceEvent {
  readonly type: typeof EVENT_TYPES.VALUE;
  readonly subtype: typeof EVENT_SUBTYPES.PRIMITIVE | typeof EVENT_SUBTYPES.INTRINSIC | typeof EVENT_SUBTYPES.CLOSURE;
  readonly values: Readonly<{
    value: unknown;
  }>;
  readonly metadata: Readonly<{
    primitiveType?: string;
    intrinsicName?: string;
    functionName?: string;
    [key: string]: unknown;
  }>;
}

/** Union type for all specific events */
export type SpecificTraceEvent = CallEvent | VariableEvent | ControlEvent | BlockEvent | AsyncEvent | ValueEvent;

// ============================================================================
// Configuration Types
// ============================================================================

/** Filter function type for variables and functions */
export type FilterFunction<T = string> = (item: T) => boolean;

/** Blackbox option types */
export type BlackboxOption = boolean | RegExp | FilterFunction<Function>;

/** Variable filter option types */
export type VariableFilterOption = null | RegExp | FilterFunction<string>;

/** Function calls configuration */
export interface FunctionCallsConfig {
  readonly enabled: boolean;
  readonly blackbox: BlackboxOption;
  readonly trackThis: boolean;
}

/** Variables configuration */
export interface VariablesConfig {
  readonly enabled: boolean;
  readonly filter: VariableFilterOption;
  readonly includeTDZ: boolean;
}

/** Operators configuration */
export interface OperatorsConfig {
  readonly enabled: boolean;
  readonly valueProducing: boolean;
  readonly controlFlow: boolean;
}

/** Blocks configuration */
export interface BlocksConfig {
  readonly enabled: boolean;
  readonly includeDeclarations: boolean;
}

/** Async configuration */
export interface AsyncConfig {
  readonly enabled: boolean;
  readonly trackPromises: boolean;
  readonly trackGenerators: boolean;
}

/** Serialization configuration */
export interface SerializationConfig {
  readonly enabled: boolean;
  readonly depth: number;
  readonly maxStringLength: number;
  readonly includeCircular: boolean;
}

/** Performance configuration */
export interface PerformanceConfig {
  readonly maxEvents: number;
  readonly timeLimit: number;
  readonly enableSampling: boolean;
  readonly samplingRate: number;
}

/** Complete tracer configuration */
export interface TracerConfig {
  readonly controlFlow: boolean;
  readonly functionCalls: FunctionCallsConfig;
  readonly variables: VariablesConfig;
  readonly operators: OperatorsConfig;
  readonly imports: boolean;
  readonly exports: boolean;
  readonly blocks: BlocksConfig;
  readonly async: AsyncConfig;
  readonly serialization: SerializationConfig;
  readonly performance: PerformanceConfig;
}

/** Partial configuration for user input */
export type PartialTracerConfig = {
  readonly controlFlow?: boolean;
  readonly functionCalls?: Partial<FunctionCallsConfig>;
  readonly variables?: Partial<VariablesConfig>;
  readonly operators?: Partial<OperatorsConfig>;
  readonly imports?: boolean;
  readonly exports?: boolean;
  readonly blocks?: Partial<BlocksConfig>;
  readonly async?: Partial<AsyncConfig>;
  readonly serialization?: Partial<SerializationConfig>;
  readonly performance?: Partial<PerformanceConfig>;
};

/** Configuration validation result */
export interface ConfigValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

// ============================================================================
// State Management Types
// ============================================================================

/** Variable information in scope */
export interface VariableInfo {
  readonly name: string;
  readonly value: unknown;
  readonly declarationTime: number;
  readonly accessCount: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** Scope information */
export interface ScopeInfo {
  readonly id: string;
  readonly type: string;
  readonly location: string;
  readonly variables: Map<string, VariableInfo>;
  readonly parent: string | null;
  readonly children: readonly string[];
  readonly startTime: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** Async context information */
export interface AsyncContextInfo {
  readonly id: string;
  readonly type: string;
  readonly location: string;
  readonly startTime: number;
  readonly suspensionCount: number;
  readonly resumptionCount: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** Value registry information */
export interface ValueRegistryInfo {
  readonly id: string;
  readonly registrationTime: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/** State counters */
export interface StateCounters {
  readonly events: number;
  readonly scopes: number;
  readonly asyncContexts: number;
  readonly valueIds: number;
}

/** State metadata */
export interface StateMetadata {
  readonly version: string;
  readonly mode: string;
  readonly features: readonly string[];
}

/** Tracer state */
export interface TracerState {
  readonly events: readonly TraceEvent[];
  readonly scopeStack: readonly ScopeInfo[];
  readonly asyncContexts: ReadonlyMap<string, AsyncContextInfo>;
  readonly valueRegistry: WeakMap<object, ValueRegistryInfo>;
  readonly circularRegistry: ReadonlyMap<object, string>;
  readonly counters: StateCounters;
  readonly startTime: number;
  readonly config: TracerConfig;
  readonly metadata: StateMetadata;
}

/** State limits check result */
export interface StateLimitsCheck {
  readonly eventsLimitReached: boolean;
  readonly timeLimitReached: boolean;
  readonly shouldSample: boolean;
}

/** State summary for debugging */
export interface StateSummary {
  readonly eventCount: number;
  readonly scopeDepth: number;
  readonly asyncContextCount: number;
  readonly runtime: number;
  readonly counters: StateCounters;
  readonly currentScope: string | null;
  readonly configEnabled: readonly string[];
}

// ============================================================================
// Execution Types
// ============================================================================

/** Execution configuration */
export interface ExecutionConfig {
  readonly warnings?: boolean;
  readonly context?: Record<string, unknown>;
}

/** Trace summary */
export interface TraceSummary {
  readonly events: readonly TraceEvent[];
  readonly summary: StateSummary;
  readonly startTime: number;
  readonly endTime: number;
  readonly config: TracerConfig;
}

/** Execution result */
export interface ExecutionResult {
  readonly result: unknown;
  readonly error: Error | null;
  readonly trace: TraceSummary;
  readonly success: boolean;
}

/** Instrumented code result */
export interface InstrumentedCodeResult {
  readonly instrumentedCode: string;
  readonly originalCode: string;
  readonly getTrace: () => TraceSummary;
  readonly resetTrace: () => void;
  readonly config: TracerConfig;
}

/** Wrapper function type */
export type WrapperFunction = (context?: Record<string, unknown>) => ExecutionResult;

/** Tracer instance interface */
export interface TracerInstance {
  readonly config: TracerConfig;
  readonly run: (sourceCode: string, executionConfig?: ExecutionConfig) => ExecutionResult;
  readonly instrument: (sourceCode: string, executionConfig?: ExecutionConfig) => InstrumentedCodeResult;
  readonly wrap: (sourceCode: string, executionConfig?: ExecutionConfig) => WrapperFunction;
}

// ============================================================================
// Advice System Types
// ============================================================================

/** State updater function type */
export type StateUpdater = (newState?: TracerState) => TracerState;

/** AST path type */
export type ASTPath = string;

/** Aran advice function signatures */
export interface AranAdviceFunctions {
  readonly 'apply@around'?: (state: TracerState, callee: Function, thisArg: unknown, args: readonly unknown[], path: ASTPath) => unknown;
  readonly 'construct@around'?: (state: TracerState, constructor: Function, args: readonly unknown[], path: ASTPath) => unknown;
  readonly 'read@after'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'write@before'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'test@before'?: (state: TracerState, condition: unknown, path: ASTPath) => unknown;
  readonly 'break@before'?: (state: TracerState, label: string | undefined, path: ASTPath) => string | undefined;
  readonly 'block@setup'?: (state: TracerState, path: ASTPath) => TracerState;
  readonly 'block@declaration'?: (state: TracerState, kind: string, name: string, value: unknown, path: ASTPath) => unknown;
  readonly 'block@teardown'?: (state: TracerState, path: ASTPath) => TracerState;
  readonly 'await@before'?: (state: TracerState, promise: Promise<unknown>, path: ASTPath) => Promise<unknown>;
  readonly 'await@after'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'yield@before'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'yield@after'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'primitive@after'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'intrinsic@after'?: (state: TracerState, value: unknown, path: ASTPath) => unknown;
  readonly 'closure@after'?: (state: TracerState, closure: Function, path: ASTPath) => Function;
}

/** Aran pointcut array type */
export type AranPointcut = readonly string[];

// ============================================================================
// Serialization Types
// ============================================================================

/** Serialization options */
export interface SerializationOptions {
  readonly depth?: number;
  readonly maxStringLength?: number;
  readonly includeCircular?: boolean;
  readonly includeUndefined?: boolean;
  readonly includeSymbols?: boolean;
  readonly includeFunctions?: boolean;
  readonly includeNonEnumerable?: boolean;
}

/** Serializer function type */
export type SerializerFunction = (value: unknown) => unknown;

/** Basic value information */
export interface BasicValueInfo {
  readonly type: string;
  readonly value?: unknown;
  readonly length?: number;
  readonly description?: string;
  readonly name?: string;
  readonly constructor?: string;
  readonly keys?: number;
  readonly ownProperties?: number;
  readonly enumerableProperties?: number;
  readonly prototype?: string;
  readonly propertyError?: string;
}

/** Serialization error result */
export interface SerializationError {
  readonly _serializationError: true;
  readonly error: string;
  readonly type: string;
  readonly constructor?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/** Event matcher criteria */
export interface EventMatchCriteria {
  readonly type?: EventType;
  readonly subtype?: EventSubtype;
  readonly location?: string;
  readonly metadata?: Partial<Record<string, unknown>>;
  readonly [key: string]: unknown;
}

/** Event matcher function */
export type EventMatcher = (event: TraceEvent) => boolean;

/** Source code validation result */
export interface SourceCodeValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

/** Variable lookup result */
export interface VariableLookupResult {
  readonly variable: VariableInfo;
  readonly scope: ScopeInfo;
}

// ============================================================================
// Function Type Guards
// ============================================================================

/** Type guard for specific event types */
export function isCallEvent(event: TraceEvent): event is CallEvent {
  return event.type === EVENT_TYPES.CALL;
}

export function isVariableEvent(event: TraceEvent): event is VariableEvent {
  return event.type === EVENT_TYPES.VARIABLE;
}

export function isControlEvent(event: TraceEvent): event is ControlEvent {
  return event.type === EVENT_TYPES.CONTROL;
}

export function isBlockEvent(event: TraceEvent): event is BlockEvent {
  return event.type === EVENT_TYPES.BLOCK;
}

export function isAsyncEvent(event: TraceEvent): event is AsyncEvent {
  return event.type === EVENT_TYPES.ASYNC;
}

export function isValueEvent(event: TraceEvent): event is ValueEvent {
  return event.type === EVENT_TYPES.VALUE;
}

// ============================================================================
// Constants Export
// ============================================================================

/** Re-export constants for type compatibility */
export { EVENT_TYPES as EventTypes, EVENT_SUBTYPES as EventSubtypes };