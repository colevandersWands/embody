'use strict';

/* Objects: Iterating Over Properties

Demonstrates different ways to iterate over object properties.
Shows for...in, Object.keys(), Object.values(), Object.entries().

Study with:
- ?trace to follow iteration order
- ?variables to see key-value pairs
*/

let product = {
    name: 'Laptop',
    price: 999,
    brand: 'TechCo',
    inStock: true
};

// Using for...in
console.log('Using for...in:');
for (let key in product) {
    console.log(`  ${key}: ${product[key]}`);
}

// Using Object.keys()
console.log('\nUsing Object.keys():');
let keys = Object.keys(product);
console.log('Keys:', keys);
keys.forEach(key => {
    console.log(`  ${key}: ${product[key]}`);
});

// Using Object.values()
console.log('\nUsing Object.values():');
let values = Object.values(product);
console.log('Values:', values);

// Using Object.entries()
console.log('\nUsing Object.entries():');
let entries = Object.entries(product);
entries.forEach(([key, value]) => {
    console.log(`  ${key} = ${value}`);
});

/*
Educational questions:
- What's the difference between these iteration methods?
- When would you use each one?
- What order do properties iterate in?
*/