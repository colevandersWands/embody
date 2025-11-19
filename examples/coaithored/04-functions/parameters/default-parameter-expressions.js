'use strict';

/* Functions: Default Parameter Expressions

Defaults can be expressions, not just literals.
Evaluated only when needed.

Study with: ?trace to see evaluation timing */

let counter = 0;

function getDefault() {
    counter++;
    console.log('getDefault called, counter: ' + counter);
    return 'dynamic-' + counter;
}

function demo(value = getDefault()) {
    console.log('Function called with: ' + value);
}

console.log('=== Expression Defaults ===');
demo('explicit');  // getDefault NOT called
demo();            // getDefault called  
demo();            // getDefault called again

// Parameter dependencies
function build(name = 'item', id = name + '-001') {
    console.log('Built: ' + id);
    return id;
}

build();           // item-001
build('widget');   // widget-001

/* When are default expressions evaluated? */