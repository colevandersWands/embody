# Embody

**Give life to JavaScript code through execution tracing**

Core dependency enabling educational tool developers to build Study Lenses - different analytical perspectives on the same code execution. _Embody_ brings code to life through execution, providing the living data flow that Study Lenses analyze, with different lenses needing different levels of execution detail.

## Design Principles

### Core Boundary Principle: _What Educational Developers Do_ vs. _How `embody` Enables Them_

**Our entire responsibility**: `embody(script, config) → trace`

- We provide raw execution traces of the JS callstack and granular, semantic-level trace configurations.
- Educational tool developers configure and consume our traces to implement all analysis, pedagogy, and student experiences.

Success is measured by how many different educational innovations can be built on our neutral foundation. We provide the execution data. Educational tools provide the intelligence. Together, they create learning experiences.

### Config/Trace Symmetry

The configuration options and structure reflect the structure of their corresponding trace data. Example:

| Config                                     | Trace Log                                                        |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `{ variable: { write: true, kind: true} }` | `[ ... { category: variable. kind: const, event: write }, ... ]` |

### Only Log Learner-Visible Behavior

Only log events or language behavior that are visible to learners in a standard professional debugger, and/or that would help a learner with effective problem solving and debugging:

- Do Log: scope panel, highlighting expressions for evaluation, TDZ, ...
- Don't Log: implicit toString calls (just the before and after values), ...

### Study Lenses

> Study code, not explanations.

Study Lenses is a design principle for learning environments that prioritizes code comprehension and investigation:

1. **Explicitly teach** learners how to study and understand code
2. **Provide tools** that support free code investigation
3. **Write level-appropriate programs** for your learners to study
4. **Learners explore** the code freely, with your study suggestions

**Embody** supports #2 by providing the execution data infrastructure that enables Study Lenses tools - different analytical perspectives on the same code execution, each revealing different insights according to what learners need to investigate. While Embody gives life to code through execution, its sister library **[Examine](https://github.com/colevandersWands/examine)** (_still just a concept of a plan_) provides complementary static analysis data.

## Installation

```bash
npm install @study-lenses/embody
```

Core infrastructure for Study Lenses ecosystem - foundation for building educational code analysis tools.

## How It Works: Structured Event Streams

Instead of building analysis intelligence into Embody, we provide **precisely structured execution events** that Study Lenses can interpret however they need.

```js
// Your behavior analysis tool
const behaviorTrace = embody(studentCode, {
  preset: 'overview',
  functions: { calls: true, returns: true, declarations: false },
  variables: false,
  controlFlow: false
});
// � Clean function call/return stream for contract analysis

// Your strategy analysis tool
const strategyTrace = embody(studentCode, {
  preset: 'detailed',
  controlFlow: { conditionals: true, loops: true },
  scopes: { functions: true, blocks: true },
  functions: { calls: false, returns: false }
});
// � Control flow + scope events for algorithmic pattern detection

// Your implementation analysis tool
const implementationTrace = embody(studentCode, {
  preset: 'exhaustive',
  variables: {
    declare: { var: true, let: true, const: true },
    assign: true,
    read: true
  },
  operators: { computing: true, selecting: true, mutating: true }
});
// � Detailed variable + operator events for coding pattern analysis
```

### Educational Presets

Three preset configurations optimized for different educational depths:

- **`overview`**: Beginner-friendly, minimal noise � focus on program behavior
- **`detailed`**: Intermediate analysis, balanced detail � algorithmic strategies
- **`exhaustive`**: Advanced analysis, maximum information � implementation techniques

### What We Provide 

- **Precise execution events** with educational context (variable names, function names, scope types)
- **Configurable granularity** from high-level function calls to detailed operator usage
- **Performance optimized** for real-time classroom use with large student cohorts
- **Educational presets** that map to common pedagogical analysis levels
- **Filtering capabilities** to focus on specific variables, functions, or control structures

### What Your Tool Does <�

- **Educational intelligence**: Interpret raw events into pedagogical insights
- **Cross-level correlation**: Connect behavior � strategy � implementation
- **Student interfaces**: Present analysis in learner-appropriate ways
- **Assessment logic**: Generate quizzes, detect misconceptions, measure understanding
- **Visualization**: Create interactive debugging aids, execution animations, concept maps

## Example Integration Patterns

### Study Lenses Pattern

```js
// Each "lens" requests specific trace configuration
const traceLens = {
  config: { preset: 'detailed', variables: { filter: ['result'] } },
  render: events => createStepThroughDebugger(events)
};

const variableRolesLens = {
  config: { variables: true, controlFlow: { loops: true } },
  render: events => identifyVariableRoles(events) // accumulator, counter, flag, etc.
};
```

### Assessment Tool Pattern

```js
// Quiz generator analyzes student traces
const studentTrace = embody(studentSubmission, { preset: 'overview' });
const expectedTrace = embody(referenceImplementation, { preset: 'overview' });

const quiz = generateComprehensionQuestions(studentTrace, expectedTrace);
// "Why does your function return undefined instead of the expected string?"
```

### Research Tool Pattern

```js
// Collect anonymized data for computing education research
const cohortTraces = students.map(submission =>
  embody(submission, {
    preset: 'detailed',
    variables: { filter: ['result', 'counter', 'accumulator'] }
  })
);

const misconceptionPatterns = analyzeCohortPatterns(cohortTraces);
// Identify common debugging points, variable role confusion, etc.
```

## Who Uses This

### Primary: Educational Tool Developers

- **Study platforms** like Study Lenses, Explorotron, web-based code analysis tools
- **LMS integrations** for platforms like Canvas, Moodle, Blackboard
- **Assessment builders** creating automatic quiz generation and grading systems

### Secondary: CS Instructors

- Building **custom analysis tools** for specific course concepts
- Creating **debugging aids** tailored to their teaching approach
- Developing **research instruments** for educational studies

### Tertiary: CER Researchers

- **Data collection** for computing education research studies
- **Intervention measurement** to assess pedagogical effectiveness
- **Misconception detection** across student populations

## Design Philosophy: Neutral Infrastructure

**We don't decide how to teach programming** - we provide the data foundation that lets educational innovators build whatever teaching approaches they envision.

Like how:

- **Git** provides version control infrastructure � **GitHub** builds collaboration workflows
- **Docker** provides container infrastructure � **Kubernetes** builds orchestration intelligence
- **SQL** provides data storage infrastructure � **ORMs** build application logic

**Embody** provides execution data infrastructure � **Your Study Lenses** build educational intelligence

## Why Not Build the Educational Intelligence Ourselves?

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

## Quick Start

```bash
npm install @study-lenses/embody
```

```js
import { embody } from '@study-lenses/embody';

// Basic usage with educational preset
const trace = embody(
  `
  function repeatString(text, times) {
    let result = '';
    for (let i = 0; i < times; i++) {
      result += text;
    }
    return result;
  }
  
  repeatString('hello', 3);
`,
  { preset: 'detailed' }
);

// Your educational tool processes the structured events
yourTool.analyze(trace);
```

## Sister Library: Examine

For static code analysis that complements execution tracing, see [@study-lenses/examine](https://github.com/colevandersWands/examine).

While **Embody** gives life to your code through execution, **Examine** contemplates its structure without running it. Together, they provide a complete picture:

```js
import { embody } from '@study-lenses/embody';
import { examine } from '@study-lenses/examine';

// Dynamic analysis - see how code comes to life
const executionTrace = embody(code, { preset: 'detailed' });

// Static analysis - understand the structure
const structure = examine(code, { focus: 'patterns' });

// Combine both perspectives for complete understanding
const insights = correlate(executionTrace, structure);
```

## Documentation

- **[Configuration Guide](./config/README.md)**: Complete configuration options and educational presets
- **[Integration Examples](./docs/integration-examples.md)**: Patterns for common educational tools
- **[Event Format](./docs/trace-format.md)**: Structure of execution events
- **[Performance Guide](./docs/performance.md)**: Optimization for classroom deployment

---

_Built for educational tool developers who are building the next generation of programming education experiences._

---

---

<!-- things to sort and integrate -->

### Tool Developer Personas

**Who builds on our infrastructure:**

- **CS Instructors** - Building custom assessment tools for large classes (150+ students)
- **EdTech Developers** - Creating debugging platforms for coding bootcamps
- **Documentation Authors** - Developing interactive examples for libraries
- **Research Tool Builders** - Analyzing programming patterns for CS education studies
- **IDE Extension Developers** - Creating educational debugging visualizations

**What they all need**: Raw execution data without pedagogical interpretation

### How Config Enables Three-Layer Analysis

Educational tools universally need to analyze code at three levels. Our config naturally supports this:

| **Analysis Layer** | **Educational Focus**             | **Enabling Config Sections**               |
| ------------------ | --------------------------------- | ------------------------------------------ |
| **Behavior**       | What does the code do?            | `functions`, `errors`, `async`             |
| **Strategy**       | How does it solve the problem?    | `controlFlow`, `scopes`, `variables`       |
| **Implementation** | Which language features are used? | `operators`, `syntax`, `variables.declare` |
