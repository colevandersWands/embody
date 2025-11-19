'use strict';

/* Variables: Reading Values

Demonstrates different ways to access and use variable values.
Shows variables in expressions, comparisons, and function calls.

Study with:
- ?variables to see how often each variable is read
- ?trace to watch variable access patterns
*/

// Create variables with different values
let price = 12.99;
let quantity = 3;
let discount = 0.1;
let productName = 'Coffee Mug';

// Read variables in calculations
let subtotal = price * quantity;
let discountAmount = subtotal * discount;
let total = subtotal - discountAmount;

// Read variables in string building
let receipt = 'Product: ' + productName + '\nQuantity: ' + quantity + '\nPrice: $' + price + '\nSubtotal: $' + subtotal + '\nDiscount: $' + discountAmount + '\nTotal: $' + total;

// Read variables in comparisons
let isExpensive = total > 30;
let hasDiscount = discountAmount > 0;

// Output results
console.log(receipt);
console.log('Expensive?', isExpensive);
console.log('Has discount?', hasDiscount);

/*
Educational questions:
- How many times is each variable read?
- What's the difference between reading and writing variables?
- How do variables work in mathematical expressions?
- How does template string syntax read variables?
*/