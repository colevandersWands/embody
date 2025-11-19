'use strict';

/* Variables: Var Declaration Hoisting Overview

Var hoisting concepts distilled to essence:
- var-hoisting-essence.js - declaration vs initialization hoisting
- (additional focused examples as needed)

Study with: Start with var-hoisting-essence.js */

// Quick demonstration of var hoisting
console.log('Var Hoisting Demo:');

// Declaration hoists, initialization doesn't
console.log('1. Before var declaration:', demo); // undefined
var demo = 'Hoisted declaration';
console.log('2. After var initialization:', demo); // 'Hoisted declaration'

// Function scope demo
function scopeTest() {
    console.log('3. In function, before var:', inner); // undefined
    
    if (true) {
        var inner = 'Function scoped';
    }
    
    console.log('4. After block:', inner); // 'Function scoped'
}

scopeTest();

// Redeclaration allowed
var redeclared = 'first';
var redeclared = 'second'; // No error
console.log('5. Redeclared var:', redeclared);

/* See essence files for detailed hoisting behavior */