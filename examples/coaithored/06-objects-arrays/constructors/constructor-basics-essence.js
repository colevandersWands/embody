'use strict';

/* Constructors: Constructor Basics Essence

Constructor functions + new keyword = object factory.
new creates object, binds to this, returns it automatically.

Study with: ?variables to see this binding during creation */

// Constructor function (capitalize by convention)
function Person(name, age) {
    this.name = name;   // Property on new object
    this.age = age;     // Property on new object
}

// Create instances with new
let person1 = new Person('Alice', 25);
let person2 = new Person('Bob', 30);

console.log('Person 1:', person1.name, person1.age); // Alice 25
console.log('Person 2:', person2.name, person2.age); // Bob 30

// Each instance is independent
person1.name = 'Alice Smith';
console.log('After change:', person1.name); // Alice Smith  
console.log('Bob unchanged:', person2.name); // Bob

// What new does:
// 1. Creates empty object {}
// 2. Sets this = that object
// 3. Runs constructor function
// 4. Returns the object

/* Why do we need constructor functions? */