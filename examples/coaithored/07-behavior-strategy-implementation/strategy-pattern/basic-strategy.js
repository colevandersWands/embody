'use strict';

/* Strategy Pattern: Basic Strategy Overview

Strategy pattern concepts distilled to essence:
- basic-strategy-essence.js - swapping algorithms at runtime
- (additional focused examples as needed)

Study with: Start with basic-strategy-essence.js */

// Strategies for different sorting approaches
let sortStrategies = {
    simple: arr => [...arr].sort((a, b) => a - b),
    reverse: arr => [...arr].sort((a, b) => b - a),
    shuffle: arr => {
        let result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
};

// Context uses strategies
function ArrayProcessor() {
    let strategy = sortStrategies.simple;
    
    return {
        setStrategy(name) {
            strategy = sortStrategies[name];
            console.log('Strategy set to:', name);
        },
        
        process(array) {
            return strategy(array);
        }
    };
}

// Demonstrate strategy switching
let processor = ArrayProcessor();
let numbers = [5, 2, 8, 1, 9];

console.log('Original:', numbers);
console.log('Simple sort:', processor.process(numbers));

processor.setStrategy('reverse');
console.log('Reverse sort:', processor.process(numbers));

processor.setStrategy('shuffle');
console.log('Shuffled:', processor.process(numbers));

/* See essence files for detailed strategy pattern exploration */