'use strict';

/* Closures: Factory Functions

Demonstrates factory functions that create specialized functions.
Shows how closures customize behavior.

Study with:
- ?trace to see closure creation
- ?variables to see captured configuration
*/

// Factory for multiplier functions
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);
let times10 = createMultiplier(10);

console.log('double(5):', double(5));     // 10
console.log('triple(5):', triple(5));     // 15
console.log('times10(5):', times10(5));   // 50

// Factory for greeting functions
function createGreeting(greeting) {
    return function(name) {
        return `${greeting}, ${name}!`;
    };
}

let sayHello = createGreeting('Hello');
let sayHi = createGreeting('Hi');
let sayWelcome = createGreeting('Welcome');

console.log('\n' + sayHello('Alice'));
console.log(sayHi('Bob'));
console.log(sayWelcome('Charlie'));

// Factory for range checkers
function createRangeChecker(min, max) {
    return function(value) {
        return value >= min && value <= max;
    };
}

let isChild = createRangeChecker(0, 12);
let isTeen = createRangeChecker(13, 19);
let isAdult = createRangeChecker(18, 65);

console.log('\nAge 10 - Child?', isChild(10));   // true
console.log('Age 10 - Teen?', isTeen(10));       // false
console.log('Age 25 - Adult?', isAdult(25));     // true

/*
Educational questions:
- How do factory functions use closures?
- Why is each created function independent?
- When are factory functions useful?
*/