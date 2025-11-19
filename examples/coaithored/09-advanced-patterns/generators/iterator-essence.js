'use strict';

/* Generators: Iterator Essence

Iterator protocol: objects with next() method returning {value, done}.
Generators automatically implement iterator protocol.

Study with: ?trace to see iterator progression */

// Manual iterator
function createCounter(max) {
    let count = 0;
    return {
        next() {
            if (count < max) {
                return { value: count++, done: false };
            }
            return { value: undefined, done: true };
        }
    };
}

// Generator iterator (easier!)
function* counterGenerator(max) {
    for (let i = 0; i < max; i++) {
        yield i;
    }
}

let manual = createCounter(3);
let generator = counterGenerator(3);

console.log('Manual:', manual.next(), manual.next(), manual.next(), manual.next());
console.log('Generator:', generator.next(), generator.next(), generator.next(), generator.next());

/* Why use generators over manual iterators? */