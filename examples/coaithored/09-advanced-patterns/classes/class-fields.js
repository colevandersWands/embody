'use strict';

/* Classes: Class Fields Overview

Class field concepts distilled to essence:
- class-fields-essence.js - public and private field syntax
- (additional focused examples as needed)

Study with: Start with class-fields-essence.js */

// Quick demonstration of class fields
class QuickDemo {
    // Public fields
    value = 42;
    status = 'ready';
    
    // Private field
    #internal = 'private';
    
    getValue() {
        return this.value;
    }
    
    getInternal() {
        return this.#internal; // Private access from inside
    }
}

let demo = new QuickDemo();
console.log('Public field:', demo.value); // 42
console.log('Status:', demo.status); // 'ready'
console.log('Private via method:', demo.getInternal()); // 'private'

// Fields vs constructor comparison
class Traditional {
    constructor() {
        this.oldWay = 'constructor assignment';
    }
}

console.log('Traditional:', new Traditional().oldWay);
console.log('Modern fields:', new QuickDemo().value);

/* See essence files for detailed field exploration */