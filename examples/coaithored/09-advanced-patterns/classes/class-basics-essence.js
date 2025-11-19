'use strict';

/* Classes: Class Basics Essence

Classes are syntactic sugar for constructor functions and prototypes.
constructor() method runs when creating instances with new.

Study with: ?variables to see prototype setup */

// Basic class declaration
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return 'Hello, I am ' + this.name;
    }
    
    getInfo() {
        return this.name + ' is ' + this.age + ' years old';
    }
}

// Create instances
let person1 = new Person('Alice', 30);
let person2 = new Person('Bob', 25);

console.log('Person 1:', person1.greet()); // 'Hello, I am Alice'
console.log('Person 2:', person2.getInfo()); // 'Bob is 25 years old'

// Classes are functions under the hood
console.log('typeof Person:', typeof Person); // 'function'
console.log('person1 instanceof Person:', person1 instanceof Person); // true

// Methods are on the prototype
console.log('Method on prototype:', Person.prototype.hasOwnProperty('greet')); // true
console.log('Property on instance:', person1.hasOwnProperty('name')); // true

/* How are classes different from functions? */