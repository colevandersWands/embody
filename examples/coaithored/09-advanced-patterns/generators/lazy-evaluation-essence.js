'use strict';

/* Generators: Lazy Evaluation Essence

Generators only compute values when requested.
Perfect for infinite sequences and memory efficiency.

Study with: ?trace to see when values are actually generated */

// Infinite Fibonacci generator - doesn't crash!
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Only generates what we need
function* take(generator, count) {
    let taken = 0;
    for (let value of generator) {
        if (taken >= count) break;
        yield value;
        taken++;
    }
}

// Get first 10 Fibonacci numbers
let firstTen = [...take(fibonacci(), 10)];
console.log('First 10 Fibonacci:', firstTen);

// Processing pipeline - only processes what's consumed
function* numbers() {
    for (let i = 1; i <= 1000000; i++) {
        console.log('Generating:', i); // Only prints when consumed!
        yield i;
    }
}

let first5 = [...take(numbers(), 5)];
console.log('First 5:', first5);

/* Why doesn't the infinite loop crash? */