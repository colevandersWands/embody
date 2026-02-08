# tracers — Technical Reference

Complete type definitions for tracer modules. See [README.md](./README.md) for architecture overview.

## Table of Contents

- [MetaConfig](#metaconfig)
- [MetaLimits](#metalimits)
- [ResolvedConfig](#resolvedconfig)
- [StepCore](#stepcore)
- [TracerModule](#tracermodule)
- [RecordResult](#recordresult)

---

## MetaConfig

Cross-tracer execution limits and debugging options. Validated against `meta.schema.json`.

```typescript
type MetaConfig = {
  readonly max: MetaLimits;
  readonly range: readonly [number, number] | null;
  readonly timestamps: boolean;
  readonly debug: { readonly ast: boolean };
};
```

### Properties

| Property     | Type                        | Description                                      |
| ------------ | --------------------------- | ------------------------------------------------ |
| `max`        | `MetaLimits`                | Execution limits (see MetaLimits)                |
| `range`      | `[number, number] \| null`  | Line range to trace; `null` = full code          |
| `timestamps` | `boolean`                   | Whether to include timestamps in trace steps     |
| `debug`      | `{ readonly ast: boolean }` | Debug options; `ast: true` attaches AST to steps |

---

## MetaLimits

Execution limits within MetaConfig. All limits use `null` to mean "unlimited".

```typescript
type MetaLimits = {
  readonly steps: number | null;
  readonly iterations: number | null;
  readonly callstack: number | null;
  readonly time: number | null;
};
```

### Properties

| Property     | Type             | Description                                      |
| ------------ | ---------------- | ------------------------------------------------ |
| `steps`      | `number \| null` | Maximum trace steps; `null` = unlimited          |
| `iterations` | `number \| null` | Maximum loop iterations; `null` = unlimited      |
| `callstack`  | `number \| null` | Maximum call stack depth; `null` = unlimited     |
| `time`       | `number \| null` | Maximum execution time in ms; `null` = unlimited |

### Null Convention

JSON Schema cannot represent `Infinity`. We use `null` as the "no limit" sentinel:

```typescript
// In tracer's record():
if (meta.max.steps !== null && stepCount > meta.max.steps) {
  throw new LimitExceededError('Exceeded max steps', 'steps', stepCount);
}
```

---

## ResolvedConfig

The fully-validated configuration returned by `record()`. Contains both meta limits and tracer-specific options.

```typescript
type ResolvedConfig = {
  readonly meta: MetaConfig;
  readonly options: Record<string, unknown>;
};
```

### Properties

| Property  | Type                      | Description                            |
| --------- | ------------------------- | -------------------------------------- |
| `meta`    | `MetaConfig`              | Execution limits (fully filled)        |
| `options` | `Record<string, unknown>` | Tracer-specific options (fully filled) |

### Example

```typescript
const result = await record('abc', { meta, options });

console.log(result.config);
// {
//   meta: {
//     max: { steps: 1000, iterations: null, callstack: 100, time: 5000 },
//     range: null,
//     timestamps: false,
//     debug: { ast: false }
//   },
//   options: {
//     direction: 'lr',
//     remove: [],
//     replace: {},
//     allowedCharClasses: { lowercase: true, uppercase: true, ... }
//   }
// }
```

---

## StepCore

Base type for all trace steps. Every step, regardless of tracer, includes ESTree-compliant source locations.

```typescript
type Position = {
  readonly line: number; // 1-indexed (ESTree standard)
  readonly column: number; // 0-indexed (ESTree standard)
};

type SourceLocation = {
  readonly start: Position;
  readonly end: Position;
};

type StepCore = {
  readonly step: number;
  readonly loc: SourceLocation;
};
```

### Properties

| Property           | Type             | Description                                    |
| ------------------ | ---------------- | ---------------------------------------------- |
| `step`             | `number`         | 1-indexed execution order                      |
| `loc`              | `SourceLocation` | ESTree-compliant source range                  |
| `loc.start.line`   | `number`         | 1-indexed line number (ESTree standard)        |
| `loc.start.column` | `number`         | 0-indexed column number (ESTree standard)      |
| `loc.end`          | `Position`       | End position (same as start for single tokens) |

**ESTree compliance**: Follows the [ESTree specification](https://github.com/estree/estree/blob/master/es5.md#node-objects). Line numbers are 1-indexed, column numbers are 0-indexed. For single-token steps, `start` equals `end`.

Tracer-specific step types extend `StepCore`:

```typescript
// Example: chars tracer step
type CharsStep = StepCore & {
  readonly char: string;
  readonly original: string;
};
```

---

## TracerModule

Type signature for tracer record functions.

```typescript
type TracerModule<TOptions = unknown, TStep extends StepCore = StepCore> = (
  code: string,
  config: { readonly meta: MetaConfig; readonly options: TOptions },
) => Promise<RecordResult<TStep>>;
```

### Parameters

| Parameter        | Type         | Description                            |
| ---------------- | ------------ | -------------------------------------- |
| `code`           | `string`     | Source code to trace                   |
| `config.meta`    | `MetaConfig` | Execution limits (fully filled)        |
| `config.options` | `TOptions`   | Tracer-specific options (fully filled) |

### Return Value

Returns `Promise<RecordResult<TStep>>` — see RecordResult.

### Contract

Tracer modules receive **fully filled** config from the API layer:

- `meta` validated against `meta.schema.json` with defaults applied
- `options` validated against tracer's `options.schema.json` with defaults applied
- Semantic validation already passed (verifyOptions called by API)

Tracer modules do **pure tracing** — no validation except limit checking.

---

## RecordResult

Return type from tracer record functions.

```typescript
type RecordResult<TStep extends StepCore = StepCore> = {
  readonly steps: readonly TStep[];
  readonly config: ResolvedConfig;
};
```

### Properties

| Property | Type               | Description                          |
| -------- | ------------------ | ------------------------------------ |
| `steps`  | `readonly TStep[]` | Array of trace steps                 |
| `config` | `ResolvedConfig`   | The resolved config used for tracing |

---

## Links

- [Module Overview](./README.md) — architecture, adding new tracers
- [chars Tracer](./chars/README.md) — reference implementation
- [API DOCS](../api/DOCS.md) — how API uses tracer modules
- [/configuring DOCS](../configuring/DOCS.md) — options validation
