'use strict';

/* Scope: Global Scope Overview

Global scope concepts have been split into focused examples:
- basic-global-scope.js - how global variables work
- global-modification.js - modifying globals from functions
- accidental-globals.js - preventing unintentional globals  
- global-scope-pollution.js - problems with too many globals

Study with:
- Start with basic-global-scope.js for foundational concepts
- ?variables to see global scope behavior in any example
*/

// Quick demonstration of core concept
console.log('=== Global Scope Core Concept ===');

var globalExample = 'Accessible everywhere';

function accessFromFunction() {
    console.log('From function: ' + globalExample);
}

console.log('From script: ' + globalExample);
accessFromFunction();

/*
See the focused examples for detailed exploration of global scope concepts.
*/
