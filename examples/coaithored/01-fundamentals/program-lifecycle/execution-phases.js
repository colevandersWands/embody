'use strict';

/* Program Lifecycle: Execution Phases

Demonstrates creation phase vs execution phase.
Shows when variables and functions are created vs assigned.

Study with:
- ?variables to see creation vs execution timing
- ?trace to follow the two-phase process
*/

// Creation phase: declarations are processed
console.log('=== Execution Phase Begins ===');
console.log('1. varExample before assignment:', varExample); // undefined
console.log('2. Can call function:', declaredFunction()); // works!

// These declarations were processed in creation phase
var varExample = 'Now assigned';

function declaredFunction() {
    return 'Function was created in creation phase';
}

// Execution phase: assignments happen
console.log('3. varExample after assignment:', varExample);

// Let/const are in temporal dead zone during creation phase
console.log('4. About to declare let variable');
let letExample = 'Let assignment happens in execution phase';
console.log('5. letExample after declaration:', letExample);

/*
Educational questions:
- What happens during the creation phase?
- When do variable assignments occur?
- How does this relate to hoisting?
*/