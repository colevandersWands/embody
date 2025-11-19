'use strict';

/* Classes: Class vs Constructor Essence

Classes are syntactic sugar over constructor functions.
Same prototype behavior, cleaner syntax.

Study with: ?variables to see identical prototype structures */

// Old way: Constructor function
function PersonFunc(name) {
    this.name = name;
}
PersonFunc.prototype.greet = function() {
    return 'Hello, ' + this.name;
};

// New way: Class syntax
class PersonClass {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return 'Hello, ' + this.name;
    }
}

// Both create identical objects
let func = new PersonFunc('Alice');
let classy = new PersonClass('Bob');

console.log('Function approach:', func.greet()); // 'Hello, Alice'
console.log('Class approach:', classy.greet()); // 'Hello, Bob'

// Both use prototypes under the hood
console.log('func instanceof PersonFunc:', func instanceof PersonFunc); // true
console.log('classy instanceof PersonClass:', classy instanceof PersonClass); // true

console.log('Same prototype pattern:', typeof PersonFunc === typeof PersonClass); // true

/* Why prefer class syntax over constructor functions? */