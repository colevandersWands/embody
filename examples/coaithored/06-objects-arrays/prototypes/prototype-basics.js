'use strict';

/* Prototypes: Prototype Basics Overview

Prototype basic concepts distilled to essence:
- prototype-basics-essence.js - objects inheriting from prototypes
- (additional focused examples as needed)

Study with: Start with prototype-basics-essence.js */

// Prototype with shared properties
let animalPrototype = {
    kingdom: 'animal',
    breathe() { return `${this.name} breathes`; }
};

// Objects inherit from prototype
let dog = Object.create(animalPrototype);
dog.name = 'Rex';
dog.species = 'canine';

let cat = Object.create(animalPrototype);
cat.name = 'Fluffy';
cat.species = 'feline';

// Inherited properties
console.log('Dog kingdom:', dog.kingdom);    // From prototype
console.log('Cat kingdom:', cat.kingdom);    // From prototype

console.log('Dog breathe:', dog.breathe());  // Method from prototype
console.log('Cat breathe:', cat.breathe());  // Method from prototype

// Property shadowing
console.log('Before shadow:', dog.kingdom);
dog.kingdom = 'domestic animal';             // Shadows prototype
console.log('After shadow:', dog.kingdom);
console.log('Cat still inherits:', cat.kingdom);

// Own vs inherited
console.log('Dog owns name:', dog.hasOwnProperty('name'));      // true
console.log('Dog owns kingdom:', dog.hasOwnProperty('kingdom')); // true (shadowed)
console.log('Cat owns kingdom:', cat.hasOwnProperty('kingdom')); // false

/* See essence files for detailed prototype exploration */