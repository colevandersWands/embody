'use strict';

/* Closure Patterns: Event Handlers Overview

Event handler closure concepts distilled to essence:
- event-handlers-essence.js - closures preserving handler state
- (additional focused examples as needed)

Study with: Start with event-handlers-essence.js */

// Create stateful handlers using closures
function createCounter(name) {
    let count = 0; // Captured by closure
    
    return function() {
        count++;
        console.log(`${name}: ${count}`);
        
        if (count >= 3) {
            console.log(`${name} reached limit!`);
        }
    };
}

// Timer handlers with independent state
function createTimer(name, interval) {
    let ticks = 0;
    
    return function() {
        ticks++;
        console.log(`${name} tick ${ticks} (every ${interval}ms)`);
    };
}

// Create handlers with closure state
let counter1 = createCounter('Counter A');
let counter2 = createCounter('Counter B');
let timer1 = createTimer('Fast Timer', 100);
let timer2 = createTimer('Slow Timer', 500);

// Each handler remembers its own state
console.log('=== Independent Event Handlers ===');
counter1(); // A: 1
counter1(); // A: 2
counter2(); // B: 1 (independent)
counter1(); // A: 3 (reaches limit)

timer1(); // Fast tick 1
timer2(); // Slow tick 1
timer1(); // Fast tick 2

console.log('\nEach handler has its own closure memory');

/* See essence files for detailed event handler closure exploration */