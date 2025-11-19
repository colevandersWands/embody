'use strict';

/* Modules: Basic Module Pattern Essence

Module = IIFE that returns object with public methods.
Private variables stay inside, public methods are exposed.

Study with: ?variables to see public vs private scope */

// Basic module structure
let MyModule = (function() {
    // Private - only accessible inside IIFE
    let privateData = 'secret';
    
    function privateFunction() {
        return 'only module can call this';
    }
    
    // Public - returned in object
    return {
        publicMethod: function() {
            console.log('Public method called');
            console.log('Accessing private:', privateData);
            return privateFunction();
        },
        
        getData: function() {
            return privateData;
        }
    };
})(); // IIFE executes immediately

// Using the module
console.log(MyModule.publicMethod()); // Works
console.log(MyModule.getData());      // Works

// Privacy test
console.log(MyModule.privateData);     // undefined
console.log(MyModule.privateFunction); // undefined

/* How does the IIFE create encapsulation? */