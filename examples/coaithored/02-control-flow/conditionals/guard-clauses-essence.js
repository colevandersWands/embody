'use strict';

/* Control Flow: Guard Clauses Essence

Guard clause = early return to avoid nesting. Check invalid conditions first,
exit early, then handle valid case without deep nesting.

Study with: ?trace to see early exit paths */

// Without guard clauses - nested hell
function processNested(data) {
    if (data) {
        if (data.length > 0) {
            if (data[0] !== null) {
                console.log('Processing:', data[0]);
                return 'success';
            } else {
                return 'null_item';
            }
        } else {
            return 'empty_array';
        }
    } else {
        return 'no_data';
    }
}

// With guard clauses - flat structure
function processGuarded(data) {
    // Guard clauses - check problems first
    if (!data) return 'no_data';
    if (data.length === 0) return 'empty_array';
    if (data[0] === null) return 'null_item';
    
    // Happy path - no nesting
    console.log('Processing:', data[0]);
    return 'success';
}

// Test both approaches
console.log('Nested:', processNested(['hello']));
console.log('Guarded:', processGuarded(['hello']));

console.log('Nested fail:', processNested(null));
console.log('Guarded fail:', processGuarded(null));

/* Why are guard clauses easier to read than nested conditionals? */