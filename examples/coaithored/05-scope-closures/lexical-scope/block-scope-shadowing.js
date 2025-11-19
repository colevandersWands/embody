'use strict';

/* Scope: Block Scope Shadowing

Inner blocks can shadow (hide) variables from outer scopes.
Each block creates a new namespace.

Study with:
- ?variables to see which variable is accessed at each level
- ?trace to follow variable resolution in nested blocks
*/

// Variable shadowing with blocks
console.log('=== Block Scope Shadowing ===');

let message = 'Outer scope message';
console.log('Outer scope: ' + message);

{
    console.log('Enter first block');
    let message = 'First block message';  // Shadows outer
    console.log('First block: ' + message);
    
    {
        console.log('Enter nested block');
        let message = 'Nested block message';  // Shadows both outer levels
        console.log('Nested block: ' + message);
    }
    
    console.log('Back in first block: ' + message);
}

console.log('Back in outer scope: ' + message);

/*
How does variable shadowing work with nested block scopes?
*/