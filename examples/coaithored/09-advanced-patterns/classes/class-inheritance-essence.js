'use strict';

/* Classes: Class Inheritance Essence

extends creates inheritance, super() calls parent constructor/methods.
Child classes inherit and can override parent behavior.

Study with: ?variables to see inheritance chain */

// Parent class
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return this.name + ' makes a sound';
    }
}

// Child class extends parent
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        return this.name + ' barks'; // Override parent method
    }
    
    wagTail() {
        return this.name + ' wags tail'; // New method
    }
}

// Create instances
let animal = new Animal('Generic');
let dog = new Dog('Buddy', 'Golden');

console.log('Animal speak:', animal.speak()); // 'Generic makes a sound'
console.log('Dog speak:', dog.speak()); // 'Buddy barks' (overridden)
console.log('Dog wag:', dog.wagTail()); // 'Buddy wags tail' (new method)

// Inheritance check
console.log('dog instanceof Dog:', dog instanceof Dog); // true
console.log('dog instanceof Animal:', dog instanceof Animal); // true

/* When to use inheritance vs composition? */