'use strict';

/* Strategy Pattern: Validation Strategies Overview

Validation strategy concepts distilled to essence:
- validation-strategies-essence.js - swappable validation algorithms
- (additional focused examples as needed)

Study with: Start with validation-strategies-essence.js */

// Simple validation strategies
let validators = {
    required: (value) => value ? null : 'Required',
    email: (value) => value.includes('@') ? null : 'Invalid email',
    minLength: (value, min) => value.length >= min ? null : `Need ${min}+ chars`
};

// Validator uses strategy pattern
function validate(value, rules) {
    for (let rule of rules) {
        let error = validators[rule.type](value, rule.param);
        if (error) return error;
    }
    return 'Valid';
}

// Test different validation combinations
console.log('Email test:', validate('user@site.com', [
    { type: 'required' },
    { type: 'email' }
]));

console.log('Password test:', validate('hi', [
    { type: 'required' },
    { type: 'minLength', param: 6 }
]));

// Easy to add new strategies
validators.numeric = (value) => /^\d+$/.test(value) ? null : 'Must be numeric';

console.log('Number test:', validate('123', [
    { type: 'required' },
    { type: 'numeric' }
]));

/* See essence files for detailed strategy pattern exploration */