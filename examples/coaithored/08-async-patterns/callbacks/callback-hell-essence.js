'use strict';

/* Async: Callback Hell Essence

Callback hell = deeply nested callbacks creating pyramid shape (>).
Each async operation needs the previous result, forcing nesting.

Study with: ?trace to see nested execution levels */

// Three async operations that depend on each other
function getData(callback) {
    setTimeout(() => callback('data'), 100);
}

function processData(data, callback) {
    setTimeout(() => callback(data + '_processed'), 100);
}

function saveData(data, callback) {
    setTimeout(() => callback(data + '_saved'), 100);
}

// Callback hell - notice the pyramid shape
getData(function(result1) {
    console.log('Got:', result1);
    
    processData(result1, function(result2) {
        console.log('Processed:', result2);
        
        saveData(result2, function(result3) {
            console.log('Final:', result3);
        });
    });
});

console.log('Started async chain');

/* Why does each callback nest deeper than the previous? */