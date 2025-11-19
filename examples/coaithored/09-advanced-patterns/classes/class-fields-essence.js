'use strict';

/* Classes: Class Fields Essence

Class fields: declare properties directly in class body.
Private fields: use # prefix for true encapsulation.

Study with: ?variables to see field initialization */

// Modern class field syntax
class Demo {
    // Public fields (no 'this.' needed in declaration)
    count = 0;
    name = 'Default';
    
    // Private fields (# prefix)
    #secret = 'hidden';
    
    increment() {
        this.count++;
        return this.count;
    }
    
    getSecret() {
        return this.#secret; // Only accessible inside class
    }
    
    setSecret(value) {
        this.#secret = value;
    }
}

let obj = new Demo();
console.log('Count:', obj.count); // 0
console.log('Name:', obj.name); // 'Default'
console.log('Incremented:', obj.increment()); // 1

// Private field access
console.log('Secret via method:', obj.getSecret()); // 'hidden'
obj.setSecret('new secret');
console.log('Updated secret:', obj.getSecret()); // 'new secret'

// console.log(obj.#secret); // SyntaxError! Private fields are truly private

/* Why use class fields over constructor assignment? */