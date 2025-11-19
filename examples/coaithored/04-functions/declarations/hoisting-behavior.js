'use strict';

/* Functions: Hoisting Behavior Overview

Hoisting concepts distilled to minimal essence:
- minimal-hoisting-essence.js - core declaration vs expression
- hoisting-timing-comparison.js - precise timing differences

Study with: Master the essence first, then explore timing */

// Essential demonstration
console.log('=== Hoisting Essence ===');

// Declaration works before definition
console.log('Before: ' + worksBefore());

function worksBefore() {
    return 'Declaration hoisted';
}

// Expression fails before definition
console.log('Expression exists: ' + (typeof failsBefore !== 'undefined'));

let failsBefore = function() {
    return 'Expression not hoisted';
};

console.log('After: ' + failsBefore());

/* See focused examples for deep timing analysis */