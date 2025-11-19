'use strict';

/* Functions: Block-Level Function Hoisting

Function declarations in blocks have complex hoisting.
Block scope vs function scope creates edge cases.

Study with: ?trace to see timing differences */

// Block function behavior demo
console.log('Before block: ' + (typeof blockFunc !== 'undefined'));

if (true) {
    console.log('In block, before: ' + (typeof blockFunc !== 'undefined'));
    
    function blockFunc() {
        return 'Block function';
    }
    
    console.log('In block, after: ' + blockFunc());
}

console.log('After block: ' + (typeof blockFunc !== 'undefined'));

// Conditional blocks
if (false) {
    function neverDeclared() {
        return 'Never runs';
    }
}

console.log('Never declared exists: ' + (typeof neverDeclared !== 'undefined'));

/* Why do block functions hoist differently? */