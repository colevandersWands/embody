// Variable lifecycle examples showing let vs var behavior

// Example 1: Basic declaration and assignment
let name = 'Alice';
var age = 25;

console.log(name, age);

// Example 2: Block scope differences
if (true) {
  let blockLet = 'inside block';
  var blockVar = 'inside block too';
}

// blockLet is not accessible here (TDZ)
console.log(blockVar); // This works

// Example 3: Hoisting behavior
console.log(typeof hoistedVar); // undefined (hoisted but not initialized)
// console.log(typeof hoistedLet); // ReferenceError (TDZ)

var hoistedVar = 'declared after use';
let hoistedLet = 'also declared after use';

// Educational Questions for Trace Analysis:
// 1. When is each variable created in memory?
// 2. What values do variables have before assignment?
// 3. Which variables exist outside the if block?
// 4. How does hoisting affect variable access?