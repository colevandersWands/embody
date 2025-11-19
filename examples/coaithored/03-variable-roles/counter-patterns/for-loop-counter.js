'use strict';

/* Variable Roles: For Loop Counter Pattern

Counter variables control loop iterations through init/condition/increment.
Study how COUNTER role differs from TEMPORARY calculation variables.

Study with:
- ?variables to see counter lifecycle 
- ?trace to follow initialization, comparison, increment
*/

// Basic counter pattern
console.log('=== Basic counter pattern ===');

for (let i = 0; i < 5; i++) {    // COUNTER role: controls loop iterations
    let value = i * 10 + 5;      // TEMPORARY: calculated for this iteration
    console.log('Item ' + i + ': value = ' + value);
}

// Counter with step pattern  
console.log('\n=== Step counter pattern ===');

for (let counter = 0; counter <= 10; counter += 2) {  // COUNTER role: steps by 2
    let doubled = counter * 2;                         // TEMPORARY: calculation result
    console.log('Counter ' + counter + ': doubled = ' + doubled);
}

// Countdown counter pattern
console.log('\n=== Countdown counter pattern ===');

for (let countdown = 5; countdown > 0; countdown--) {  // COUNTER role: decreasing
    let remaining = countdown - 1;                     // TEMPORARY: items left after this
    console.log('T-minus ' + countdown + ' (remaining: ' + remaining + ')');
}

/*
How do COUNTER variables control loop execution versus TEMPORARY calculation variables?
*/