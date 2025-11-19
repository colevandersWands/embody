'use strict';

/* Control Flow: Break in Loops Essence

break statement = exit loop immediately, skip remaining iterations.
Useful for early termination when target found or condition met.

Study with: ?trace to see when break interrupts loop execution */

// Basic break - find target and exit
for (let i = 1; i <= 10; i++) {
    console.log('Checking:', i);
    
    if (i === 5) {
        console.log('Found target 5!');
        break; // Stops loop here
    }
}
console.log('Loop finished early');

// Break in while loop - prevent infinite loop
let counter = 1;
while (true) {
    console.log('Counter:', counter);
    
    if (counter >= 3) {
        break; // Exit infinite loop
    }
    counter++;
}

// Compare: loop with break vs loop without break
console.log('Without break:');
for (let i = 1; i <= 5; i++) {
    console.log('Running:', i);
}

console.log('With break at 3:');
for (let i = 1; i <= 5; i++) {
    if (i === 3) break;
    console.log('Running:', i);
}

/* When should you use break in loops? */