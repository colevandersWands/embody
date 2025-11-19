'use strict';

/* Misconceptions: Function Hoisting Confusion Essence

Misconception: All functions hoist the same way.
Reality: Only declarations hoist. Expressions and arrows don't.

Study with: ?trace to see hoisting differences */

// This works! Declarations hoist completely
console.log('Declaration before definition:', declared()); // Works!

function declared() {
    return 'I am hoisted';
}

// These don't work! Only var hoists, not the function assignment
console.log('Expression type:', typeof expressed); // undefined (not function!)
console.log('Arrow type:', typeof arrowed); // undefined (not function!)

// Trying to call them would be errors:
// expressed(); // TypeError: expressed is not a function
// arrowed();   // TypeError: arrowed is not a function

var expressed = function() {
    return 'I am not hoisted';
};

var arrowed = () => {
    return 'I am also not hoisted';
};

// Now they work
console.log('After assignment:', expressed()); // Works
console.log('After assignment:', arrowed()); // Works

/* Why do expressions behave like variables, not functions? */