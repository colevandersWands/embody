'use strict';

/* Prototypes: Prototype Chain Essence

JavaScript searches for properties by walking up the prototype chain.
Object -> prototype -> prototype's prototype -> ... -> null

Study with: ?variables to see chain traversal during property access */

// Create a simple chain: parent -> child
let parent = {
    shared: 'from parent',
    method: function() { return 'parent method'; }
};

let child = Object.create(parent);
child.own = 'from child';

// Property lookup walks the chain
console.log('Own property:', child.own);       // Found on child
console.log('Inherited property:', child.shared); // Found on parent  
console.log('Inherited method:', child.method()); // Found on parent

// Property not found anywhere
console.log('Missing property:', child.missing); // undefined

// Shadowing: child property hides parent property
child.shared = 'child overrides parent';
console.log('Shadowed property:', child.shared); // From child now

// Delete reveals parent property
delete child.shared;
console.log('After delete:', child.shared); // Back to parent value

/* How does JavaScript find properties in the chain? */