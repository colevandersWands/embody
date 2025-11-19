'use strict';

/* Misconceptions: Equality Confusion Essence

== does type coercion (dangerous), === checks type AND value (safe).
Always use === to avoid unexpected results from type conversion.

Study with: ?variables to see type coercion in == comparisons */

// == coerces types (dangerous)
console.log('5 == "5":', 5 == '5');        // true (string→number)
console.log('5 === "5":', 5 === '5');      // false (different types)

console.log('0 == false:', 0 == false);    // true (boolean→number)  
console.log('0 === false:', 0 === false);  // false (different types)

console.log('"" == false:', '' == false);  // true (both→0)
console.log('"" === false:', '' === false); // false (different types)

// Special case: null and undefined
console.log('null == undefined:', null == undefined);   // true (special rule)
console.log('null === undefined:', null === undefined); // false (different types)

// NaN breaks all equality rules
console.log('NaN === NaN:', NaN === NaN);              // false (unique property)
console.log('Number.isNaN(NaN):', Number.isNaN(NaN));  // true (correct way)

// Rule: Always use === unless you specifically need type coercion
let value = '5';
if (value === '5') {  // ✓ Explicit type check
    console.log('String five detected');
}

/* Why is === safer than == in JavaScript? */