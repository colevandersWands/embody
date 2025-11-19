'use strict';

/* Closures: Closure Creation

Demonstrates how closures are created when inner functions
access variables from their outer function scope.

Study with:
- ?variables to see scope chains
- ?trace to see closure creation timing
*/

function createGreeter(name) {
    // This variable will be captured in the closure
    const greeting = `Hello, ${name}!`;
    
    // Inner function accesses outer variable
    function greet() {
        console.log(greeting); // Closure over 'greeting'
        return greeting;
    }
    
    console.log('Outer function creating closure');
    return greet; // Returns function with closure
}

// Create closure instances
console.log('=== Creating Closures ===');
const greetJohn = createGreeter('John');
const greetMary = createGreeter('Mary');

// Use the closures
console.log('=== Using Closures ===');
greetJohn(); // Each closure has its own 'greeting'
greetMary(); // Independent from other closures

/*
Educational questions:
- When is the closure created?
- What variables are captured in each closure?
- How are multiple closures independent?
*/