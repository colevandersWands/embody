'use strict';

/* Polymorphism: Duck Typing

Demonstrates "if it walks like a duck and quacks like a duck, it's a duck".
Shows how JavaScript uses duck typing for polymorphism.

Study with:
- ?trace to see interface checking
- ?variables to see different object structures
*/

// Different objects with same interface
let realDuck = {
    walk: function() { return 'waddles'; },
    quack: function() { return 'quack'; }
};

let robot = {
    walk: function() { return 'moves mechanically'; },
    quack: function() { return 'beep beep'; },
    model: 'DuckBot 3000'
};

let person = {
    walk: function() { return 'strides'; },
    quack: function() { return 'trying to quack'; },
    name: 'Alice'
};

// Function that works with anything "duck-like"
function testDuck(thing) {
    console.log('Testing duck-like behavior:');
    
    if (typeof thing.walk === 'function' && typeof thing.quack === 'function') {
        console.log(`  It ${thing.walk()}`);
        console.log(`  It says "${thing.quack()}"`);
        console.log('  ✓ Passes duck test!');
    } else {
        console.log('  ✗ Not duck-like');
    }
}

console.log('Real duck:');
testDuck(realDuck);

console.log('\nRobot:');
testDuck(robot);

console.log('\nPerson:');
testDuck(person);

// Non-duck object
let car = {
    drive: function() { return 'vrooom'; }
};

console.log('\nCar:');
testDuck(car);

/*
Educational questions:
- What makes something "duck-like" in JavaScript?
- How does duck typing enable flexible code?
- When might duck typing cause problems?
*/