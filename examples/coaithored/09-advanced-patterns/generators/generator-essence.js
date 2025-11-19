'use strict';

/* Generators: Generator Essence

Generators are functions that can pause and resume.
yield pauses, return finishes, next() resumes.

Study with: ?trace to see pause/resume behavior */

// Generator function (note the *)
function* simpleGenerator() {
    console.log('Start');
    yield 1;
    console.log('Middle');
    yield 2;
    console.log('End');
    return 3;
}

// Create generator instance
let gen = simpleGenerator();

console.log('First call:', gen.next());  // { value: 1, done: false }
console.log('Second call:', gen.next()); // { value: 2, done: false }
console.log('Third call:', gen.next());  // { value: 3, done: true }

// For-of consumes until done: true
for (let value of simpleGenerator()) {
    console.log('For-of:', value);
}

/* What makes generators pausable functions? */