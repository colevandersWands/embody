'use strict';

/* Misconceptions: Off-by-One Errors Essence

Off-by-one error = loop runs one iteration too few or too many.
Usually caused by < vs <= confusion in loop conditions.

Study with: ?trace to see how many iterations actually happen */

// Common mistake: < instead of <=
console.log('Goal: Print numbers 1, 2, 3, 4, 5');

console.log('WRONG - using <:');
for (let i = 1; i < 5; i++) {  // Only goes to 4!
    console.log('Number:', i);
}
// Output: 1, 2, 3, 4 (missing 5)

console.log('\nCORRECT - using <=:');
for (let i = 1; i <= 5; i++) {  // Goes to 5 as intended
    console.log('Number:', i);
}
// Output: 1, 2, 3, 4, 5 (all numbers)

// Another mistake: wrong starting point
console.log('\nGoal: Process 3 items starting from 0');

console.log('WRONG - starting from 1:');
for (let i = 1; i < 3; i++) {  // Only processes items 1, 2
    console.log('Item:', i);
}
// Output: 1, 2 (missing item 0)

console.log('\nCORRECT - starting from 0:');
for (let i = 0; i < 3; i++) {  // Processes items 0, 1, 2
    console.log('Item:', i);
}
// Output: 0, 1, 2 (all 3 items)

/* Why do off-by-one errors happen so frequently in loops? */