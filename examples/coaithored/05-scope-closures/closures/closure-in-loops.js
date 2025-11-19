'use strict';

/* Closures: Closures in Loops

Demonstrates the classic closure loop problem and solutions.
Shows how let vs var affects closure behavior in loops.

Study with:
- ?trace to see when closures capture variables
- Compare var vs let behavior
*/

// Problem: var in loop
console.log('=== The Problem: var in loops ===');
let functions1 = [];

for (var i = 0; i < 3; i++) {
    functions1.push(function() {
        console.log('Var closure sees i:', i);
    });
}

// All print 3! They share the same i
functions1[0](); // 3
functions1[1](); // 3
functions1[2](); // 3

// Solution 1: let creates new binding per iteration
console.log('\n=== Solution: let in loops ===');
let functions2 = [];

for (let j = 0; j < 3; j++) {
    functions2.push(function() {
        console.log('Let closure sees j:', j);
    });
}

// Each has its own j
functions2[0](); // 0
functions2[1](); // 1
functions2[2](); // 2

// Solution 2: IIFE to capture current value
console.log('\n=== Solution: IIFE ===');
let functions3 = [];

for (var k = 0; k < 3; k++) {
    (function(captured) {
        functions3.push(function() {
            console.log('IIFE captured:', captured);
        });
    })(k);
}

functions3[0](); // 0
functions3[1](); // 1
functions3[2](); // 2

/*
Educational questions:
- Why does var cause all functions to see the same value?
- How does let create a new binding per iteration?
- When would you use each solution?
*/