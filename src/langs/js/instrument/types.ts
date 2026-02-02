/**
 * @file TypeScript type definitions for trace events
 *
 * Event types produced by the instrumentation system.
 * These types describe the structure of execution trace data.
 */

// ============================================================================
// Event Type Constants
// ============================================================================

/** Event type constants */
export const EVENT_TYPES = {
  CALL: 'call',
  VARIABLE: 'variable',
  CONTROL: 'control',
  BLOCK: 'block',
  ASYNC: 'async',
  VALUE: 'value',
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
  CLOSURE: 'closure',
} as const;

/** Event type union */
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/** Event subtype union */
export type EventSubtype = (typeof EVENT_SUBTYPES)[keyof typeof EVENT_SUBTYPES];

// ============================================================================
// Base Event Interface
// ============================================================================

/** Base trace event structure */
export type TraceEvent = {
  readonly type: EventType;
  readonly subtype: EventSubtype;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<Record<string, unknown>>;
};

// ============================================================================
// Specific Event Types
// ============================================================================

/** Call event specific structure */
export type CallEvent = {
  readonly type: typeof EVENT_TYPES.CALL;
  readonly subtype: typeof EVENT_SUBTYPES.APPLY | typeof EVENT_SUBTYPES.CONSTRUCT;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<{
    readonly callee: unknown;
    readonly this?: unknown;
    readonly args: readonly unknown[];
    readonly result?: unknown;
  }>;
  readonly metadata: Readonly<{
    readonly functionName: string;
    readonly phase?: 'enter' | 'exit';
    readonly blackboxed?: boolean;
    readonly error?: unknown;
    readonly [key: string]: unknown;
  }>;
};

/** Variable event specific structure */
export type VariableEvent = {
  readonly type: typeof EVENT_TYPES.VARIABLE;
  readonly subtype:
    | typeof EVENT_SUBTYPES.READ
    | typeof EVENT_SUBTYPES.WRITE
    | typeof EVENT_SUBTYPES.DECLARE;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<{
    readonly value: unknown;
  }>;
  readonly metadata: Readonly<{
    readonly variableName: string;
    readonly isTDZ?: boolean;
    readonly kind?: 'var' | 'let' | 'const' | 'function' | 'class';
    readonly [key: string]: unknown;
  }>;
};

/** Control flow event specific structure */
export type ControlEvent = {
  readonly type: typeof EVENT_TYPES.CONTROL;
  readonly subtype: typeof EVENT_SUBTYPES.TEST | typeof EVENT_SUBTYPES.BREAK;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<{
    readonly condition?: unknown;
  }>;
  readonly metadata: Readonly<{
    readonly truthyValue?: boolean;
    readonly label?: string | null;
    readonly [key: string]: unknown;
  }>;
};

/** Block event specific structure */
export type BlockEvent = {
  readonly type: typeof EVENT_TYPES.BLOCK;
  readonly subtype: typeof EVENT_SUBTYPES.ENTER | typeof EVENT_SUBTYPES.EXIT;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<{
    readonly blockType: string;
    readonly scopeId?: string;
    readonly [key: string]: unknown;
  }>;
};

/** Async event specific structure */
export type AsyncEvent = {
  readonly type: typeof EVENT_TYPES.ASYNC;
  readonly subtype: typeof EVENT_SUBTYPES.AWAIT | typeof EVENT_SUBTYPES.YIELD;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<{
    readonly value: unknown;
  }>;
  readonly metadata: Readonly<{
    readonly phase?: 'suspend' | 'resume';
    readonly [key: string]: unknown;
  }>;
};

/** Value event specific structure */
export type ValueEvent = {
  readonly type: typeof EVENT_TYPES.VALUE;
  readonly subtype:
    | typeof EVENT_SUBTYPES.PRIMITIVE
    | typeof EVENT_SUBTYPES.INTRINSIC
    | typeof EVENT_SUBTYPES.CLOSURE;
  readonly location: string;
  readonly timestamp: number;
  readonly values: Readonly<{
    readonly value: unknown;
  }>;
  readonly metadata: Readonly<{
    readonly primitiveType?: string;
    readonly intrinsicName?: string;
    readonly functionName?: string;
    readonly [key: string]: unknown;
  }>;
};

// ============================================================================
// Union Type
// ============================================================================

/** Union type for all specific events */
export type SpecificTraceEvent =
  | CallEvent
  | VariableEvent
  | ControlEvent
  | BlockEvent
  | AsyncEvent
  | ValueEvent;

// ============================================================================
// Re-export Constants (for backward compatibility during migration)
// ============================================================================

export { EVENT_TYPES as EventTypes, EVENT_SUBTYPES as EventSubtypes };
