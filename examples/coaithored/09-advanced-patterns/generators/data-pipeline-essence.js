'use strict';

/* Generators: Data Pipeline Essence

Chain generator transformations for efficient data processing.
Each step only processes values as needed.

Study with: ?trace to see pipeline flow */

// Transform generators that take and yield
function* map(iterable, fn) {
    for (let value of iterable) {
        yield fn(value);
    }
}

function* filter(iterable, predicate) {
    for (let value of iterable) {
        if (predicate(value)) {
            yield value;
        }
    }
}

function* range(start, end) {
    for (let i = start; i <= end; i++) {
        console.log('Generating:', i); // Only runs when consumed
        yield i;
    }
}

// Build processing pipeline
let numbers = range(1, 10);
let doubled = map(numbers, x => x * 2);
let evenDoubled = filter(doubled, x => x % 4 === 0);

// Only processes what we actually use
console.log('Taking first 2:');
let results = [];
for (let value of evenDoubled) {
    results.push(value);
    if (results.length >= 2) break;
}

console.log('Results:', results);

/* Why is this more efficient than arrays? */