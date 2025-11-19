'use strict';

/* Prototypes: Prototype Chain Overview

Prototype chain concepts distilled to essence:
- prototype-chain-essence.js - property lookup traversal
- (additional focused examples as needed)

Study with: Start with prototype-chain-essence.js */

// Multi-level prototype chain
let animal = { type: 'animal', breathe() { return 'breathing'; } };
let mammal = Object.create(animal);
mammal.warmBlooded = true;

let dog = Object.create(mammal);
dog.species = 'canine';

let myDog = Object.create(dog);
myDog.name = 'Buddy';

// Chain lookup in action
console.log('Own property:', myDog.name);        // level 0: myDog
console.log('1 level up:', myDog.species);       // level 1: dog
console.log('2 levels up:', myDog.warmBlooded);  // level 2: mammal  
console.log('3 levels up:', myDog.type);         // level 3: animal
console.log('Not found:', myDog.missing);        // undefined

// Property shadowing
mammal.sound = 'mammal sound';
dog.sound = 'dog sound';
myDog.sound = 'buddy sound';

console.log('Shadowed:', myDog.sound); // Own property wins
delete myDog.sound;
console.log('After delete:', myDog.sound); // Reveals parent property

/* See essence files for detailed prototype chain exploration */