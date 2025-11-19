'use strict';

/* Objects: Nested Objects

Demonstrates objects containing other objects.
Shows deep property access and modification.

Study with:
- ?variables to see nested structure
- ?trace to follow deep property access
*/

let user = {
    name: 'Bob',
    age: 30,
    address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA'
    },
    preferences: {
        theme: 'dark',
        notifications: {
            email: true,
            push: false
        }
    }
};

// Accessing nested properties
console.log('User name:', user.name);
console.log('User city:', user.address.city);
console.log('Email notifications:', user.preferences.notifications.email);

// Modifying nested properties
user.address.city = 'Boston';
user.preferences.theme = 'light';
console.log('\nAfter modifications:');
console.log('New city:', user.address.city);
console.log('New theme:', user.preferences.theme);

// Adding nested properties
user.address.zipCode = '02134';
console.log('\nAdded zip code:', user.address.zipCode);

// Check if nested property exists
let hasPhone = user.address.phone !== undefined;
console.log('\nHas phone in address?', hasPhone);

/*
Educational questions:
- How do you safely access deeply nested properties?
- What happens if you access a property of undefined?
- How can you check if nested properties exist?
*/