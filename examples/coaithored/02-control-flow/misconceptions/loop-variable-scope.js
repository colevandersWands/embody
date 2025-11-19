'use strict';

/* Misconceptions: Loop Variable Scope Confusion Overview

Loop variable scope concepts distilled to essence:
- loop-variable-scope-essence.js - var vs let scoping differences
- (additional focused examples as needed)

Study with: Start with loop-variable-scope-essence.js */

// Quick demonstration of loop variable scope
console.log('Loop Variable Scope Demo:');

// var leaks from loops
for (var leaked = 0; leaked < 2; leaked++) {
    console.log('Inside loop:', leaked);
}
console.log('var leaked outside:', leaked); // 2

// let stays in loop scope
for (let contained = 0; contained < 2; contained++) {
    console.log('Inside loop:', contained);
}
// console.log('let contained:', contained); // ReferenceError

// Variable pollution problem
var important = 'original value';
for (var important = 0; important < 2; important++) {
    console.log('Loop overwrites:', important);
}
console.log('Original lost:', important); // 2 (not 'original value')

// let prevents pollution
let protected = 'original value';
for (let protected = 0; protected < 2; protected++) {
    console.log('Loop shadow:', protected);
}
console.log('Original preserved:', protected); // 'original value'

/* See essence files for detailed scope exploration */