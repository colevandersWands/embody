'use strict';

/* Misconception: Closures Capture Values

MISCONCEPTION: "Closures capture values"
REALITY: Closures capture variables (live references)

Study with:
- ?variables to see shared variable access in closures
- ?trace to see variable reference behavior
*/

function createCounters() {
    let sharedCount = 0; // This variable is shared between closures
    
    const increment = function() {
        sharedCount++;
        console.log('Incremented to: ' + sharedCount);
    };
    
    const decrement = function() {
        sharedCount--;
        console.log('Decremented to: ' + sharedCount);
    };
    
    return { increment: increment, decrement: decrement };
}

console.log('=== Closures Capture Variables, Not Values ===');

const counters = createCounters();

counters.increment(); // 1
counters.increment(); // 2  
counters.decrement(); // 1

console.log('Both functions share the same sharedCount variable!');

/*
Why do both closures see the same changing sharedCount value?
*/