// Misconception: "const means the value can't change"
// Reality: const prevents reassignment of the variable

console.log('=== const vs let vs var Assignment ===');

// const prevents reassignment
const name = 'Alice';
const age = 25;
const isActive = true;

console.log('Initial name:', name);
console.log('Initial age:', age);
console.log('Initial isActive:', isActive);

// These would fail (reassignment):
// name = 'Bob';        // TypeError: Assignment to const variable  
// age = 26;            // TypeError: Assignment to const variable
// isActive = false;    // TypeError: Assignment to const variable

console.log('const prevents variable reassignment');

// Comparison with let (can reassign)
let score = 100;
console.log('Initial score:', score);
score = 95;  // This works
console.log('After reassignment score:', score);

// Comparison with var (can reassign)
var level = 1;
console.log('Initial level:', level);
level = 2;  // This works  
console.log('After reassignment level:', level);

console.log('MISCONCEPTION: const makes values immutable');
console.log('CORRECT: const prevents variable reassignment only');

// Educational Analysis:
// - const prevents the VARIABLE from being reassigned
// - let and var allow reassignment
// - This is about variable binding, not value immutability
// - const with primitives effectively creates "constants"