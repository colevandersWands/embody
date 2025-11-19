'use strict';

/* This Binding: Strict vs Non-Strict Mode

Demonstrates how 'this' binding differs between strict and non-strict mode
when functions are called without an explicit context.

Study with:
- ?variables to see this binding differences
- ?trace to see mode-dependent behavior
*/

// This file is in strict mode - see 'use strict' at top

function showThis() {
    console.log('this in function:', this);
    console.log('typeof this:', typeof this);
    return this;
}

// In strict mode, 'this' is undefined for regular function calls
console.log('=== Strict Mode Function Call ===');
try {
    showThis(); // 'this' will be undefined
} catch (error) {
    console.log('Error in strict mode:', error.message);
}

// But 'this' still works when called as method
const obj = {
    name: 'MyObject',
    showThis: showThis
};

console.log('\n=== Method Call (works in both modes) ===');
obj.showThis(); // 'this' refers to obj

// Demonstrate with explicit binding
console.log('\n=== Explicit Binding (works in both modes) ===');
showThis.call({ name: 'ExplicitObject' }); // 'this' is the passed object

// Global context demonstration
console.log('\n=== Global Context Check ===');
console.log('Global this:', this); // undefined in strict mode

// Arrow function behavior (same in both modes)
const arrowFunction = () => {
    console.log('Arrow function this:', this); // Inherits from enclosing scope
};

console.log('\n=== Arrow Function ===');
arrowFunction(); // 'this' is inherited (undefined here)

/*
Note: In non-strict mode, 'this' would default to the global object
(window in browsers, global in Node.js) for regular function calls.

Educational questions:
- What's the difference between strict and non-strict mode for 'this'?
- Why is strict mode generally preferred?
- How do method calls behave differently from function calls?
*/