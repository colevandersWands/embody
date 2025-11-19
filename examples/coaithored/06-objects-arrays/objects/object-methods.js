'use strict';

/* Objects: Methods

Demonstrates adding methods (functions) to objects.
Shows how this works in object methods.

Study with:
- ?trace to see method execution
- ?variables to see this binding
*/

let calculator = {
    value: 0,
    
    add: function(n) {
        this.value += n;
        console.log(`Added ${n}, value is now ${this.value}`);
        return this;
    },
    
    multiply: function(n) {
        this.value *= n;
        console.log(`Multiplied by ${n}, value is now ${this.value}`);
        return this;
    },
    
    reset: function() {
        this.value = 0;
        console.log('Reset to 0');
        return this;
    },
    
    getValue: function() {
        return this.value;
    }
};

// Using methods
calculator.add(5);
calculator.multiply(3);
console.log('Result:', calculator.getValue());

// Method chaining (returns this)
calculator
    .reset()
    .add(10)
    .multiply(2)
    .add(5);

console.log('Chained result:', calculator.getValue());

/*
Educational questions:
- What does 'this' refer to in methods?
- How does method chaining work?
- Why return 'this' from methods?
*/