'use strict';

/* Modules: Namespace Pattern Essence

Namespace pattern = organize code under single global object to avoid pollution.
Instead of many globals, create one container object with logical groupings.

Study with: ?variables to see namespace organization */

// Single global namespace
let MyApp = {};

// Group related functions under namespace
MyApp.Utils = {
    formatCurrency: function(amount) {
        return `$${amount.toFixed(2)}`;
    }
};

MyApp.User = {
    current: null,
    
    login: function(name) {
        this.current = { name: name };
        console.log('Logged in:', name);
    }
};

// Usage: access through namespace
MyApp.User.login('Alice');
console.log('Currency:', MyApp.Utils.formatCurrency(99.50));

// Benefit: only one global (MyApp) instead of many
console.log('Global count:', Object.keys(globalThis).filter(k => k === 'MyApp').length);

/* Why use namespaces instead of separate global functions? */