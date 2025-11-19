'use strict';

/* Modules: Revealing Module Pattern Essence

Revealing module pattern = define all functions privately, then reveal selected ones.
Cleaner than defining public functions directly in return object.

Study with: ?variables to see function organization */

let Calculator = (function() {
    // Private variables
    let history = [];
    
    // Private function
    function log(operation, result) {
        history.push(`${operation} = ${result}`);
    }
    
    // Functions defined privately (cleaner than inline)
    function add(a, b) {
        let result = a + b;
        log(`${a} + ${b}`, result);
        return result;
    }
    
    function multiply(a, b) {
        let result = a * b;
        log(`${a} * ${b}`, result);
        return result;
    }
    
    function getHistory() {
        return [...history];
    }
    
    // Reveal selected functions as public interface
    return {
        add: add,           // Reveal add
        multiply: multiply, // Reveal multiply  
        history: getHistory // Reveal getHistory
        // log() stays private
    };
})();

// Use revealed interface
console.log('Add:', Calculator.add(5, 3));
console.log('Multiply:', Calculator.multiply(4, 2));
console.log('History:', Calculator.history());

// Private functions not accessible
console.log('log accessible?', typeof Calculator.log); // undefined

/* Why define functions privately first instead of inline in return object? */