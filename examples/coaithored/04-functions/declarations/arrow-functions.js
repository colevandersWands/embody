'use strict';

/* Functions: Arrow Functions Overview

Arrow function concepts distilled to essence:
- arrow-essence.js - syntax and implicit returns
- arrow-vs-regular-this.js - lexical this binding

Study with: Start with essence - master syntax first */

// Essence demonstration
let double = x => x * 2;              // Implicit return
let greet = name => {                 // Block needs explicit return
    console.log('Hi ' + name);
    return 'Greeted';
};

console.log('Double 5: ' + double(5));
console.log('Greet: ' + greet('World'));

// No arguments object in arrows
let tryArgs = () => {
    console.log('Arguments exist: ' + (typeof arguments !== 'undefined'));
};

tryArgs(1, 2, 3);  // arguments not available

/* See focused examples for deep exploration */