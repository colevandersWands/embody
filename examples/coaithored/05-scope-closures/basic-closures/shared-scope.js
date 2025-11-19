'use strict';

/* Closures: Shared Scope

Demonstrates how multiple functions from the same outer scope
can share access to the same variables.

Study with:
- ?variables to see shared variable access
- ?trace to see coordinated modifications
*/

function createModule() {
    let privateData = 'secret'; // Shared by both functions
    let accessCount = 0;        // Also shared
    
    function getData() {
        accessCount++;
        console.log(`Accessing data (${accessCount} times): ${privateData}`);
        return privateData;
    }
    
    function setData(newData) {
        accessCount++;
        console.log(`Setting data (${accessCount} times): ${newData}`);
        privateData = newData;
    }
    
    // Both functions share the same scope
    return { getData, setData };
}

// Create module with shared private scope
console.log('=== Creating Module ===');
const module = createModule();

// Both functions access the same variables
console.log('\n=== Shared Access ===');
module.getData();           // Access count: 1
module.setData('new data'); // Access count: 2
module.getData();           // Access count: 3, shows 'new data'

console.log('\n=== Both functions see the changes ===');
module.setData('final data'); // Access count: 4
module.getData();             // Access count: 5, shows 'final data'

/*
Educational questions:
- How do both functions access the same variables?
- What's the difference between shared and independent closures?
- How is this useful for creating modules?
*/