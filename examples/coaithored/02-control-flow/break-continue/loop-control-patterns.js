'use strict';

/* Control Flow: Loop Control Patterns Overview

Loop control pattern concepts have been split into focused examples:
- search-and-return-pattern.js - early return when target found
- validation-and-skip-pattern.js - continue to skip invalid data
- early-exit-pattern.js - break to stop on conditions

Study with:
- Start with search-and-return-pattern.js for basic concepts
- ?trace to see different control flow paths
*/

// Quick demonstration of control patterns
console.log('=== Loop Control Patterns Core Concepts ===');

// Search pattern
function quickSearch(target) {
    for (let i = 1; i <= 5; i++) {
        console.log('Checking: ' + i);
        if (i === target) {
            console.log('Found: ' + target);
            return i;
        }
    }
    return -1;
}

// Skip pattern
function quickSkip() {
    for (let i = 1; i <= 5; i++) {
        if (i === 3) {
            console.log('Skipping: ' + i);
            continue;
        }
        console.log('Processing: ' + i);
    }
}

// Early exit pattern
function quickExit() {
    for (let i = 1; i <= 5; i++) {
        console.log('Processing: ' + i);
        if (i === 3) {
            console.log('Exiting early at: ' + i);
            break;
        }
    }
}

quickSearch(3);
quickSkip();
quickExit();

/*
See the focused examples for detailed exploration of control patterns.
*/