'use strict';

/* Constructors: Constructor Basics Overview

Constructor basic concepts distilled to essence:
- constructor-basics-essence.js - new keyword and this binding
- (additional focused examples as needed)

Study with: Start with constructor-basics-essence.js */

// Basic constructor pattern
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Create multiple instances
let alice = new Person('Alice', 25);
let bob = new Person('Bob', 30);

console.log('Alice:', alice.name, alice.age);
console.log('Bob:', bob.name, bob.age);

// Instances are independent objects
alice.name = 'Alice Smith';
console.log('After change - Alice:', alice.name);
console.log('Bob unchanged:', bob.name);

// Constructor vs regular function call
function showThis() {
    console.log('this in function:', this === undefined); // true in strict mode
}

showThis();      // Regular function call
new showThis();  // Constructor call creates object

console.log('Constructor creates objects, function calls don\'t');

/* See essence files for detailed constructor exploration */