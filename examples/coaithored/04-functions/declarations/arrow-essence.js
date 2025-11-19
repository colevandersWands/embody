'use strict';

/* Functions: Arrow Essence

Arrow functions: concise syntax, implicit return, lexical this.
ES6's => replaces function keyword.

Study with: ?trace to see implicit vs explicit behavior */

// Regular function
let regular = function(x) { return x * 2; };

// Arrow - same behavior, less syntax
let arrow = x => x * 2;  // implicit return!

console.log('Regular: ' + regular(5));
console.log('Arrow: ' + arrow(5));

// Multiple parameters need ()
let add = (a, b) => a + b;

// Block body needs explicit return
let explain = x => {
    console.log('Processing: ' + x);
    return x + 1;
};

console.log('Add: ' + add(2, 3));
console.log('Explain: ' + explain(10));

/* Why implicit return only without braces? */