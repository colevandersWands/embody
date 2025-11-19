'use strict';

/* Generators: Generator Patterns Overview

Generator pattern concepts distilled to essence:
- lazy-evaluation-essence.js - infinite sequences and memory efficiency
- data-pipeline-essence.js - chaining transformations efficiently
- (additional focused examples as needed)

Study with: Start with lazy-evaluation-essence.js */

// Quick demonstration of key patterns
function* quickDemo() {
    yield 'Pattern 1: Lazy evaluation';
    yield 'Pattern 2: Data pipelines';
    yield 'Pattern 3: Stateful iteration';
}

// Lazy evaluation demo
function* counter() {
    let n = 0;
    while (true) {
        console.log('Generating:', n); // Only prints when consumed
        yield n++;
    }
}

// Take only what you need
function* take(gen, count) {
    for (let value of gen) {
        if (count-- <= 0) break;
        yield value;
    }
}

console.log('Patterns overview:');
for (let pattern of quickDemo()) {
    console.log(pattern);
}

console.log('First 3 numbers:', [...take(counter(), 3)]);

/* See essence files for detailed pattern exploration */