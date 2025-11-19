'use strict';

/* Strategy Pattern: Payment Strategies Essence

Payment strategies = different payment methods, same interface.
Client doesn't know implementation details, just calls process().

Study with: ?trace to see strategy selection and execution */

// Payment strategies with same interface
let paymentMethods = {
    card: (amount) => `Charged $${amount} to card`,
    paypal: (amount) => `Sent $${amount} via PayPal`,
    cash: (amount) => `Received $${amount} in cash`
};

// Context uses strategy without knowing details
function processPayment(amount, method) {
    let strategy = paymentMethods[method];
    
    if (!strategy) {
        return 'Payment method not supported';
    }
    
    console.log('Processing payment...');
    return strategy(amount);
}

// Use different strategies
console.log(processPayment(100, 'card'));
console.log(processPayment(50, 'paypal'));
console.log(processPayment(25, 'cash'));
console.log(processPayment(75, 'bitcoin')); // Unsupported

// Easy to add new strategies
paymentMethods.venmo = (amount) => `Venmo transfer: $${amount}`;
console.log(processPayment(30, 'venmo'));

/* Why is this better than if/else statements for each payment type? */