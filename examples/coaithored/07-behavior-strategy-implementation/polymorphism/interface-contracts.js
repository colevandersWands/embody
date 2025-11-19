'use strict';

/* Polymorphism: Interface Contracts Overview

Interface contract concepts distilled to essence:
- interface-contracts-essence.js - duck typing and polymorphism basics
- (additional focused examples as needed)

Study with: Start with interface-contracts-essence.js */

// Complex interface definitions and checking
const Interfaces = {
    // Define multiple interface contracts
    Serializable: function(obj) {
        return obj && 
               typeof obj.toJSON === 'function' &&
               typeof obj.fromJSON === 'function';
    },
    
    Observable: function(obj) {
        return obj &&
               typeof obj.subscribe === 'function' &&
               typeof obj.unsubscribe === 'function' &&
               typeof obj.notify === 'function';
    },
    
    Comparable: function(obj) {
        return obj &&
               typeof obj.compareTo === 'function' &&
               typeof obj.equals === 'function';
    },
    
    // Combined interface checking
    isDataModel: function(obj) {
        return this.Serializable(obj) && this.Observable(obj);
    }
};

// Implementation of multiple interfaces
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.observers = [];
    }
    
    // Serializable interface
    toJSON() {
        return JSON.stringify({ name: this.name, price: this.price });
    }
    
    fromJSON(json) {
        const data = JSON.parse(json);
        this.name = data.name;
        this.price = data.price;
    }
    
    // Observable interface
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(event) {
        this.observers.forEach(obs => obs.update(event));
    }
    
    // Comparable interface
    compareTo(other) {
        return this.price - other.price;
    }
    
    equals(other) {
        return this.name === other.name && this.price === other.price;
    }
}

// Factory with interface validation
function createDataStore(modelClass) {
    const instance = new modelClass('Test', 0);
    
    if (!Interfaces.isDataModel(instance)) {
        throw new Error('Model must implement Serializable and Observable interfaces');
    }
    
    return {
        items: [],
        
        add: function(item) {
            if (item instanceof modelClass) {
                this.items.push(item);
                console.log(`Added ${item.name} to store`);
            }
        },
        
        save: function() {
            return this.items.map(item => item.toJSON());
        },
        
        load: function(jsonArray) {
            this.items = jsonArray.map(json => {
                const item = new modelClass('', 0);
                item.fromJSON(json);
                return item;
            });
        }
    };
}

// Polymorphic function using interfaces
function processComparables(items) {
    console.log('=== Processing Comparable Items ===');
    
    // Validate all items implement Comparable
    const allComparable = items.every(item => Interfaces.Comparable(item));
    if (!allComparable) {
        console.log('Not all items are comparable!');
        return;
    }
    
    // Sort using compareTo
    items.sort((a, b) => a.compareTo(b));
    
    // Find duplicates using equals
    for (let i = 0; i < items.length - 1; i++) {
        if (items[i].equals(items[i + 1])) {
            console.log(`Duplicate found: ${items[i].name}`);
        }
    }
    
    console.log('Sorted items:', items.map(i => `${i.name}: $${i.price}`));
}

// Demonstrate interface usage
console.log('=== Interface Contract Validation ===');

const product1 = new Product('Laptop', 999);
const product2 = new Product('Mouse', 29);
const product3 = new Product('Keyboard', 79);

console.log('Product1 is Serializable:', Interfaces.Serializable(product1));
console.log('Product1 is Observable:', Interfaces.Observable(product1));
console.log('Product1 is Comparable:', Interfaces.Comparable(product1));

console.log('\n=== Using Factory with Interface Checking ===');
const store = createDataStore(Product);
store.add(product1);
store.add(product2);

console.log('\n=== Polymorphic Processing ===');
processComparables([product1, product3, product2]);

/* See essence files for focused interface contract exploration */