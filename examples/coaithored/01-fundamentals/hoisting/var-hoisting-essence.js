'use strict';

/* Variables: Var Hoisting Essence

var declarations are hoisted to function/script top.
Declaration hoists, initialization stays in place.

Study with: ?variables to see when var becomes available */

// This works! var declaration is hoisted
console.log('Before declaration:', test); // undefined (not error!)
var test = 'Hello';
console.log('After initialization:', test); // 'Hello'

// Function scope hoisting
function demo() {
    console.log('Inside function, before var:', x); // undefined
    
    if (true) {
        var x = 'Block assignment';
        console.log('Inside block:', x); // 'Block assignment'
    }
    
    console.log('After block:', x); // Still accessible! Function scoped
}

demo();

// Multiple declarations merge
var duplicate = 'first';
console.log('First:', duplicate);
var duplicate = 'second';  // Redeclaration allowed
console.log('Second:', duplicate);

/* Why undefined instead of ReferenceError? */