'use strict';

/* Closures: Closure Independence

Demonstrates how each closure maintains its own independent
copy of variables from the outer scope.

Study with:
- ?variables to see separate variable instances
- ?trace to see independent modifications
*/

function createAccount(initialBalance) {
    let balance = initialBalance; // Each closure gets its own balance
    
    return function(operation, amount) {
        if (operation === 'deposit') {
            balance += amount;
        } else if (operation === 'withdraw') {
            balance -= amount;
        }
        
        console.log(`Account balance: $${balance}`);
        return balance;
    };
}

// Create independent accounts
console.log('=== Creating Independent Accounts ===');
const account1 = createAccount(100);
const account2 = createAccount(50);

// Each account maintains its own balance
console.log('\n=== Account 1 Operations ===');
account1('deposit', 25);   // $125
account1('withdraw', 10);  // $115

console.log('\n=== Account 2 Operations ===');
account2('deposit', 75);   // $125
account2('withdraw', 30);  // $95

console.log('\n=== Final Check - Still Independent ===');
account1('deposit', 0);    // Still $115
account2('deposit', 0);    // Still $95

/*
Educational questions:
- How does each account maintain separate balances?
- What would happen if balance was global?
- When are the separate closures created?
*/