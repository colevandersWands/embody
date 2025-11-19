'use strict';

/* Strategy Pattern: Payment Strategies Overview

Payment strategy concepts distilled to essence:
- payment-strategies-essence.js - different methods, same interface
- (additional focused examples as needed)

Study with: Start with payment-strategies-essence.js */

// Payment strategies with detailed processing
let paymentStrategies = {
    card: {
        process(amount, details) {
            console.log(`Card payment: $${amount}`);
            console.log(`Card: ****${details.number.slice(-4)}`);
            return { success: true, fee: amount * 0.03 };
        }
    },
    
    paypal: {
        process(amount, details) {
            console.log(`PayPal payment: $${amount}`);
            console.log(`Email: ${details.email}`);
            return { success: true, fee: amount * 0.04 };
        }
    },
    
    crypto: {
        process(amount, details) {
            console.log(`Crypto payment: $${amount}`);
            console.log(`Wallet: ${details.wallet}`);
            return { success: true, fee: amount * 0.01 };
        }
    }
};

// Payment processor
function processPayment(amount, method, details) {
    let strategy = paymentStrategies[method];
    
    if (!strategy) {
        return { success: false, error: 'Unsupported method' };
    }
    
    return strategy.process(amount, details);
}

// Test different payment methods
let cardResult = processPayment(100, 'card', { number: '1234567890123456' });
let paypalResult = processPayment(50, 'paypal', { email: 'user@example.com' });
let cryptoResult = processPayment(200, 'crypto', { wallet: 'abc123...' });

console.log('Results:', { cardResult, paypalResult, cryptoResult });

/* See essence files for detailed payment strategy exploration */