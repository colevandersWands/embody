'use strict';

/* Control Flow: While vs Do-While

Difference between while and do-while loops.
Do-while executes at least once, while might not execute at all.

Study with:
- ?trace to see execution differences
- ?variables to compare iteration counts
*/

// While loop - might not execute
console.log('=== While Loop (condition false) ===');
let whileCount = 10;

while (whileCount < 5) {
    console.log('While: ' + whileCount);
    whileCount++;
}

console.log('While loop executed 0 times');

// Do-while loop - executes at least once
console.log('\n=== Do-While Loop (condition false) ===');
let doWhileCount = 10;

do {
    console.log('Do-while: ' + doWhileCount);
    doWhileCount++;
} while (doWhileCount < 5);

console.log('Do-while loop executed 1 time');

// Both with true condition
console.log('\n=== Both with true condition ===');
let whileTrue = 1;
let doWhileTrue = 1;

console.log('While with true condition:');
while (whileTrue <= 3) {
    console.log('  While: ' + whileTrue);
    whileTrue++;
}

console.log('Do-while with true condition:');
do {
    console.log('  Do-while: ' + doWhileTrue);
    doWhileTrue++;
} while (doWhileTrue <= 3);

/*
When is do-while more appropriate than while?
*/