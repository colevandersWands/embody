'use strict';

/* Closures: Private Variables Essence

Private variables = variables inside function that returned methods can access,
but external code cannot. Closure keeps private data alive.

Study with: ?variables to see which variables are accessible */

function createCounter() {
    // Private variable - only accessible inside this function
    let count = 0;
    
    // Return object with methods that access private variable
    return {
        increment: function() {
            count++;  // Can access private count
            console.log('Count:', count);
        },
        
        getCount: function() {
            return count;  // Can read private count
        }
    };
}

let counter = createCounter();

// Public methods work
counter.increment();  // Count: 1
counter.increment();  // Count: 2
console.log('Current:', counter.getCount()); // 2

// Private variable is not accessible
console.log('Direct access:', counter.count); // undefined

/* Why can methods access count but external code cannot? */