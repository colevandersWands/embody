'use strict';

/* Functions: Function Name Conflicts

Same name in different scopes - which one gets called?
Local functions shadow (hide) global ones.

Study with: ?trace to see which function resolves */

// Global function
function test() {
    return 'Global';
}

function demo() {
    // This calls local test (hoisted), not global!
    console.log('Inside demo: ' + test());
    
    function test() {
        return 'Local';
    }
}

console.log('Global call: ' + test());
demo();
console.log('Still global: ' + test());

// Block scope shadows too
if (true) {
    function blockTest() {
        return 'Block scoped';
    }
    console.log('In block: ' + blockTest());
}

/* Which function wins when names conflict? */