'use strict';

/* Modules: Namespace Pattern Overview

Namespace pattern concepts distilled to essence:
- namespace-pattern-essence.js - organizing code under single global
- (additional focused examples as needed)

Study with: Start with namespace-pattern-essence.js */

// Application namespace with multiple modules
let MyApp = {};

// Utils module
MyApp.Utils = {
    formatCurrency: amount => `$${amount.toFixed(2)}`,
    generateId: () => Math.random().toString(36).substr(2, 9)
};

// User module  
MyApp.User = {
    current: null,
    login(name) {
        this.current = { name, id: MyApp.Utils.generateId() };
        console.log('Logged in:', name);
    }
};

// Shopping module
MyApp.Shopping = {
    cart: [],
    addItem(item) {
        this.cart.push({ ...item, id: MyApp.Utils.generateId() });
        console.log('Added:', item.name);
    },
    getTotal() { 
        return this.cart.reduce((sum, item) => sum + item.price, 0); 
    }
};

// Demonstrate namespace usage
MyApp.User.login('Alice');
MyApp.Shopping.addItem({ name: 'Book', price: 19.99 });
MyApp.Shopping.addItem({ name: 'Pen', price: 2.50 });

console.log('Total:', MyApp.Utils.formatCurrency(MyApp.Shopping.getTotal()));
console.log('Clean global scope - only MyApp added');

/* See essence files for detailed namespace pattern exploration */