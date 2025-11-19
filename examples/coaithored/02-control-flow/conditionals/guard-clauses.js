'use strict';

/* Control Flow: Guard Clauses Overview

Guard clause concepts distilled to essence:
- guard-clauses-essence.js - early returns vs nested conditionals
- (additional focused examples as needed)

Study with: Start with guard-clauses-essence.js */

// Compare nested vs guard clause approaches
function validateNested(score) {
    if (score !== undefined) {
        if (score >= 0) {
            if (score <= 100) {
                console.log('Valid score:', score);
                return 'valid';
            } else {
                return 'too_high';
            }
        } else {
            return 'negative';
        }
    } else {
        return 'missing';
    }
}

function validateGuarded(score) {
    // Guard clauses - check problems first, exit early
    if (score === undefined) return 'missing';
    if (score < 0) return 'negative';
    if (score > 100) return 'too_high';
    
    // Happy path - no nesting
    console.log('Valid score:', score);
    return 'valid';
}

// Test both approaches
console.log('Nested approach:');
console.log(validateNested(85));
console.log(validateNested(-5));

console.log('\nGuard clause approach:');
console.log(validateGuarded(85));
console.log(validateGuarded(-5));

console.log('\nGuard clauses = flatter code, easier to read');

/* See essence files for detailed guard clause exploration */