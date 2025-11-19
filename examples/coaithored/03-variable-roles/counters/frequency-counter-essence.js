'use strict';

/* Variable Roles: Frequency Counter Essence

Frequency counter = variables that track how often specific things occur.
Each counter variable has COUNTER role for one category.

Study with: ?variables to see counter variables tracking frequencies */

// COUNTER variables for frequency tracking
let appleCount = 0;   // COUNTER: tracks apple occurrences
let orangeCount = 0;  // COUNTER: tracks orange occurrences  
let bananaCount = 0;  // COUNTER: tracks banana occurrences

// Process fruits: apple, orange, apple, banana, apple
let fruits = ['apple', 'orange', 'apple', 'banana', 'apple'];

for (let i = 0; i < fruits.length; i++) {
    let fruit = fruits[i];
    
    // Increment appropriate counter
    if (fruit === 'apple') {
        appleCount++;       // COUNTER: increment apple frequency
    } else if (fruit === 'orange') {
        orangeCount++;      // COUNTER: increment orange frequency  
    } else if (fruit === 'banana') {
        bananaCount++;      // COUNTER: increment banana frequency
    }
    
    console.log(`Processed ${fruit} (total: ${appleCount}a, ${orangeCount}o, ${bananaCount}b)`);
}

// Find most frequent using counter comparison
let mostFrequent = 'apple';
let maxCount = appleCount;

if (orangeCount > maxCount) {
    mostFrequent = 'orange';
    maxCount = orangeCount;
}
if (bananaCount > maxCount) {
    mostFrequent = 'banana';
    maxCount = bananaCount;
}

console.log(`Most frequent: ${mostFrequent} (${maxCount} times)`);

/* Why use separate counter variables instead of one data structure? */