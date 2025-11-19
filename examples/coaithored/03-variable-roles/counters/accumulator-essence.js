'use strict';

/* Variable Roles: Accumulator Essence

ACCUMULATOR role: variable that gathers/builds up values.
Starts with identity value, combines values in each iteration.

Study with: ?variables to see accumulator growing */

// Sum accumulator (identity: 0)
let sum = 0;
for (let i = 1; i <= 3; i++) {
    sum += i;  // 0+1=1, 1+2=3, 3+3=6
    console.log('Sum after ' + i + ': ' + sum);
}

// Product accumulator (identity: 1)
let product = 1;
for (let i = 2; i <= 4; i++) {
    product *= i;  // 1*2=2, 2*3=6, 6*4=24
    console.log('Product after ' + i + ': ' + product);
}

// String accumulator (identity: '')
let text = '';
let words = ['Hello', ' ', 'World'];
for (let word of words) {
    text += word;  // ''+'Hello'='Hello', 'Hello'+' '='Hello ', etc.
    console.log('Text so far: "' + text + '"');
}

/* Why start with 0 for sum, 1 for product, '' for strings? */