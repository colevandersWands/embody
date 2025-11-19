'use strict';

/* Variable Roles: Processing Control Flags

Control flags direct program execution flow.
FLAG role: starts, stops, or modifies processing behavior.

Study with:
- ?variables to see control flags changing program behavior
- ?trace to follow how flags affect execution paths
*/

// Processing control flag
console.log('=== Processing control flag ===');
let shouldContinue = true;    // FLAG role: controls processing

// Process numbers until we hit a stop condition
for (let value = 10; value <= 50; value += 10) {
    console.log('Processing value: ' + value);
    
    if (value === 30) {       // Stop condition
        shouldContinue = false;
        console.log('Stop signal received - ending processing');
        break;
    }
}

console.log('Final shouldContinue: ' + shouldContinue);

// Another example - conditional processing
console.log('\n=== Conditional processing ===');
let enableDetailedOutput = false;   // FLAG role: controls output level

for (let number = 1; number <= 3; number++) {
    console.log('Processing number: ' + number);
    
    if (enableDetailedOutput) {
        console.log('  Detailed info for ' + number);
    }
}

/*
How do control flags modify program execution behavior?
*/