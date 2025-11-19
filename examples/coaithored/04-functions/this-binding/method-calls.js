'use strict';

/* This Binding: Method Calls

Demonstrates how 'this' is bound when functions are called
as methods of objects.

Study with:
- ?variables to see this binding changes
- ?trace to see method call context
*/

// Object with methods
const person = {
    name: 'Alice',
    age: 30,
    
    greet: function() {
        console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old`);
        return this; // Return this for chaining
    },
    
    getInfo: function() {
        console.log(`Person info: ${this.name}, age ${this.age}`);
        return `${this.name} (${this.age})`;
    }
};

// Method calls - this refers to the object
console.log('=== Method Calls ===');
person.greet();   // this = person
person.getInfo(); // this = person

// Different object with same methods
const student = {
    name: 'Bob',
    age: 20,
    greet: person.greet,     // Same function, different object
    getInfo: person.getInfo  // Same function, different object
};

console.log('\n=== Same Methods, Different Objects ===');
student.greet();   // this = student (not person!)
student.getInfo(); // this = student

// Method assignment breaks the binding
console.log('\n=== Method Assignment ===');
const greetFunction = person.greet; // Extract method
// greetFunction(); // Would throw error in strict mode (this = undefined)

/*
Educational questions:
- How does JavaScript determine what 'this' refers to?
- Why does student.greet() show Bob's name?
- What happens when we assign a method to a variable?
*/