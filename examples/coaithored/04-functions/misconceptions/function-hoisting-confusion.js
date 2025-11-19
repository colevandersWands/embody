'use strict';

/* Misconceptions: Function Hoisting Confusion Overview

Function hoisting confusion concepts distilled to essence:
- hoisting-confusion-essence.js - declarations vs expressions hoisting
- (additional focused examples as needed)

Study with: Start with hoisting-confusion-essence.js */

// Quick demonstration of hoisting confusion
console.log('Hoisting Confusion Demo:');

// Common misconception demo
console.log('MISCONCEPTION: All functions hoist the same way');
console.log('REALITY: Only declarations hoist completely');

// This works (declaration)
console.log('1. Declaration result:', works());

function works() {
    return 'Declaration hoisted';
}

// This doesn't work (expression)
console.log('2. Expression type before assignment:', typeof doesntWork);

var doesntWork = function() {
    return 'Expression not hoisted';
};

console.log('3. Expression after assignment:', doesntWork());

// let/const make it even clearer
try {
    console.log(alsoBroken()); // ReferenceError
} catch (err) {
    console.log('4. let function expression error:', err.name);
}

let alsoBroken = () => 'Arrow with let';

/* See essence files for detailed hoisting behavior */