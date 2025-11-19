'use strict';

/* Variables: Reassignment

Shows how variables can change values over time.
Demonstrates that variables store the most recent value.

Study with:
- ?variables to track variable changes
- ?trace to see each assignment step
*/

// Start with initial value
let mood = 'happy';
console.log('Initial mood:', mood);

// Change the value multiple times
mood = 'excited';
console.log('After good news:', mood);

mood = 'tired';
console.log('After long day:', mood);

mood = 'relaxed';
console.log('After rest:', mood);

// Variables can change types too
let data = 'text';
console.log('data as string:', data, typeof data);

data = 42;
console.log('data as number:', data, typeof data);

data = true;
console.log('data as boolean:', data, typeof data);

/*
Educational questions:
- How many times does the variable 'mood' change?
- What happens to the old values?
- Is it good practice to change variable types?
- How does reassignment differ from declaration?
*/