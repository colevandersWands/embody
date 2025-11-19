'use strict';

/* Closure Patterns: Event Handlers Essence

Event handler closure = function that remembers outer variables from when created.
Each handler has its own "memory" that persists between calls.

Study with: ?variables to see closure-captured state */

// Simple event system
let listeners = [];
function addEventListener(callback) { listeners.push(callback); }
function fireEvent() { listeners.forEach(cb => cb()); }

// Create handler with closure
function createClickHandler(name) {
    let clickCount = 0; // Captured by closure
    
    // This function "closes over" clickCount
    return function() {
        clickCount++;   // Remembers previous value!
        console.log(`${name} clicked ${clickCount} times`);
    };
}

// Create two independent handlers
let buttonA = createClickHandler('Button A');
let buttonB = createClickHandler('Button B');

addEventListener(buttonA);
addEventListener(buttonB);

// Fire events - each remembers its own count
console.log('First round:');
fireEvent(); // A:1, B:1

console.log('Second round:');  
fireEvent(); // A:2, B:2

console.log('Third round:');
fireEvent(); // A:3, B:3

// Each handler has its own clickCount memory
// Even though the createClickHandler function finished,
// the clickCount variables persist in each closure

/* How do event handlers remember state between calls? */