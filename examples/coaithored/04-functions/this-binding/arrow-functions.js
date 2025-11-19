'use strict';

/* This Binding: Arrow Functions

Demonstrates how arrow functions handle 'this' differently -
they inherit 'this' from their enclosing scope.

Study with:
- ?variables to see this inheritance vs binding
- ?trace to see lexical this behavior
*/

// Regular object with methods
const counter = {
    count: 0,
    name: 'MyCounter',
    
    // Regular method - 'this' binds to counter object
    increment: function() {
        console.log(`Before increment: ${this.name} = ${this.count}`);
        this.count++;
        console.log(`After increment: ${this.name} = ${this.count}`);
    },
    
    // Arrow method - 'this' is inherited from surrounding scope
    decrement: () => {
        // In global scope, 'this' is undefined in strict mode
        console.log('Arrow function this:', this); // undefined!
        // this.count--; // Would cause error
        console.log('Arrow functions cannot access object properties via this');
    },
    
    // Method that uses arrow function internally
    setupTimer: function() {
        console.log('Setting up timer for', this.name);
        
        // Arrow function inherits 'this' from setupTimer method
        const timer = () => {
            console.log(`Timer tick: ${this.name} = ${this.count}`);
            this.count++; // This works! 'this' refers to counter object
        };
        
        // Regular function would lose 'this' context
        const regularTimer = function() {
            console.log('Regular function this:', this); // undefined in strict mode
            // this.count++; // Would cause error
        };
        
        console.log('Calling arrow function timer:');
        timer(); // Works correctly
        
        console.log('Calling regular function timer:');
        regularTimer(); // Shows undefined 'this'
    }
};

// Test the different behaviors
console.log('=== Regular Method ===');
counter.increment(); // Works normally

console.log('\n=== Arrow Method ===');
counter.decrement(); // Cannot access object properties

console.log('\n=== Arrow Function Inside Method ===');
counter.setupTimer(); // Shows arrow function advantage

/*
Educational questions:
- Why can't arrow methods access object properties?
- How do arrow functions inherit 'this'?
- When should you use arrow functions vs regular functions?
*/