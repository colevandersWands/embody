'use strict';

/* Constructors: The 'new' Keyword Essence

new keyword does 4 steps: create object, set prototype, call constructor, return object.
Without new, 'this' is undefined (in strict mode) or global object.

Study with: ?variables to see object creation */

function Person(name) {
    this.name = name;
    this.greet = function() {
        return 'Hello, ' + this.name;
    };
}

// With 'new' - creates object properly
let person1 = new Person('Alice');
console.log('With new:', person1.name); // 'Alice'
console.log('Greet:', person1.greet()); // 'Hello, Alice'

// Without 'new' - error in strict mode
try {
    let person2 = Person('Bob'); // No 'new'
    console.log('Without new:', person2); // undefined
} catch (error) {
    console.log('Error without new:', error.name); // TypeError
}

// What 'new' does behind the scenes:
function manualNew(Constructor, ...args) {
    // 1. Create empty object
    let obj = {};
    // 2. Set prototype
    Object.setPrototypeOf(obj, Constructor.prototype);
    // 3. Call constructor with 'this' = obj
    let result = Constructor.apply(obj, args);
    // 4. Return object (or constructor result if object)
    return (typeof result === 'object' && result !== null) ? result : obj;
}

let person3 = manualNew(Person, 'Charlie');
console.log('Manual new:', person3.name); // 'Charlie'

/* Why do we need the 'new' keyword? */