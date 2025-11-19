'use strict';

/* Generators: Async Generators Overview

Async generator concepts distilled to essence:
- async-generator-essence.js - basic async function* syntax
- (additional focused examples as needed)

Study with: Start with async-generator-essence.js */

// Quick demonstration of async generators
async function* quickAsyncDemo() {
    yield await Promise.resolve('async 1');
    yield await Promise.resolve('async 2');
}

// For-await-of consumes async iterables
async function consume() {
    console.log('Consuming async generator:');
    for await (let value of quickAsyncDemo()) {
        console.log('Got:', value);
    }
    
    // Manual consumption with await
    let gen = quickAsyncDemo();
    console.log('Manual 1:', await gen.next());
    console.log('Manual 2:', await gen.next());
    console.log('Manual 3:', await gen.next());
}

consume();

/* See essence files for deep exploration */