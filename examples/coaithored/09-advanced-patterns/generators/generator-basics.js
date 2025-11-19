'use strict';

/* Generators: Generator Basics Overview

Generator basic concepts distilled to essence:
- generator-essence.js - basic yield/next behavior and for-of consumption
- iterator-essence.js - iterator protocol manual vs generator
- (additional focused examples as needed)

Study with: Start with generator-essence.js */

// Quick demonstration of generator basics
function* basicDemo() {
    console.log('Generator starts');
    yield 1;
    console.log('Between yields');
    yield 2;
    console.log('Generator ends');
    return 3;
}

// Generator returns iterator
let gen = basicDemo();
console.log('Generator object:', typeof gen.next); // 'function'

// Manual stepping through generator
console.log('Step 1:', gen.next()); // { value: 1, done: false }
console.log('Step 2:', gen.next()); // { value: 2, done: false }
console.log('Step 3:', gen.next()); // { value: 3, done: true }

// For-of automatic consumption
console.log('For-of consumption:');
for (let value of basicDemo()) {
    console.log('Value:', value); // Only yields, not return value
}

/* See essence files for detailed generator exploration */