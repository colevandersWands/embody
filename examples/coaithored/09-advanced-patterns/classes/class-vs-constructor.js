'use strict';

/* Classes: Class vs Constructor Function Overview

Class vs constructor concepts distilled to essence:
- class-vs-constructor-essence.js - syntactic sugar comparison
- (additional focused examples as needed)

Study with: Start with class-vs-constructor-essence.js */

// Quick demonstration of equivalent approaches

// Constructor function approach
function CarFunc(brand) {
    this.brand = brand;
}
CarFunc.prototype.start = function() {
    return this.brand + ' starting';
};

// Class approach (same result)
class CarClass {
    constructor(brand) {
        this.brand = brand;
    }
    
    start() {
        return this.brand + ' starting';
    }
}

// Both create identical functionality
let func = new CarFunc('Toyota');
let classy = new CarClass('Honda');

console.log('Function style:', func.start()); // 'Toyota starting'
console.log('Class style:', classy.start()); // 'Honda starting'

// Same prototype chain
console.log('Both are functions:', typeof CarFunc === typeof CarClass); // true
console.log('Both use instanceof:', func instanceof CarFunc, classy instanceof CarClass); // true true

/* See essence files for detailed comparison */