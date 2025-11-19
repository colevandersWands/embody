'use strict';

/* Classes: Class Basics Overview

Class basic concepts distilled to essence:
- class-basics-essence.js - class syntax, constructor, methods
- (additional focused examples as needed)

Study with: Start with class-basics-essence.js */

// Quick demonstration of class basics
class Vehicle {
    constructor(type, brand) {
        this.type = type;
        this.brand = brand;
    }
    
    start() {
        return this.brand + ' ' + this.type + ' is starting';
    }
    
    stop() {
        return this.brand + ' ' + this.type + ' has stopped';
    }
}

// Create instances with new
let car = new Vehicle('car', 'Toyota');
let bike = new Vehicle('bike', 'Honda');

console.log('Car start:', car.start()); // 'Toyota car is starting'
console.log('Bike stop:', bike.stop()); // 'Honda bike has stopped'

// Classes are constructor functions
console.log('Vehicle is function:', typeof Vehicle === 'function'); // true
console.log('car instanceof Vehicle:', car instanceof Vehicle); // true

// Instance properties vs prototype methods
console.log('Has own property:', car.hasOwnProperty('brand')); // true
console.log('Has own method:', car.hasOwnProperty('start')); // false (on prototype)

/* See essence files for detailed class exploration */