'use strict';

/* Misconceptions: Equality Confusion Overview

Equality misconception concepts distilled to essence:
- equality-confusion-essence.js - == vs === and type coercion dangers
- (additional focused examples as needed)

Study with: Start with equality-confusion-essence.js */

// Demonstrate the core problem: == vs ===
console.log('Type coercion surprises:');
console.log('5 == "5":', 5 == '5');     // true (dangerous)
console.log('5 === "5":', 5 === '5');   // false (safe)

console.log('0 == false:', 0 == false); // true (dangerous)
console.log('0 === false:', 0 === false); // false (safe)

// Special cases to know about
console.log('\nSpecial cases:');
console.log('null == undefined:', null == undefined);   // true (only case)
console.log('null === undefined:', null === undefined); // false

console.log('NaN === NaN:', NaN === NaN);         // false (unique!)
console.log('Number.isNaN(NaN):', Number.isNaN(NaN)); // true (correct)

// Best practice demonstration
let userInput = '5';
if (userInput === '5') {        // ✓ Explicit string check
    console.log('String five');
}

if (Number(userInput) === 5) {  // ✓ Explicit number conversion
    console.log('Number five');
}

/* See essence files for detailed equality exploration */