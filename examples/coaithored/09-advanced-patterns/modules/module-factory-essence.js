'use strict';

/* Modules: Module Factory Pattern Essence

Module factory = function that creates module instances with private state.
Each instance has its own closure scope, completely independent.

Study with: ?variables to see instance independence */

// Factory function creates module instances
function createCounter(start = 0) {
    let count = start; // Private state per instance
    
    return {
        increment() {
            count++;
            console.log('Count:', count);
            return this;
        },
        
        getValue() {
            return count;
        },
        
        reset() {
            count = start;
            console.log('Reset to:', start);
            return this;
        }
    };
}

// Create multiple independent instances
let counter1 = createCounter(0);
let counter2 = createCounter(10);

// Each has its own private state
counter1.increment().increment();  // count = 2
counter2.increment();              // count = 11

console.log('Counter 1:', counter1.getValue()); // 2
console.log('Counter 2:', counter2.getValue()); // 11

counter1.reset(); // Resets to 0
console.log('After reset - Counter 1:', counter1.getValue()); // 0
console.log('Counter 2 unchanged:', counter2.getValue());     // 11

/* Why use factories instead of sharing one module instance? */