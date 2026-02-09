# Embody

**Give life to JavaScript code through execution tracing**

Core dependency enabling educational tool developers to build Study Lenses - different analytical perspectives on the same code execution. _Embody_ brings code to life through execution, providing the living data flow that Study Lenses analyze, with different lenses needing different levels of execution detail.

- [Design Principles](#design-principles)
  - [Core Boundary Principle](#core-boundary-principle)
  - [Why Not Implement Educational Intelligence?](#why-not-implement-educational-intelligence)
  - [Config/Trace Symmetry](#configtrace-symmetry)
  - [Only Log Learner-Visible Behavior](#only-log-learner-visible-behavior)
  - [What We Provide ✅](#what-we-provide-)
  - [What Your Tool Does 🎯](#what-your-tool-does-)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [Basic Usage](#basic-usage)
- [Documentation](#documentation)
- [Who Uses This](#who-uses-this)
  - [Primary: Educational Tool Developers](#primary-educational-tool-developers)
    - [Tool Developer Personas](#tool-developer-personas)
  - [Secondary: CS Instructors](#secondary-cs-instructors)
  - [Tertiary: CER Researchers](#tertiary-cer-researchers)
- [License](#license)

## Design Principles

### Core Boundary Principle

**Our entire responsibility**: `embody({ tracer, code, config }) → { ok, steps, ... }`

- We provide raw execution traces of the JS callstack and granular, semantic-level trace configurations.
- Educational tool developers configure and consume our traces to implement all analysis, pedagogy, and student experiences.

Success is measured by how many different educational innovations can be built on our neutral foundation. We provide the execution data. Educational tools provide the intelligence. Together, they create learning experiences.

**We don't decide how to teach programming** - we provide the data foundation that lets educational innovators build whatever teaching approaches they envision.

Like how:

- **Git** provides version control infrastructure → **GitHub** builds collaboration workflows
- **Docker** provides container infrastructure → **Kubernetes** builds orchestration intelligence
- **SQL** provides data storage infrastructure → **ORMs** build application logic

**Embody** provides execution data infrastructure → **Your Learning Environment** build educational intelligence

### Why Not Implement Educational Intelligence?

**Pedagogical approaches vary dramatically**:

- Constructivist vs. instructivist learning theories
- Novice-friendly vs. expert-modeling presentations
- Individual exploration vs. collaborative analysis
- Immediate feedback vs. reflective self-assessment
- Language-specific vs. language-agnostic concepts

**By staying neutral**, we enable:

- Multiple pedagogical approaches to coexist
- Innovation in educational tool design
- Specialization by domain experts
- Evolution of teaching methods over time

### Config/Trace Symmetry

The configuration options and structure reflect the structure of their corresponding trace data. Example:

| Config                                                                                | Trace Log                                                                    |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `{ tracer: { bindings: { events: { assign: true }, kind: { declarative: true } } } }` | `[ ... { category: "binding", kind: "declarative", event: "assign" }, ... ]` |

### Only Log Learner-Visible Behavior

Only log events or language behavior that are visible to learners in a standard professional debugger, and/or that would help a learner with effective problem solving and debugging:

- Do Log: scope panel, highlighting expressions for evaluation, TDZ, ...
- Don't Log: implicit toString calls (just the before and after values), ...

### What We Provide ✅

- **Precise execution events** with educational context (variable names, function names, scope types)
- **Configurable granularity** from high-level function calls to detailed operator usage
- **Performance optimized** for real-time classroom use with large student cohorts
- **Filtering capabilities** to focus on specific variables, functions, or control structures

### What Your Tool Does 🎯

- **Educational intelligence**: Interpret raw events into pedagogical insights
- **Cross-level correlation**: Connect behavior → strategy → implementation
- **Student interfaces**: Present analysis in learner-appropriate ways
- **Assessment logic**: Generate quizzes, detect misconceptions, measure understanding
- **Visualization**: Create interactive debugging aids, execution animations, concept maps

## Installation

```bash
npm install @study-lenses/embody
```

## Quick Start

```javascript
import trace from '@study-lenses/embody';

// Trace execution — all APIs are async
const steps = await trace('chars', 'hello');

console.log(steps); // Array of execution events
```

```javascript
// Chainable API for multi-step workflows
import { embodify } from '@study-lenses/embody';

const chain = await embodify({ tracer: 'txt:chars', code: 'hello' }).trace();
if (chain.ok) console.log(chain.steps); // Array of execution events
```

```javascript
// Class-based API for OOP style
import { Tracer } from '@study-lenses/embody';

const tracer = new Tracer('txt:chars');
tracer.code = 'hello';
const steps = await tracer.steps; // Lazy trace on access
```

```javascript
// Node.js callback style (learn pre-ES6 patterns)
import { embodyTrace } from '@study-lenses/embody';

embodyTrace('txt:chars', 'hello', function (err, result) {
  if (err) throw err;
  console.log('Steps:', result.steps.length);
});
```

```javascript
// Error handling — all embody errors extend EmbodyError
import { trace, EmbodyError, ParseError } from '@study-lenses/embody';

try {
  const steps = await trace('chars', userCode);
} catch (error) {
  if (error instanceof EmbodyError) {
    // Handle any embody error gracefully
    if (error instanceof ParseError) {
      console.log(`Syntax error at line ${error.loc.line}`);
    } else {
      console.log(error.message);
    }
  } else {
    throw error; // Re-throw non-library errors
  }
}
```

## Key Features

- **Configurable granularity**: From high-level function calls to detailed operator tracking
- **Currying support**: Reuse configurations across multiple traces
- **Post-processing filters**: Focus on specific variables or functions
- **Pure functional design**: Predictable, testable, composable
- **Chainable pipeline**: `embodify()` for immutable, lazy-cascading trace workflows

## Basic Usage

```javascript
import { embody, embodify } from '@study-lenses/embody';

// Partial application — reuse tracer across traces
const withTracer = embody({ tracer: 'chars' });
const result1 = await withTracer({ code: 'hello', config: null });
const result2 = await withTracer({ code: 'world', config: null });

// Chainable workflow for batch processing
const chain = embodify({ tracer: 'chars' });
const results = await Promise.all(codes.map((code) => chain.set({ code }).trace()));
```

## Documentation

- [**API Reference**](./DOCS.md) - Complete API documentation
- [**API Module**](./src/api/README.md) - API entry points overview and decision matrix
- [**Error Handling**](./src/errors/README.md) - Error hierarchy and handling patterns
- [**Configuration**](./src/configuring/README.md) - Options validation and default-filling
- [**Tracer Modules**](./src/tracers/README.md) - Tracer implementations
- [**Developer Guide**](./DEV.md) - Architecture and conventions
- [**Code Conventions**](./DEV.md#codebase-conventions) - Coding standards and style guide
- [**Contributing**](./CONTRIBUTING.md) - How to contribute

**VS Code users**: Open the project and install recommended extensions when prompted. Format-on-save, linting, and debugging are pre-configured.

## Who Uses This

### Primary: Educational Tool Developers

- **Study platforms** like Study Lenses, Explorotron, web-based code analysis tools
- **LMS integrations** for platforms like Canvas, Moodle, Blackboard
- **Assessment builders** creating automatic quiz generation and grading systems

#### Tool Developer Personas

**Who builds on our infrastructure:**

- **CS Instructors** - Building custom assessment tools for large classes (150+ students)
- **EdTech Developers** - Creating debugging platforms for coding bootcamps
- **Documentation Authors** - Developing interactive examples for libraries
- **Research Tool Builders** - Analyzing programming patterns for CS education studies
- **IDE Extension Developers** - Creating educational debugging visualizations

**What they all need**: Raw execution data without pedagogical interpretation

### Secondary: CS Instructors

- Building **custom analysis tools** for specific course concepts
- Creating **debugging aids** tailored to their teaching approach
- Developing **research instruments** for educational studies

### Tertiary: CER Researchers

- **Data collection** for computing education research studies
- **Intervention measurement** to assess pedagogical effectiveness
- **Misconception detection** across student populations

## License

MIT
