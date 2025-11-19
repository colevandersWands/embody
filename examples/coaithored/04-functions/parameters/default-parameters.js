'use strict';

/* Functions: Default Parameters Overview

Default parameter concepts split into minimal examples:
- minimal-default-parameters.js - core behavior essence
- default-parameter-expressions.js - expression evaluation timing

Study with: Start with minimal - master the essence first */

// Core concept demonstration
function demo(msg = 'default message') {
    console.log('Message: ' + msg);
}

console.log('=== Default Parameters Core ===');
demo();              // Uses default
demo('custom');      // Uses argument

// Show undefined vs missing
function test(a = 'A', b = 'B') {
    console.log('a=' + a + ', b=' + b);
}

test(undefined, 'custom');  // a=A, b=custom
test('custom', undefined);  // a=custom, b=B

/* See focused examples for deep exploration */