'use strict';

/* Scope: Block Scope Overview

Block scope concepts have been split into focused examples:
- basic-block-scope.js - let/const vs var in blocks
- loop-block-scope.js - block scope in loop iterations  
- block-scope-shadowing.js - variable shadowing in nested blocks
- temporal-dead-zone.js - TDZ behavior with let/const
- switch-case-blocks.js - block scope in switch statements

Study with:
- Start with basic-block-scope.js for foundational concepts
- ?variables to see scope boundaries in any example
*/

// Quick demonstration of core concept
console.log('=== Block Scope Core Concept ===');

{
    let blockScoped = 'Only exists in this block';
    var functionScoped = 'Escapes to function scope';
    console.log('Inside block: both variables accessible');
}

console.log('Outside block:');
console.log('  blockScoped exists: ' + (typeof blockScoped !== 'undefined'));
console.log('  functionScoped exists: ' + (typeof functionScoped !== 'undefined'));

/*
See the focused examples for detailed exploration of block scope concepts.
*/
