'use strict';

/* This Binding: Call, Apply, Bind

Demonstrates explicit this binding using call(), apply(), and bind()
to control what 'this' refers to in function calls.

Study with:
- ?variables to see explicit this binding
- ?trace to see different binding methods
*/

// Function that uses 'this'
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
    return `${this.name} introduction complete`;
}

// Objects to bind to
const person1 = { name: 'Alice', age: 30 };
const person2 = { name: 'Bob', age: 25 };

// Using call() - first argument is 'this', rest are function arguments
console.log('=== Using call() ===');
introduce.call(person1, 'Hello', '!');     // this = person1
introduce.call(person2, 'Hi there', '.');  // this = person2

// Using apply() - first argument is 'this', second is array of arguments
console.log('\n=== Using apply() ===');
introduce.apply(person1, ['Greetings', '!!!']);
introduce.apply(person2, ['Hey', '...']);

// Using bind() - creates new function with permanent 'this' binding
console.log('\n=== Using bind() ===');
const aliceIntroduce = introduce.bind(person1);
const bobIntroduce = introduce.bind(person2);

aliceIntroduce('Good morning', '!'); // Always uses person1 as 'this'
bobIntroduce('Good evening', '.');   // Always uses person2 as 'this'

// Bind with partial application
console.log('\n=== Bind with Partial Application ===');
const friendlyHello = introduce.bind(person1, 'Hello there');
friendlyHello('!');     // Only need punctuation
friendlyHello('!!!');   // Different punctuation

/*
Educational questions:
- What's the difference between call() and apply()?
- How does bind() differ from call() and apply()?
- When would you use each method?
*/