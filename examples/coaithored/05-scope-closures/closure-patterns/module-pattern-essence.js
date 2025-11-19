'use strict';

/* Closure Patterns: Module Pattern Essence

Module pattern = IIFE returns object with methods that access private variables.
Creates encapsulation: public interface, private implementation.

Study with: ?variables to see module scope boundaries */

// Module with private state and public interface
const counter = (function() {
    // Private variables (not accessible from outside)
    let count = 0;
    
    // Public interface (returned object)
    return {
        increment: function() {
            count++;
            console.log('Count:', count);
            return count;
        },
        
        getCount: function() {
            return count;
        }
    };
})(); // IIFE executes immediately, returns module

// Using the module
counter.increment();  // Count: 1
counter.increment();  // Count: 2
console.log('Current:', counter.getCount()); // 2

// Privacy test
console.log('Direct access to count:', counter.count); // undefined!

/* Why can't we access count directly but methods can? */