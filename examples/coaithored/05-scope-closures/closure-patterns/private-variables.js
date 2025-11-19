'use strict';

/* Closure Patterns: Private Variables

Demonstrates using closures to create private variables
that cannot be accessed from outside the function.

Study with:
- ?variables to see scope boundaries
- ?trace to see encapsulation in action
*/

function createPerson(name) {
    // Private variables - not accessible from outside
    let _name = name;
    let _age = 0;
    let _secrets = ['likes pizza', 'afraid of spiders'];
    
    // Public interface through closures
    return {
        getName: function() {
            return _name;
        },
        
        setAge: function(newAge) {
            if (newAge >= 0 && newAge <= 150) {
                _age = newAge;
                console.log(`Age set to ${_age}`);
            } else {
                console.log('Invalid age');
            }
        },
        
        getAge: function() {
            return _age;
        },
        
        getInfo: function() {
            return `${_name} is ${_age} years old`;
        }
        
        // Note: _secrets is completely private - no access provided
    };
}

// Create person with private data
console.log('=== Creating Person ===');
const person = createPerson('Alice');

// Can only access through public methods
console.log('=== Public Access ===');
console.log('Name:', person.getName());
person.setAge(25);
console.log('Info:', person.getInfo());

// Private variables are truly private
console.log('\n=== Privacy Check ===');
console.log('person._name:', person._name);        // undefined
console.log('person._age:', person._age);          // undefined
console.log('person._secrets:', person._secrets);  // undefined

/*
Educational questions:
- Why can't we access _name directly?
- How do the public methods access private variables?
- What happens if we try to modify person._age?
*/