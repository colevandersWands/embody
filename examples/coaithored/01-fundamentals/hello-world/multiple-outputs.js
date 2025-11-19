'use strict';

/* Hello World: Multiple Output Methods

Compares different ways to display messages.
Shows console.log vs alert differences.

Study with:
- ?trace to see execution order
- Notice the difference in user experience
*/

let message = 'Hello, World!';
// let message = 'Testing outputs';
// let message = 'Console vs Alert';

// Method 1: Console output (for developers)
console.log('Console:', message);
console.log('Type:', typeof message);
console.log('Length:', message.length);

// Method 2: User alert (for users)
alert(message);

// Method 3: Confirm with user
let confirmed = confirm('Did you see the message: "' + message + '"?');
console.log('User confirmed:', confirmed);

/*
Educational questions:
- What's the difference between console.log and alert?
- Who is the audience for each output method?
- How does confirm() return a boolean value?
- Why do developers prefer console.log for debugging?
*/