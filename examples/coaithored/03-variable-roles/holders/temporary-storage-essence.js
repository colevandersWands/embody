'use strict';

/* Variable Roles: Temporary Storage Essence

Temporary variable = stores intermediate result for clarity and reuse.
Makes complex calculations readable by breaking into named steps.

Study with: ?variables to see temporary values created and used */

// Without temporary - hard to understand
let complexResult = (15 * 3) + ((15 * 3 * 8) / 100);
console.log('Complex:', complexResult);

// With temporary - step by step
let price = 15;
let quantity = 3;
let subtotal = price * quantity;        // TEMPORARY: intermediate result
let tax = (subtotal * 8) / 100;         // TEMPORARY: intermediate calculation  
let total = subtotal + tax;             // Final result using temporaries

console.log('Breakdown:');
console.log('  Subtotal:', subtotal);
console.log('  Tax:', tax);
console.log('  Total:', total);

// Temporary for swapping
let a = 10, b = 20;
let temp = a;  // TEMPORARY: store a's value
a = b;         // a gets b's value
b = temp;      // b gets original a from temporary

console.log('Swapped: a =', a, 'b =', b);

/* Why do temporary variables make code easier to debug? */