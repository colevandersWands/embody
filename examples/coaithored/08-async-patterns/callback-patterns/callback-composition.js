'use strict';

/* Callback Patterns: Callback Composition Overview

Callback composition concepts distilled to essence:
- callback-composition-essence.js - named functions vs nesting
- (additional focused examples as needed)

Study with: Start with callback-composition-essence.js */

// Async pipeline operations
function fetchData(id, callback) {
    setTimeout(() => callback(null, `data-${id}`), 50);
}

function processData(data, callback) {
    setTimeout(() => callback(null, data.toUpperCase()), 50);
}

// Named functions approach - flat structure
function handleProcess(err, data) {
    processData(data, handleComplete);
}

function handleComplete(err, result) {
    console.log('Pipeline result:', result);
}

// Execute the pipeline
fetchData(42, handleProcess);

// Compare with nested approach (harder to debug)
fetchData(84, (err, data) => {
    processData(data, (err, result) => {
        console.log('Nested result:', result);
    });
});

console.log('Named functions = flatter code, easier debugging');

/* See essence files for detailed composition exploration */