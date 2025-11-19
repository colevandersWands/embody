'use strict';

/* Classes: Class Inheritance Overview

Class inheritance concepts distilled to essence:
- class-inheritance-essence.js - extends, super, method overriding
- (additional focused examples as needed)

Study with: Start with class-inheritance-essence.js */

// Quick demonstration of inheritance
class Vehicle {
    constructor(type) {
        this.type = type;
    }
    
    start() {
        return this.type + ' starting';
    }
}

class Car extends Vehicle {
    constructor(brand) {
        super('car'); // Call parent constructor
        this.brand = brand;
    }
    
    start() {
        return this.brand + ' car starting'; // Override parent
    }
    
    honk() {
        return this.brand + ' honks'; // New method
    }
}

// Inheritance in action
let vehicle = new Vehicle('generic');
let car = new Car('Toyota');

console.log('Vehicle:', vehicle.start()); // 'generic starting'
console.log('Car:', car.start()); // 'Toyota car starting' (overridden)
console.log('Honk:', car.honk()); // 'Toyota honks' (new)

// Prototype chain check
console.log('car instanceof Car:', car instanceof Car); // true
console.log('car instanceof Vehicle:', car instanceof Vehicle); // true

/* See essence files for detailed inheritance exploration */