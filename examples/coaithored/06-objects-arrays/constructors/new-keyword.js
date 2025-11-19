'use strict';

/* Constructors: The 'new' Keyword Overview

New keyword concepts distilled to essence:
- new-keyword-essence.js - 4 steps of new, with vs without new
- (additional focused examples as needed)

Study with: Start with new-keyword-essence.js */

// Quick demonstration of new keyword
function Car(brand) {
    this.brand = brand;
    this.start = function() {
        return this.brand + ' is starting';
    };
}

// With 'new' - proper object creation
let car1 = new Car('Toyota');
console.log('With new:', car1.brand); // 'Toyota'
console.log('Method works:', car1.start()); // 'Toyota is starting'

// Without 'new' - fails in strict mode
try {
    let car2 = Car('Honda'); // Missing 'new'
    console.log('Without new:', car2); // undefined
} catch (error) {
    console.log('Error:', error.message); // 'this' is undefined
}

// Prototype check
console.log('Instance check:', car1 instanceof Car); // true
console.log('Constructor check:', car1.constructor === Car); // true

// What new does conceptually
function createObject(Constructor, ...args) {
    let obj = {};
    Constructor.apply(obj, args);
    return obj;
}

let car3 = createObject(Car, 'Ford');
console.log('Manual creation:', car3.brand); // 'Ford'

/* See essence files for detailed new keyword exploration */