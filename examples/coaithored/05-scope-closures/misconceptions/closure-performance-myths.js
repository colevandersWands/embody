'use strict';

/* Misconception: Closure Performance Myths

MISCONCEPTION: "Closures are always slow and use lots of memory"
REALITY: Modern engines optimize closures efficiently

Study with:
- ?variables to see closure efficiency
- ?trace to see performance characteristics
*/

console.log('=== Closure Performance Myths ===');

// Myth: Closures are slow
function createOptimizedCounter() {
    let count = 0;
    
    // Modern engines optimize this closure
    return function() {
        count++;
        return count;
    };
}

const counter = createOptimizedCounter();

console.log('Optimized closure performance:');
console.log('First call: ' + counter());   // 1
console.log('Second call: ' + counter());  // 2
console.log('Third call: ' + counter());   // 3

// Myth: All outer variables are captured
function demonstrateSelectiveCapture() {
    let captured = 'This is captured';
    let notCaptured = 'This is not captured';
    
    return function() {
        return 'Only using: ' + captured;
        // notCaptured is optimized away
    };
}

const selective = demonstrateSelectiveCapture();
console.log('Selective capture: ' + selective());

/*
How do modern JavaScript engines make closures efficient?
*/