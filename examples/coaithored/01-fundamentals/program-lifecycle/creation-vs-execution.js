// Program Lifecycle: Creation Phase vs Execution Phase
// Understanding when things happen in JavaScript
// NO FUNCTIONS - JUST VARIABLES for now!

console.log('=== Program Lifecycle Example ===');

// CREATION PHASE:
// - Variable declarations are hoisted (but not initializations)  
// - Scope is established
// - Memory space is allocated

// This will be undefined (creation phase hoists declaration, not assignment)
console.log('Early access to userName:', userName);
console.log('Early access to userAge:', userAge);

// EXECUTION PHASE:
// - Code runs line by line
// - Variables get their values
// - Actual assignments happen

var userName = 'Bob';  // Assignment happens during execution
let userAge = 25;      // let also gets assigned during execution

console.log('After assignment userName:', userName);
console.log('After assignment userAge:', userAge);

// More execution phase behavior
userName = 'Alice';    // Reassignment
userAge = userAge + 1; // Calculation and reassignment

console.log('After reassignment userName:', userName);
console.log('After reassignment userAge:', userAge);

// Educational Trace Analysis:
// 1. Creation Phase Events:
//    - When are function declarations processed?
//    - When are variable declarations processed?
//    - What's the initial value of hoisted variables?
//
// 2. Execution Phase Events:
//    - When do variable assignments happen?
//    - When are function expressions created?
//    - What's the order of console.log outputs?
//
// 3. Phase Interactions:
//    - How does hoisting affect execution order?
//    - When can functions be called vs when they're defined?
//    - What values are available at each point?

// Expected output order:
// Hello, Alice
// Early access to userName: undefined  
// After assignment userName: Bob
// Current userName during greeting: undefined (when greetUser was called)
// Goodbye, Charlie