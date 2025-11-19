'use strict';

/* Strategy Pattern: Validation Strategies Essence

Strategy pattern = swap algorithms (validation rules) without changing client code.
Each validator is a strategy with same interface, different behavior.

Study with: ?trace to see strategy selection and execution */

// Validation strategies - same interface, different logic
let validators = {
    required: function(value) {
        return value ? 'Valid' : 'Required field';
    },
    
    email: function(value) {
        let isEmail = value.includes('@') && value.includes('.');
        return isEmail ? 'Valid email' : 'Invalid email';
    },
    
    minLength: function(value, min = 3) {
        return value.length >= min ? 'Valid length' : `Need ${min}+ chars`;
    }
};

// Client uses strategies without knowing details
function validate(value, strategyName, param) {
    let strategy = validators[strategyName];
    return strategy(value, param);
}

// Test different strategies
console.log('Required:', validate('hello', 'required'));
console.log('Email:', validate('user@site.com', 'email'));
console.log('Length:', validate('hi', 'minLength', 5));

// Easy to add new strategies
validators.number = function(value) {
    return !isNaN(value) ? 'Valid number' : 'Must be number';
};

console.log('Number:', validate('123', 'number'));

/* Why is the strategy pattern useful for validation? */