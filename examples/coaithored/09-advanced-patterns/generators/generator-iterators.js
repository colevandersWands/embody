'use strict';

/* Generators: Generator Iterators Overview

Generator and iterator concepts distilled to essence:
- generator-essence.js - basic yield/next behavior  
- iterator-essence.js - iterator protocol manual vs generator
- generator-patterns.js - practical patterns and use cases

Study with: Start with generator-essence.js */

// Quick demonstration of the connection
function* quickExample() {
    yield 'first';
    yield 'second';
}

// Generators ARE iterators
let gen = quickExample();
console.log('Iterator result:', gen.next()); // { value: 'first', done: false }

// For-of uses iterator protocol
for (let value of quickExample()) {
    console.log('For-of value:', value);
}

// Manual iterator for comparison
let counter = {
    count: 0,
    next() {
        return this.count < 2 
            ? { value: this.count++, done: false }
            : { value: undefined, done: true };
    }
};

console.log('Manual:', counter.next(), counter.next(), counter.next());

/* See essence files for deep exploration */