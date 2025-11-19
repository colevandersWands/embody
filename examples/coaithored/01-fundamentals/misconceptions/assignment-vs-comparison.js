'use strict';

/* Misconceptions: Assignment vs Comparison Overview

Assignment vs comparison concepts distilled to essence:
- assignment-vs-comparison-essence.js - = vs === behavior differences
- (additional focused examples as needed)

Study with: Start with assignment-vs-comparison-essence.js */

// Quick demonstration of assignment vs comparison
let value = 10;

// Assignment returns the assigned value
console.log('Assignment (value = 20):', (value = 20)); // Returns 20, changes value
console.log('value is now:', value); // 20

// Comparison returns boolean
console.log('Comparison (value === 20):', (value === 20)); // Returns true
console.log('value is still:', value); // Still 20

// Common misconception in conditions
let user = { name: 'Alice', role: 'user' };

// WRONG: assignment in condition (always truthy)
if (user.role = 'admin') { // BUG! Assigns 'admin'
    console.log('User is admin:', user.role); // Now 'admin'
}

// Reset and fix
user.role = 'user';

// CORRECT: comparison in condition  
if (user.role === 'admin') {
    console.log('This does not execute');
} else {
    console.log('User role:', user.role); // Still 'user'
}

/* See essence files for detailed comparison patterns */