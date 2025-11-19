'use strict';

/* Closure Patterns: Module Pattern Overview

Module pattern concepts distilled to essence:
- module-pattern-essence.js - IIFE with private state and public interface
- (additional focused examples as needed)

Study with: Start with module-pattern-essence.js */

// Advanced module patterns and variations
const BankAccount = (function() {
    // Module factory function
    return function(initialBalance) {
        // Private state per instance
        let balance = initialBalance || 0;
        let transactions = [];
        
        // Private helper
        function recordTransaction(type, amount) {
            transactions.push({
                type: type,
                amount: amount,
                balance: balance,
                timestamp: Date.now()
            });
        }
        
        // Public interface
        return {
            deposit: function(amount) {
                if (amount > 0) {
                    balance += amount;
                    recordTransaction('deposit', amount);
                    console.log(`Deposited: $${amount}, Balance: $${balance}`);
                    return true;
                }
                return false;
            },
            
            withdraw: function(amount) {
                if (amount > 0 && amount <= balance) {
                    balance -= amount;
                    recordTransaction('withdrawal', amount);
                    console.log(`Withdrew: $${amount}, Balance: $${balance}`);
                    return true;
                }
                console.log('Insufficient funds');
                return false;
            },
            
            getBalance: function() {
                return balance;
            },
            
            getStatement: function() {
                return transactions.map(t => 
                    `${t.type}: $${t.amount} (Balance: $${t.balance})`
                );
            }
        };
    };
})();

// Singleton module with initialization
const AppConfig = (function() {
    let initialized = false;
    let settings = {};
    
    return {
        init: function(config) {
            if (!initialized) {
                settings = { ...config };
                initialized = true;
                console.log('Configuration initialized');
            } else {
                console.log('Already initialized');
            }
        },
        
        get: function(key) {
            return settings[key];
        },
        
        set: function(key, value) {
            if (initialized) {
                settings[key] = value;
                console.log(`Setting ${key} updated`);
            } else {
                console.log('Not initialized');
            }
        }
    };
})();

// Revealing module pattern
const StringUtilities = (function() {
    // All private
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function reverse(str) {
        return str.split('').reverse().join('');
    }
    
    function countWords(str) {
        return str.trim().split(/\s+/).length;
    }
    
    // Reveal selected functions
    return {
        capitalize: capitalize,
        reverse: reverse,
        wordCount: countWords
    };
})();

// Demonstrate module usage
console.log('=== Bank Account Module Factory ===');
const account1 = BankAccount(100);
const account2 = BankAccount(50);

account1.deposit(50);
account1.withdraw(30);
console.log('Account 1 balance:', account1.getBalance());

account2.deposit(25);
console.log('Account 2 balance:', account2.getBalance());

console.log('\n=== Singleton Configuration Module ===');
AppConfig.init({ theme: 'dark', language: 'en' });
AppConfig.init({ theme: 'light' }); // Won't reinitialize
AppConfig.set('theme', 'light');
console.log('Theme:', AppConfig.get('theme'));

console.log('\n=== Revealing Module Pattern ===');
console.log('Capitalized:', StringUtilities.capitalize('hello'));
console.log('Reversed:', StringUtilities.reverse('world'));
console.log('Word count:', StringUtilities.wordCount('the quick brown fox'));

/* See essence files for focused module pattern exploration */