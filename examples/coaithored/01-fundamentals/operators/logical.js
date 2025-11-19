'use strict';

/* Operators: Logical Operations

Demonstrates logical operators and short-circuit evaluation.
Shows how && and || return values, not just booleans.

Study with:
- ?trace to see short-circuit behavior
- Watch which expressions get evaluated
*/

// Different test values - uncomment to explore
let p = true;
let q = false;
// let p = 'hello'; let q = '';
// let p = 5; let q = 0;
// let p = null; let q = 'default';

console.log('p =', p, '(type:', typeof p, ')');
console.log('q =', q, '(type:', typeof q, ')');
console.log();

// Basic logical operations
let and = p && q;
let or = p || q;
let notP = !p;
let notQ = !q;

console.log('p && q:', and, '(logical AND)');
console.log('p || q:', or, '(logical OR)');
console.log('!p:', notP, '(logical NOT)');
console.log('!q:', notQ, '(logical NOT)');

// Short-circuit evaluation demonstration
console.log('\nShort-circuit evaluation:');
let result1 = false && console.log('This won\'t print');
console.log('false && side-effect:', result1);

let result2 = true || console.log('This won\'t print either');
console.log('true || side-effect:', result2);

// Practical short-circuit uses
let name = '';
let displayName = name || 'Anonymous';
console.log('\nDefault value pattern:');
console.log('displayName:', displayName);

let firstName = 'John';
let lastName = 'Doe';
let hasFirstName = firstName && 'Has first name';
let fullName = firstName && lastName && firstName + ' ' + lastName;
console.log('Conditional chaining:', hasFirstName);
console.log('Combined values:', fullName);

/*
Educational questions:
- What values do && and || actually return?
- When does short-circuit evaluation prevent code execution?
- How can || be used for default values?
- How can && be used for conditional execution?
*/