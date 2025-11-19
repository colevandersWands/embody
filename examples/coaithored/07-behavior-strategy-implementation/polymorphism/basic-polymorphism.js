'use strict';

/* Polymorphism: Basic Polymorphism

Demonstrates same interface, different implementations.
Shows objects responding to same method calls differently.

Study with:
- ?trace to see method dispatch
- ?variables to see different object types
*/

// Different animals with same interface
let dog = {
    name: 'Buddy',
    makeSound: function() {
        return 'Woof!';
    }
};

let cat = {
    name: 'Whiskers',
    makeSound: function() {
        return 'Meow!';
    }
};

let bird = {
    name: 'Tweety',
    makeSound: function() {
        return 'Tweet!';
    }
};

// Array of different animals
let animals = [dog, cat, bird];

// Same method call, different behaviors
console.log('Animal sounds:');
animals.forEach(animal => {
    console.log(`${animal.name} says: ${animal.makeSound()}`);
});

// Function that works with any animal
function makeAnimalSpeak(animal) {
    console.log(`The animal named ${animal.name} makes: ${animal.makeSound()}`);
}

console.log('\nUsing polymorphic function:');
makeAnimalSpeak(dog);
makeAnimalSpeak(cat);
makeAnimalSpeak(bird);

/*
Educational questions:
- How does the same method call produce different results?
- What makes this "polymorphic"?
- Why is this useful for code organization?
*/