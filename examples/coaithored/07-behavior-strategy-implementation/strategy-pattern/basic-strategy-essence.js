'use strict';

/* Strategy Pattern: Basic Strategy Essence

Strategy pattern = swap algorithms without changing client code.
Same interface, different implementations, runtime selection.

Study with: ?trace to see strategy switching in action */

// Different strategies with same interface
let strategies = {
    upperCase: text => text.toUpperCase(),
    lowerCase: text => text.toLowerCase(),
    reverse: text => text.split('').reverse().join('')
};

// Context uses strategy without knowing details
function TextProcessor() {
    let strategy = strategies.upperCase;
    
    return {
        setStrategy(name) {
            strategy = strategies[name];
            console.log('Strategy changed to:', name);
        },
        
        process(text) {
            return strategy(text);
        }
    };
}

// Use different strategies at runtime
let processor = TextProcessor();

console.log('Default:', processor.process('Hello World'));

processor.setStrategy('lowerCase');
console.log('Lower:', processor.process('Hello World'));

processor.setStrategy('reverse');
console.log('Reverse:', processor.process('Hello World'));

/* Why separate algorithm from the object that uses it? */