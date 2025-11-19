'use strict';

/* Generators: Async Generator Essence

Async generators combine yield with await.
Use await before yield, use for-await-of to consume.

Study with: ?trace to see async timing */

// Async generator function (async function*)
async function* asyncSequence() {
    console.log('Start');
    yield await Promise.resolve(1);
    console.log('Middle');
    yield await Promise.resolve(2);
    console.log('End');
    return 3;
}

// Must await each next() call
async function demo() {
    let gen = asyncSequence();
    
    console.log('First:', await gen.next());  // { value: 1, done: false }
    console.log('Second:', await gen.next()); // { value: 2, done: false }
    console.log('Third:', await gen.next());  // { value: 3, done: true }
    
    // For-await-of consumes async iterables
    console.log('For-await-of:');
    for await (let value of asyncSequence()) {
        console.log('Value:', value);
    }
}

demo();

/* Why combine generators with async/await? */