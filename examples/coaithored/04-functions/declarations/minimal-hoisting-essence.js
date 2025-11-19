'use strict';

/* Functions: Hoisting Essence

Function declarations: fully hoisted (available before definition)
Function expressions: not hoisted (TDZ like let/const)

Study with: ?trace to see availability timing */

// Declaration hoisted - works!
console.log('Declaration: ' + declared());

function declared() {
    return 'I am hoisted';
}

// Expression not hoisted - TDZ error!
try {
    console.log('Expression: ' + expressed());
} catch (error) {
    console.log('TDZ Error: ' + error.name);
}

let expressed = function() {
    return 'I am not hoisted';
};

console.log('After definition: ' + expressed());

/* Why the different hoisting behavior? */