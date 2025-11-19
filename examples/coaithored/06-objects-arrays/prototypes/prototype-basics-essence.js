'use strict';

/* Prototypes: Prototype Basics Essence

Prototype = template object that other objects inherit from.
Object.create() links object to prototype for property sharing.

Study with: ?variables to see prototype relationships */

// Prototype object with shared properties/methods
let personPrototype = {
    species: 'human',
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Create objects that inherit from prototype
let alice = Object.create(personPrototype);
alice.name = 'Alice';

let bob = Object.create(personPrototype);
bob.name = 'Bob';

// Both objects share prototype properties
console.log('Alice species:', alice.species);  // From prototype
console.log('Bob species:', bob.species);      // From prototype

console.log('Alice greet:', alice.greet());    // Method from prototype
console.log('Bob greet:', bob.greet());        // Method from prototype

// Own properties vs inherited properties
console.log('Alice owns name:', alice.hasOwnProperty('name'));     // true
console.log('Alice owns species:', alice.hasOwnProperty('species')); // false

// Prototype linkage
console.log('Same prototype:', Object.getPrototypeOf(alice) === personPrototype);

/* Why use prototypes instead of copying properties to each object? */