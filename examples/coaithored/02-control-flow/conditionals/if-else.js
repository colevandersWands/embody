'use strict';

/* Control Flow: If-Else Statements

Demonstrates basic conditional execution with if-else.
Shows how conditions control which code blocks execute.

Study with:
- ?trace to see which branches execute
- Try different conditions by changing the value
*/

// Different test values - uncomment to explore
let age = 25;
// let age = 15;
// let age = 18;
// let age = 65;

console.log('Testing age:', age);
console.log();

// Basic if-else
if (age >= 18) {
    console.log('You are an adult');
    console.log('You can vote');
} else {
    console.log('You are a minor');
    console.log('You cannot vote yet');
}

// Multiple conditions with else if
if (age < 13) {
    console.log('Category: Child');
} else if (age < 18) {
    console.log('Category: Teenager');
} else if (age < 65) {
    console.log('Category: Adult');
} else {
    console.log('Category: Senior');
}

// Nested conditionals
if (age >= 18) {
    console.log('\nAdult privileges:');
    
    if (age >= 21) {
        console.log('- Can purchase alcohol (US)');
    } else {
        console.log('- Cannot purchase alcohol yet (US)');
    }
    
    if (age >= 25) {
        console.log('- Reduced car rental fees');
    }
}

/*
Educational questions:
- Which code blocks execute for different age values?
- How does else if differ from multiple separate if statements?
- When would you use nested if statements?
- What happens if no conditions are true?
*/