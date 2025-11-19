'use strict';

/* Control Flow: Continue in While Loops

Continue statement works in while loops too.
Shows continue with manual increment management.

Study with:
- ?trace to see continue behavior in while loops
- ?variables to track increment timing with continue
*/

// Continue in while loop - be careful with increment!
console.log('=== Continue in while loop ===');
let count = 0;

while (count < 8) {
    count++; // IMPORTANT: increment before continue check
    
    if (count % 2 === 0) {
        console.log('Skipping even number: ' + count);
        continue;
    }
    
    console.log('Processing odd number: ' + count);
}

// Continue with complex processing
console.log('\n=== Complex while with continue ===');
let value = 0;

while (value < 6) {
    value++;
    
    // Skip values that would cause "errors"
    if (value === 3 || value === 5) {
        console.log('Skipping problematic value: ' + value);
        continue;
    }
    
    let result = value * 10;
    console.log('Processing value ' + value + ' -> result: ' + result);
}

/*
Why must increment happen before continue in while loops?
*/